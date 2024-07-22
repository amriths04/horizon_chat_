// src/pages/Chat.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { useTheme } from "../ThemeContext";
import Switch from "react-switch";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const { theme, toggleTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');

  useEffect(() => {
    const checkUser = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )
        );
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const getContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    getContacts();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    toggleTheme();
  };

  return (
    <Container theme={theme}>
      <div className="theme-toggle">
        <span>{isDarkMode ? "🌙" : "☀️"}</span>
        <Switch
          onChange={handleThemeToggle}
          checked={isDarkMode}
          offColor="#bbb"
          onColor="#000"
          checkedIcon={false}
          uncheckedIcon={false}
        />
      </div>
      <div className="chat-wrapper">
        <Contacts contacts={contacts} changeChat={handleChatChange} />
        {currentChat === undefined ? (
          <Welcome />
        ) : (
          <ChatContainer currentChat={currentChat} socket={socket} />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => (theme === 'dark' ? '#131324' : 'white')};

  .theme-toggle {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: ${({ theme }) => (theme === 'dark' ? '#1f1f1f' : '#e0e0e0')};
    border-radius: 0.5rem;
    padding: 0.5rem;
    box-shadow: 0 0 5px ${({ theme }) => (theme === 'dark' ? '#000' : '#ccc')};
    z-index: 10;

    span {
      font-size: 1.5rem;
      color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
    }
  }

  .chat-wrapper {
    height: 95vh;
    width: 95vw;
    background-color: ${({ theme }) => (theme === 'dark' ? '#00000076' : '#f0f0f0')};
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
