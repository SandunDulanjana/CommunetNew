import express from 'express';
import { addExpense, deleteExpense, getExpenses, updateExpense } from '../controllers/expenseController.js';
import upload from '../middlewares/multer.js'

const expenseRouter = express.Router();

// Post route to add expense
expenseRouter.post('/add-expense',upload.single('image'), addExpense);

// PUT route to update expense
expenseRouter.put('/update-expense/:id',upload.single('image'), updateExpense);

// GET route to get all expenses
expenseRouter.get('/get-expenses', getExpenses);

// DELETE route to delete expense
expenseRouter.delete('/delete-expense/:id', deleteExpense);



export default expenseRouter;