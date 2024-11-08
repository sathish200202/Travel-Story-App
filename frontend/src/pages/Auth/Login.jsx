import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import { validEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import login from "../../../public/images/login.webp";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    //console.log("email: ", email);
    //console.log("password: ", password);
    if (!validEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    //LOGIN API
    try {
      const res = await axiosInstance.post("/auth/login", {
        email: email,
        password: password,
      });
      console.log("res: ", res);
      //handle successful login response
      if (res.data && res.data.AccessToken) {
        console.log("inside the if condition in the api");
        localStorage.setItem("token", res.data.AccessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error in login: ", error.message);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Unexpected error occured.");
      }
    }
  };

  const loginImage = {
    backgroundImage: `url(${login})`,
  };
  return (
    <div className="h-screen bg-cyan-100 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40"></div>
      <div className="login-ui-box bg-cyan-300 right-1/2 -bottom-40"></div>
      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div
          style={loginImage}
          className="w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50"
        >
          <div className="">
            <h1 className="text-5xl text-white font-thin leading-[58px] title-font">
              Capture Your <br /> Journeys
            </h1>
            <p className="text-[15px] text-white leading-6 pr-7 mt-4">
              Record your travel expriences and memories in your personal travel
              journal.
            </p>
          </div>
        </div>

        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/100">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold  mb-7">Login</h4>

            <input
              type="text"
              placeholder="email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              LOGIN
            </button>
            <p className="text-sm text-slate-500 text-center my-4">Or</p>
            <button
              type="button"
              className="btn-primary btn-light"
              onClick={() => navigate("/signup")}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
