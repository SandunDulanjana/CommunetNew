import cloudinary from 'cloudinary';
import expenseModel from '../models/expenseModel.js';

export const addExpense = async (req, res) => {
  try {
    console.log('Incoming request body:', req.body);
    console.log('Incoming file:', req.file);

    const { category, title, date, amount, paymentMethod, description } = req.body;
    let docImg = '';

    // Handle Image Upload to Cloudinary
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        docImg = result.secure_url;
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        return res.status(500).json({ message: 'Image upload failed', error: cloudinaryError });
      }
    }

    // Check if required fields are provided
    if (!category || !title || !date || !amount || !paymentMethod || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new Expense
    const newExpense = new expenseModel({
      category,
      title,
      date,
      amount: Number(amount),
      payment_method: paymentMethod,
      description,
      attachment: docImg,
    });

    // Save to MongoDB
    await newExpense.save();

    console.log('Expense added successfully:', newExpense);
    res.status(201).json({ message: 'Expense added successfully!', expense: newExpense });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Failed to add expense', error: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { category, title, date, amount, paymentMethod, description } = req.body;
    const expenseId = req.params.id;
    let docImg = '';

    // Handle Image Upload to Cloudinary
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        docImg = result.secure_url;
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        return res.status(500).json({ message: 'Image upload failed', error: cloudinaryError });
      }
    }

    // Find the expense by ID
    const expense = await expenseModel.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Update expense fields
    expense.category = category || expense.category;
    expense.title = title || expense.title;
    expense.date = date || expense.date;
    expense.amount = amount || expense.amount;
    expense.payment_method = paymentMethod || expense.payment_method;
    expense.description = description || expense.description;
    expense.attachment = docImg || expense.attachment;

    // Save the updated expense
    await expense.save();

    console.log('Expense updated successfully:', expense);
    res.status(200).json({ message: 'Expense updated successfully!', expense });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ message: 'Failed to update expense', error: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await expenseModel.find();
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    // Find the expense by ID
    const expense = await expenseModel.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // If there is an attachment, delete the image from Cloudinary
    if (expense.attachment) {
      try {
        const publicId = expense.attachment.split('/').pop().split('.')[0];  // Extract public ID from the URL
        await cloudinary.v2.uploader.destroy(publicId);  // Remove the image from Cloudinary
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        return res.status(500).json({ message: 'Failed to delete image from Cloudinary', error: cloudinaryError });
      }
    }

    // Delete the expense from the database
    const deletedExpense = await expenseModel.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
