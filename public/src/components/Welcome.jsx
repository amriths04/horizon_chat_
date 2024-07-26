import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
import { useTheme } from "../ThemeContext"; 

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

  // const handleLogout = () => {
  //   localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY);
  //   navigate("/login");
  // };

  return (
    <Container theme={theme}>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h5> 
        🔒Your personal messages are not end-to-end encrypted
      </h5>
      {/* <LogoutButton onClick={handleLogout}>Logout</LogoutButton> */}
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
    color: ${({ theme }) => (theme === 'dark' ? '#0B93F6' : '#0B93F6')};
  }

  h1 {
    color: ${({ theme }) => (theme === 'dark' ? '#d3d3d3' : '#333')};
  }

  h5 {
    color: ${({ theme }) => (theme === 'dark' ? '#d3d3d3' : '#333')};
    font-size: 0.8rem; /* Smaller font size */
    margin-top: 1rem; /* New line */
    text-align: center;
    padding: 0 1rem; /* Optional: add some padding for better readability */
  }
`;
