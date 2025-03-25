import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    description: { type: String },
    attachment: { type: String },
  },
  { minimize: false }
);

const expenseModel = mongoose.models.expense || mongoose.model('expense', expenseSchema);

export default expenseModel;
