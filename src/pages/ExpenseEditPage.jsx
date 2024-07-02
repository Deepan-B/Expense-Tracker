import { useState, useEffect, useContext } from "react";
import { DotLoader } from "react-spinners";
import { authContext } from "../context/AuthContext";
import { BASE_URL } from "../../config";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ExpenseEditPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState({
    expenseName: "",
    expenseCategory: "",
    amount: "",
    expenseDate: "",
  });
  const [filters, setFilters] = useState({
    expenseName: "",
    expenseCategory: "",
    expenseDate: "",
  });
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const { token } = useContext(authContext);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [sortByPrice, setSortByPrice] = useState(false);
  const [yearFilter, setYearFilter] = useState("");
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      // Construct query parameters based on non-empty filters
      const queryParams = Object.keys(filters)
        .filter((key) => filters[key])
        .map((key) => `${key}=${encodeURIComponent(filters[key])}`)
        .join("&");

      // Add sorting by price if selected
      const sortParam = sortByPrice ? "sort=amount" : "";

      // Add year filter if selected
      const yearFilterParam = yearFilter
        ? `year=${encodeURIComponent(yearFilter)}`
        : "";

      // Construct the URL with query parameters
      const url = `${BASE_URL}/expen/expenses${
        queryParams ? `?${queryParams}` : ""
      }${sortByPrice ? "&" + sortParam : ""}${
        yearFilter ? "&" + yearFilterParam : ""
      }`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExpenses(data);
      setFilteredExpenses(data); // Initially set filteredExpenses to all expenses
    } catch (error) {
      console.log("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    // Filter expenses based on current filters
    const filtered = expenses.filter((expense) =>
      Object.keys(filters).every(
        (key) =>
          !filters[key] ||
          expense[key].toLowerCase().includes(filters[key].toLowerCase())
      )
    );
    setFilteredExpenses(filtered);
  };

  const handleSortByPrice = () => {
    setSortByPrice(!sortByPrice);
  };

  const handleFilterByYear = () => {
    // Filter expenses by the selected year
    const filtered = expenses.filter(
      (expense) =>
        new Date(expense.expenseDate).getFullYear().toString() === yearFilter
    );
    setFilteredExpenses(filtered);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/expen/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });
      if (response.ok) {
        fetchExpenses();
        setExpenseData({
          expenseName: "",
          expenseCategory: "",
          amount: "",
          expenseDate: "",
        });
      }
    } catch (error) {
      console.log("Error adding expense:", error);
    }
  };

  const handleEditExpense = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/expen/expenses/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });
      if (response.ok) {
        fetchExpenses();
        setEditMode(false);
        setEditId(null);
        setExpenseData({
          expenseName: "",
          expenseCategory: "",
          amount: "",
          expenseDate: "",
        });
      }
    } catch (error) {
      console.log("Error editing expense:", error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/expen/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchExpenses();
      }
    } catch (error) {
      console.log("Error deleting expense:", error);
    }
  };

  const handleEditClick = (expense) => {
    setEditMode(true);
    setEditId(expense._id);
    setExpenseData({
      expenseName: expense.expenseName,
      expenseCategory: expense.expenseCategory,
      amount: expense.amount,
      expenseDate: new Date(expense.expenseDate).toISOString().split("T")[0],
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setExpenseData({
      expenseName: "",
      expenseCategory: "",
      amount: "",
      expenseDate: "",
    });
  };

  return (
    <div className="container mx-auto p-5">
      <div className="">
        <Link to={'/home'}>
          <div className="flex items-center gap-2">
            <FaArrowLeft />
            <h2 className="text-xl hidden md:block">Back to home</h2>
          </div>
        </Link>
        <h1 className="text-2xl font-bold mb-5 text-center">Expense Tracker</h1>
      </div>
      <div className="bg-white p-5 shadow-md rounded-lg mb-5">
        <form onSubmit={editMode ? handleEditExpense : handleAddExpense}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-black">
            <div>
              <label className="block text-gray-700">Expense Name</label>
              <input
                type="text"
                name="expenseName"
                value={expenseData.expenseName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Category</label>
              <input
                type="text"
                name="expenseCategory"
                value={expenseData.expenseCategory}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Amount</label>
              <input
                type="number"
                name="amount"
                value={expenseData.amount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                name="expenseDate"
                value={expenseData.expenseDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            {editMode ? (
              <>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
                >
                  Update Expense
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Add Expense
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-5 shadow-md rounded-lg mb-5 text-black">
        <h2 className="text-xl font-bold mb-4">Filter Expenses</h2>
        <div className="flex flex-col md:flex-row justify-evenly gap-5 ">
          <input
            type="text"
            name="expenseName"
            value={filters.expenseName}
            onChange={handleFilterChange}
            placeholder="Filter by Name"
            className="md:w-1/3 px-3 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="expenseCategory"
            value={filters.expenseCategory}
            onChange={handleFilterChange}
            placeholder="Filter by Category"
            className="md:w-1/3 px-3 py-2 border rounded-lg"
          />
          <button
            type="button"
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Apply Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 mt-4">
          <div>
            <label className="block text-gray-700 my-2">Year Filter</label>
            <input
              type="text"
              name="yearFilter"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              placeholder="Filter by Year"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <button
              type="button"
              onClick={handleFilterByYear}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-2"
            >
              Apply Year Filter
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 shadow-md rounded-lg text-black">
        <h2 className="text-xl font-bold mb-4">Expense List</h2>
        {loading ? (
          <div className="flex items-center justify-center">
            <DotLoader color={"#123abc"} loading={loading} size={50} />
          </div>
        ) : filteredExpenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Category</th>
                  <th className="border border-gray-300 px-4 py-2">Amount</th>
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense._id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {expense.expenseName}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {expense.expenseCategory}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {expense.amount}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(expense.expenseDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        type="button"
                        onClick={() => handleEditClick(expense)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg mr-2 my-1"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseEditPage;
