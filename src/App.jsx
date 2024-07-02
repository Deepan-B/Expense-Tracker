import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ExpenseTracker from "./pages/ExpenseTracker.jsx";
import ProtectedRoutes from "./Routes/ProtectedRoutes.jsx";
import ExpenseEditPage from "./pages/ExpenseEditPage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
        <Route
        path="/home"
        element={
          <ProtectedRoutes >
            <ExpenseTracker />
          </ProtectedRoutes>
        }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoutes>
              <ExpenseEditPage />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  );
}

export default App;
