import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";
import { useTheme } from "../ThemeContext";
import Switch from "react-switch";

export default function Register() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    toggleTheme();
  };

  return (
    <>
      <FormContainer theme={theme}>
        <div className="theme-toggle">
          <span>{isDarkMode ? "🌚" : "🌞"}</span>
          <Switch
            onChange={handleThemeToggle}
            checked={isDarkMode}
            offColor="#bbb"
            onColor="#000"
            checkedIcon={false}
            uncheckedIcon={false}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="brand">
            <h1>HorizonChat</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: ${({ theme }) => (theme === 'dark' ? '#081a3f' : 'white')};

  .theme-toggle {
    display: flex;
    align-items: center;

    gap: 1rem;
    margin-bottom: 2rem;
    span {
      font-size: 1.7rem;
    }
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    h1 {
    font-family: 'Dune_Rise', sans-serif;
      color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: ${({ theme }) => (theme === 'dark' ? '#00000076' : '#f0f0f0')};
    border-radius: 2rem;
    padding: 3rem 5rem;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid ${({ theme }) => (theme === 'dark' ? '#0B93F6' : '#0B93F6')};
    border-radius: 0.4rem;
    color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid ${({ theme }) => (theme === 'dark' ? '#997af0' : '#333')};
      outline: none;
    }
  }

  button {
    background-color: #0B93F6;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #353a3d;
    }
  }

  span {
    color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
    text-transform: uppercase;
    a {
      color: #0B93F6;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
