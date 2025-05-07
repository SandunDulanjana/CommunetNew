import PaymentModel from "../models/PaymentModel.js";

export const updatePaymentStatus = async (req, res) => {
  const { email, status } = req.body;
  try {
    const payment = await PaymentModel.findOneAndUpdate(
      { email },
      { status },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const savePayment = async (req, res) => {
  const { name, email, planId, amount, date } = req.body;

  try {
    const newPayment = new PaymentModel({
      name,
      email,
      planId,
      amount,
      date,
    });

    await newPayment.save();
    res.status(201).json({ success: true, message: "Payment saved successfully" });
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({ success: false, message: "Failed to save payment" });
  }
};