// src/components/Welcome.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import { useTheme } from "../ThemeContext";
import Logout from "./Logout"; // Assuming Logout is a component you have

export default function Welcome() {
  const [userName, setUserName] = useState("");
  const { theme } = useTheme(); // Get the current theme

  useEffect(() => {
    const fetchUserName = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setUserName(data.username);
    };
    fetchUserName();
  }, []);

  return (
    <Container theme={theme}>
      <LogoutButton>
        <Logout />
      </LogoutButton>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
  position: relative; /* Ensure the logout button can be positioned absolutely */

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

const LogoutButton = styled.div`
  position: absolute;
  top: 0.5rem; /* Adjust as needed */
  right: 1rem; /* Adjust as needed */
  background-color: ${({ theme }) => (theme === 'dark' ? '#333' : '#eee')};
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 0 0 5px ${({ theme }) => (theme === 'dark' ? '#000' : '#ccc')};
  cursor: pointer;

  svg {
    width: 1rem; /* Adjust size as needed */
    height: 1rem; /* Adjust size as needed */
    color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
  }
`;

