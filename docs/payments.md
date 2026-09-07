# Fees & Sandbox Payment Gateway Architecture

## Secure Financial Workflow

```
       Fee Structure Defined by Accounts
                      ↓
          Student Due Invoice Created
                      ↓
       Student Initiates Payment (/api/payments/initiate)
                      ↓
  Server Generates Signed Order & HMAC Token (PENDING)
                      ↓
      Sandbox Gateway Checkout Modal
                      ↓
       Server Verification (/api/payments/verify)
       (Cryptographic HMAC & Settlement Validation)
                      ↓
 ┌────────────────────┴────────────────────┐
 │                                         │
Transaction: SUCCESSFUL           Transaction: FAILED / CANCELLED
StudentFeeDue: Settled                     No balance changes
Receipt: Issued with SHA-256 Seal
AuditLog: Recorded
Notification: Sent to Student
```

## Security Rules
1. **Never Trust the Client**:
   A payment is never marked successful simply because the frontend reported success. The server checks the HMAC signature generated using `PAYMENT_SANDBOX_KEY`.
2. **Zero Card Data Storage**:
   The ERP never stores card numbers, CVVs, expiration dates, or bank passwords. All payments use tokenized gateway interactions.
3. **Cryptographic Digital Receipts**:
   Receipts contain a digital seal computed via:
   `SHA256(receiptNumber : transactionId : amount : studentId)`
   This seal guarantees non-repudiation and allows physical or digital verification by the Bursar.
