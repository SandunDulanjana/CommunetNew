import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Expenses = () => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [description, setDescription] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editExpenseId, setEditExpenseId] = useState(null);

  // Fetch expenses from backend
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/expense/get-expenses"
        );
        if (response.status === 200) {
          console.log(response.data); // Check the response in the console
          const formattedExpenses = response.data.map((expense) => ({
            ...expense,
            date: expense.date.split("T")[0],
          }));
          setExpenses(formattedExpenses);
          setFilteredExpenses(formattedExpenses);
        } else {
          console.error("Failed to fetch expenses, status: ", response.status);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  // Handle form submission for both Add and Update
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("title", title);
      formData.append("date", date);
      formData.append("amount", amount);
      formData.append("paymentMethod", paymentMethod);
      formData.append("description", description);

      let url = "http://localhost:5000/api/expense/add-expense";
      let method = "POST";

      if (editExpenseId) {
        url = `http://localhost:5000/api/expense/update-expense/${editExpenseId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Expense added/updated successfully!");

        // Fetch updated expenses list
        const updatedExpenses = await axios.get(
          "http://localhost:5000/api/expense/get-expenses"
        );
        const formattedExpenses = updatedExpenses.data.map((expense) => ({
          ...expense,
          date: expense.date.split("T")[0],
        }));
        setExpenses(formattedExpenses);
        setFilteredExpenses(formattedExpenses);

        // Reset form
        setCategory("");
        setTitle("");
        setDate("");
        setAmount("");
        setPaymentMethod("");
        setDescription("");
        setEditExpenseId(null);
      } else {
        alert("Failed to add/update expense: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding/updating expense");
    }
  };

  // Edit a selected expense
  const handleEdit = (expenseId) => {
    const expenseToEdit = expenses.find((exp) => exp._id === expenseId);
    setEditExpenseId(expenseId);
    setCategory(expenseToEdit.category);
    setTitle(expenseToEdit.title);
    setDate(expenseToEdit.date.split("T")[0]);
    setAmount(expenseToEdit.amount);
    setPaymentMethod(expenseToEdit.paymentMethod || "");
    setDescription(expenseToEdit.description);
  };

  // Handle delete expense
  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/expense/delete-expense/${expenseId}`
        );
        if (response.status === 200) {
          alert("Expense deleted successfully!");

          // Fetch updated expenses list
          const updatedExpenses = await axios.get(
            "http://localhost:5000/api/expense/get-expenses"
          );
          const formattedExpenses = updatedExpenses.data.map((expense) => ({
            ...expense,
            date: expense.date.split("T")[0],
          }));
          setExpenses(formattedExpenses);
          setFilteredExpenses(formattedExpenses);
        } else {
          alert("Failed to delete expense.");
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Failed to delete expense.");
      }
    }
  };

  // Search expenses based on search term
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = expenses.filter(
      (expense) =>
        expense.title.toLowerCase().includes(term) ||
        expense.category.toLowerCase().includes(term) ||
        expense.paymentMethod.toLowerCase().includes(term) ||
        expense.date.toString().toLowerCase().includes(term) ||
        expense.amount.toString().toLowerCase().includes(term) ||
        expense.description.toLowerCase().includes(term)
    );

    setFilteredExpenses(filtered);
  };

  // Calculate total expenses
  const totalExpenses = filteredExpenses
    .reduce((total, expense) => total + parseFloat(expense.amount), 0)
    .toFixed(2);

  const downloadPDF = () => {
    if (!filteredExpenses || filteredExpenses.length === 0) {
      alert("No expenses to download.");
      return;
    }

    const pdf = new jsPDF();

    // Set company title with larger font size
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text("Communet", 14, 15);

    // Set address and telephone with a bit of separation
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text("Kollupitiya Road, Malabe", 14, 25);
    pdf.text("Tel: 0112789456", 14, 35);

    // Add a line after the contact info for separation
    pdf.setDrawColor(0, 0, 0);
    pdf.line(14, 40, 200, 40);

    // Add Expense Report title with larger font and bold
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Expense Report", 14, 50);

    // Add some spacing before the table
    pdf.line(14, 52, 200, 52); // Horizontal line for separation
    pdf.text("Date: " + new Date().toLocaleDateString(), 14, 58); // Current Date

    // Define table columns
    const tableColumn = [
      "Category",
      "Title",
      "Date",
      "Amount",
      "Payment Method",
      "Description",
    ];

    // Prepare table rows
    const tableRows = filteredExpenses.map((expense) => [
      expense.category || "N/A",
      expense.title || "N/A",
      expense.date || "N/A",
      `Rs. ${expense.amount || "0.00"}`,
      expense.paymentMethod || "N/A",
      expense.description || "N/A",
    ]);

    // Table styling with autoTable
    autoTable(pdf, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Calculate total expenses
    const total = filteredExpenses
      .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0)
      .toFixed(2);

    // Add total expenses summary with bold font and larger size
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Total Expenses: Rs. ${total}`, 14, pdf.lastAutoTable.finalY + 10);

    // Add some spacing for a clean finish
    pdf.line(
      14,
      pdf.lastAutoTable.finalY + 15,
      200,
      pdf.lastAutoTable.finalY + 15
    ); // Line after total

    // Save the PDF
    pdf.save("Expense_Report.pdf");
  };

  return (
    <div className="m-5 w-full">
      <form onSubmit={onSubmitHandler} className="mb-10">
        <p className="mb-3 text-lg font-medium">Expense Report</p>
        <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
          <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
            <div className="w-full lg:flex-1 flex flex-col gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <p>Expense Category</p>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border rounded px-3 py-2"
                  required={!editExpenseId}
                >
                  <option value="">Select Category</option>
                  <option value="Operational Expenses">
                    Operational Expenses
                  </option>
                  <option value="Maintainance Expenses">
                    Maintainance Expenses
                  </option>
                  <option value="Event & Community Management Expenses">
                    Event & Community Management Expenses
                  </option>
                  <option value="Financial & Reporting Expenses">
                    Financial & Reporting Expenses
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Expense Title</p>
                <input
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[A-Za-z ]*$/.test(value)) {
                      setTitle(value);
                    }
                  }}
                  value={title}
                  className="border rounded px-3 py-2"
                  type="text"
                  placeholder="Enter Expense Title"
                  required={!editExpenseId}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Expense Date</p>
                <input
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
                  className="border rounded px-3 py-2"
                  type="date"
                  onFocus={(e) => e.target.showPicker()}
                  required={!editExpenseId}
                  max={new Date().toISOString().split("T")[0]} // Prevent future dates
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Amount</p>
                <input
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                  className="border rounded px-3 py-2"
                  type="text"
                  placeholder="Enter Amount"
                  required={!editExpenseId}
                  pattern="[0-9]*"
                  onInput={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.startsWith("0")) {
                      value = value.substring(1); // Remove leading 0 if present
                    }
                    e.target.value = value;
                  }}
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Payment Method</p>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="border rounded px-3 py-2"
                  required={!editExpenseId}
                >
                  <option value="">Select Category</option>
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p>Description</p>
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  className="border rounded px-3 py-2"
                  placeholder="Enter Expense Description"
                  rows="3"
                />
              </div>
              <div className="flex justify-start gap-4 mt-5">
                <button
                  type="submit"
                  className="bg-sky-950 text-white rounded px-6 py-2"
                >
                  {editExpenseId ? "Update Expense" : "Add Expense"}
                </button>
                {editExpenseId && (
                  <button
                    type="button"
                    onClick={() => setEditExpenseId(null)}
                    className="bg-gray-500 text-white rounded px-6 py-2"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Search */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search Expenses"
        className="border rounded px-3 py-2 mb-4"
      />

      {/* Download Total Expense PDF */}
      <button
        onClick={downloadPDF}
        className="bg-sky-950 text-white rounded px-6 py-2"
      >
        Download Total Expense PDF
      </button>

      {/* Expenses Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full mt-5 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Amount (Rs)</th>
              <th className="border px-4 py-2">Payment Method</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense._id}>
                <td className="border px-4 py-2">{expense.category}</td>
                <td className="border px-4 py-2">{expense.title}</td>
                <td className="border px-4 py-2">{expense.date}</td>
                <td className="border px-4 py-2">
                  {Number(expense.amount).toFixed(2)}
                </td>
                <td className="border px-4 py-2">{expense.paymentMethod}</td>
                <td className="border px-4 py-2">{expense.description}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(expense._id)}
                    className="bg-sky-950 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Display Total Expenses */}
      <div className="mt-5">
        <h3 className="text-lg font-semibold">
          Total Expenses: Rs. {totalExpenses}
        </h3>
      </div>
    </div>
  );
};

export default Expenses;
