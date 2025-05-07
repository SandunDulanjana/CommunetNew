import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  planId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: "Pending" }
});

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;