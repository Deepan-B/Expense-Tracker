import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import signupvid from "../assets/signup.mp4";
import { DotLoader } from "react-spinners";
import { BASE_URL } from "../../config";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    showPassword: false,
  });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setFormData((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email address.");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters long and contain both letters and numbers."
      );
      return;
    }

    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { message } = await res.json();

      if (!res.ok) {
        throw new Error(message);
      }

      setLoading(false);
      toast.success(message);
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen">
      <video
        className="absolute w-full h-full object-cover"
        src={signupvid}
        autoPlay
        loop
        muted
      />
      <div className="flex flex-col items-center justify-center h-full gap-4 z-10 relative bg-black bg-opacity-50">
        <div
          className="font-bold text-3xl text-white"
          style={{ WebkitTextStroke: "2px black", textStroke: "2px black" }}
        >
          Sign up
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center border-black border-4 rounded-2xl px-7 py-10 gap-y-9 bg-white bg-opacity-80 max-w-xl mx-auto text-black"
        >
          <div className="flex flex-col gap-4 w-full max-w-lg">
            <div className="flex flex-col gap-4 md:flex-row md:gap-7">
              <div className="flex flex-col gap-2 items-center">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="px-3 py-4 rounded-xl w-full"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="px-3 py-4 rounded-xl w-full"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <label>Email</label>
              <input
                type="text"
                name="email"
                placeholder="Enter Your Email"
                className="px-3 py-4 rounded-xl w-full"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <div className="max-w-sm flex flex-col items-center">
                <label className="block text-sm mb-2">Password</label>
                <div className="relative">
                  <input
                    id="hs-toggle-password"
                    type={formData.showPassword ? "text" : "password"}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-0 right-0 p-3.5 rounded-e-md"
                  >
                    <svg
                      className="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {formData.showPassword ? (
                        <>
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </>
                      ) : (
                        <>
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                          <line x1="2" x2="22" y1="2" y2="22"></line>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {loading ? (
              <DotLoader color="#fbbb74" size={35} className="ml-[44%]" />
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-xl"
              >
                Submit
              </button>
            )}
          </div>
        </form>

        <div className="text-white text-xl mr-3 mb-6">
          Already have an Account?
          <Link to={"/login"}>
            <span className="text-blue-500 underline ml-2">Log In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
