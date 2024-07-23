import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Robot from "../assets/robot.gif";
import { useTheme } from "../ThemeContext"; // Import the useTheme hook

export default function Welcome() {
  const [userName, setUserName] = useState("");
  const { theme } = useTheme(); // Get the current theme
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchUserName = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setUserName(data.username);
    };
    fetchUserName();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY);
    navigate("/login");
  };

  return (
    <Container theme={theme}>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};

  img {
    height: 20rem;
  }

  span {
    color: ${({ theme }) => (theme === 'dark' ? '#4e0eff' : '#4e0eff')};
  }

  h3 {
    color: ${({ theme }) => (theme === 'dark' ? '#d3d3d3' : '#333')};
  }
`;

const LogoutButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
  background-color: ${({ theme }) => (theme === 'dark' ? '#4e0eff' : '#f0f0f0')};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => (theme === 'dark' ? '#3a0ccf' : '#e0e0e0')};
  }
`;
