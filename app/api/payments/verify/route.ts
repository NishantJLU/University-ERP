import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const {
      transactionId,
      referenceNo,
      gatewayToken,
      sandboxOutcome, // "SUCCESS" | "USER_CANCELLED" | "GATEWAY_FAILURE"
      paymentChannel = "UPI_OR_CARD",
    } = await req.json();

    if (!transactionId || !gatewayToken) {
      return NextResponse.json(
        { success: false, message: "Transaction ID and verification token are required." },
        { status: 400 }
      );
    }

    // 1. Retrieve transaction from database
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { transactionId },
      include: {
        student: { include: { user: true } },
        studentFeeDue: { include: { feeStructure: true } },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction record not found." },
        { status: 404 }
      );
    }

    if (transaction.status === "SUCCESSFUL") {
      return NextResponse.json(
        { success: false, message: "This transaction has already been settled and verified." },
        { status: 400 }
      );
    }

    // 2. Server-side signature validation
    const secret = process.env.PAYMENT_SANDBOX_KEY || "sandbox_secret_key_univ_test_998877";
    const expectedPayload = `${transaction.transactionId}:${transaction.referenceNo}:${transaction.studentFeeDueId}:${transaction.amount}`;
    const expectedToken = crypto
      .createHmac("sha256", secret)
      .update(expectedPayload)
      .digest("hex");

    if (gatewayToken !== expectedToken) {
      console.warn("Security Alert: Payment verification signature mismatch detected!");
      return NextResponse.json(
        { success: false, message: "Cryptographic signature validation failed. Transaction rejected." },
        { status: 403 }
      );
    }

    // Handle failure simulation
    if (sandboxOutcome !== "SUCCESS") {
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: sandboxOutcome === "USER_CANCELLED" ? "CANCELLED" : "FAILED",
          metadata: JSON.stringify({ reason: sandboxOutcome, processedAt: new Date().toISOString() }),
        },
      });

      return NextResponse.json({
        success: false,
        message: `Payment not completed: ${sandboxOutcome}`,
        status: sandboxOutcome,
      });
    }

    // 3. Atomically update transaction, fee due, and generate official digital receipt
    const updatedFeeDueAmount = transaction.studentFeeDue.paidAmount + transaction.amount;
    const isFullyPaid = updatedFeeDueAmount >= transaction.studentFeeDue.totalAmount;
    const newStatus = isFullyPaid ? "PAID" : "PARTIALLY_PAID";

    // Generate cryptographic receipt hash
    const receiptNum = `REC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const receiptHash = `SHA256:${crypto
      .createHash("sha256")
      .update(`${receiptNum}:${transaction.id}:${transaction.amount}:${transaction.studentId}`)
      .digest("hex")}`;

    const [updatedTxn, updatedDue, receipt] = await prisma.$transaction([
      // Update transaction to SUCCESSFUL
      prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESSFUL",
          paymentMethod: `SANDBOX_${paymentChannel}`,
          metadata: JSON.stringify({
            verifiedBy: "SERVER_WEBHOOK_VERIFIER",
            channel: paymentChannel,
            verifiedAt: new Date().toISOString(),
          }),
        },
      }),

      // Update student fee record
      prisma.studentFeeDue.update({
        where: { id: transaction.studentFeeDueId },
        data: {
          paidAmount: updatedFeeDueAmount,
          status: newStatus,
        },
      }),

      // Generate digital receipt
      prisma.receipt.create({
        data: {
          receiptNumber: receiptNum,
          paymentTransactionId: transaction.id,
          studentId: transaction.studentId,
          amountPaid: transaction.amount,
          receiptHash,
        },
      }),
    ]);

    // 4. Create Audit Log
    await createAuditLog({
      actor: user,
      action: "PAYMENT_VERIFIED",
      entity: "PaymentTransaction",
      entityId: transaction.id,
      details: {
        transactionId: transaction.transactionId,
        studentName: transaction.student.user.name,
        rollNumber: transaction.student.rollNumber,
        amount: transaction.amount,
        receiptNumber: receipt.receiptNumber,
        feeStatus: newStatus,
      },
    });

    // 5. Create in-app Notification for student
    await prisma.notification.create({
      data: {
        userId: transaction.student.userId,
        title: "Fee Payment Confirmed",
        message: `Your payment of ₹${transaction.amount.toLocaleString()} for ${transaction.studentFeeDue.feeStructure.title} was successful. Receipt: ${receipt.receiptNumber}`,
        type: "PAYMENT",
        linkUrl: "/student/receipts",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and settled.",
      transaction: updatedTxn,
      receipt,
      feeStatus: newStatus,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, message: "Payment verification failed." },
      { status: 500 }
    );
  }
}
