import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { studentFeeDueId, amount } = await req.json();

    if (!studentFeeDueId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid fee due and payable amount required." },
        { status: 400 }
      );
    }

    const feeDue = await prisma.studentFeeDue.findUnique({
      where: { id: studentFeeDueId },
      include: { student: { include: { user: true } }, feeStructure: true },
    });

    if (!feeDue) {
      return NextResponse.json({ success: false, message: "Fee record not found." }, { status: 404 });
    }

    // Security check: Only the student themselves or Accounts/Admin can initiate
    if (user.role === "STUDENT" && feeDue.student.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Cannot initiate payment for another student." },
        { status: 403 }
      );
    }

    const remainingDue = feeDue.totalAmount - feeDue.paidAmount;
    if (amount > remainingDue) {
      return NextResponse.json(
        { success: false, message: `Amount exceeds remaining due of ₹${remainingDue.toLocaleString()}.` },
        { status: 400 }
      );
    }

    // Generate unique enterprise transaction & reference codes
    const timestamp = Date.now();
    const randomHex = crypto.randomBytes(4).toString("hex").toUpperCase();
    const transactionId = `TXN-APX-${timestamp.toString().slice(-6)}-${randomHex}`;
    const referenceNo = `SBX_REF_${crypto.randomBytes(6).toString("hex")}`;

    // Generate tamper-proof server token
    const secret = process.env.PAYMENT_SANDBOX_KEY || "sandbox_secret_key_univ_test_998877";
    const signaturePayload = `${transactionId}:${referenceNo}:${feeDue.id}:${amount}`;
    const gatewayToken = crypto
      .createHmac("sha256", secret)
      .update(signaturePayload)
      .digest("hex");

    // Create pending payment transaction in database
    const transaction = await prisma.paymentTransaction.create({
      data: {
        transactionId,
        referenceNo,
        studentId: feeDue.studentId,
        studentFeeDueId: feeDue.id,
        amount,
        paymentMethod: "SANDBOX_GATEWAY",
        status: "PENDING",
        gatewayToken,
        metadata: JSON.stringify({
          initiatorUserId: user.id,
          initiatedAt: new Date().toISOString(),
          feeTitle: feeDue.feeStructure.title,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      transactionId: transaction.transactionId,
      referenceNo: transaction.referenceNo,
      gatewayToken: transaction.gatewayToken,
      amount,
      studentName: feeDue.student.user.name,
      studentRoll: feeDue.student.rollNumber,
      feeTitle: feeDue.feeStructure.title,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { success: false, message: "Payment gateway initialization failed." },
      { status: 500 }
    );
  }
}
