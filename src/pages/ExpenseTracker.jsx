import { useContext, useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import logo from "../assets/logo.png";
import { BASE_URL } from "../../config";
import { authContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const ExpenseTracker = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const { token, name, dispatch } = useContext(authContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      setLoadingRecent(true);
      try {
        const response = await fetch(`${BASE_URL}/expen/expenses/recent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        setRecentTransactions(data);
      } catch (error) {
        console.log("Error fetching recent transactions:", error);
      } finally {
        setLoadingRecent(false);
      }
    };

    const fetchMonthlyTransactions = async () => {
      setLoadingMonthly(true);
      const today = new Date();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      try {
        const response = await fetch(
          `${BASE_URL}/expen/expenses/month/${month}/${year}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setMonthlyTransactions(data);
      } catch (error) {
        console.log("Error fetching monthly transactions:", error);
      } finally {
        setLoadingMonthly(false);
      }
    };

    fetchRecentTransactions();
    fetchMonthlyTransactions();
  }, [token]);

  return (
    <div className="mx-5 lg:mx-12 my-5 lg:my-10 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="logo" className="h-8 w-8 mr-3" />
          <h2
            className="text-2xl md:text-4xl"
            style={{ fontFamily: "Margarine" }}
          >
            Expense Tracker
          </h2>
        </div>
        <div className="relative flex items-center gap-2 md:gap-5">
          <Link to={'/expenses'}>
            <div
              className="text-xl md:text-2xl"
              style={{ fontFamily: "Margarine" }}
            >
              Expenses
            </div>
          </Link>
          <div
            className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-300 text-white cursor-pointer"
            onClick={() => setShowLogout(!showLogout)}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          {showLogout && (
            <button
              className="absolute top-12 right-0 bg-red-500 text-white py-1 px-3 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col mx-2 my-3 text-black">
        <div className="my-3">
          <h2 className="text-center text-xl mb-3 text-white font-semibold">
            Your Recent Transactions
          </h2>
          <div className="bg-white w-full h-[60%] p-4 shadow-md rounded-lg">
            {loadingRecent ? (
              <div className="flex justify-center items-center h-full">
                <DotLoader color="#4A90E2" />
              </div>
            ) : recentTransactions.length > 0 ? (
              <ul>
                {recentTransactions.map((transaction) => (
                  <li key={transaction.id} className="mb-2">
                    <div className="flex justify-between">
                      <span>{transaction.expenseName}</span>
                      <span>${transaction.amount.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      {new Date(transaction.expenseDate).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">
                No recent transactions.
              </p>
            )}
          </div>
        </div>
        <div className="my-3">
          <h2 className="text-center text-xl mb-3 text-white font-semibold">
            Transactions This Month
          </h2>
          <div className="bg-white w-full h-[60%] p-4 shadow-md rounded-lg">
            {loadingMonthly ? (
              <div className="flex justify-center items-center h-full">
                <DotLoader color="#4A90E2" />
              </div>
            ) : monthlyTransactions.length > 0 ? (
              <ul>
                {monthlyTransactions.map((transaction) => (
                  <li key={transaction.id} className="mb-2">
                    <div className="flex justify-between">
                      <span>{transaction.expenseName}</span>
                      <span>${transaction.amount.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      {new Date(transaction.expenseDate).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">
                No transactions for this month.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
