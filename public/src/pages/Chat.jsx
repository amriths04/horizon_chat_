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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace } from '@fortawesome/free-solid-svg-icons';

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
      const user = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (!user) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(user));
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
      if (currentUser && currentUser.isAvatarImageSet) {
        const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data);
      } else if (currentUser && !currentUser.isAvatarImageSet) {
        navigate("/setAvatar");
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

  const handleCloseClick = () => {
    setCurrentChat(undefined); // Clear current chat
  };

  const clearCurrentChat = () => {
    setCurrentChat(undefined);
  };

  const handleLogout = async () => {
    localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY);
    socket.current.disconnect();
    navigate("/login");
  };

  return (
    <Container theme={theme}>
      <div className="controls">
        <div className="theme-toggle">
          <span>{isDarkMode ? "🌚" : "☀️"}</span>
          <Switch
            onChange={handleThemeToggle}
            checked={isDarkMode}
            offColor="#bbb"
            onColor="#000"
            checkedIcon={false}
            uncheckedIcon={false}
          />
        </div>
        {currentChat !== undefined && (
          <div className="go-to-welcome">
            <FontAwesomeIcon icon={faBackspace} onClick={handleCloseClick} />
          </div>
        )}
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <div className="chat-wrapper">
        <Contacts contacts={contacts} changeChat={handleChatChange} currentChat={currentChat} clearCurrentChat={clearCurrentChat} />
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
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => (theme === 'dark' ? '#131324' : 'white')};

  .controls {
    position: absolute;
    top: 0.7rem;
    right: 1rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    z-index: 10;
  }

    .theme-toggle {
    display: flex;
    align-items: center;
    gap: 0rem;
    border-radius: 1.5rem;
    padding: 0.45rem;
    border: 0.5px solid ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};

    span {
      font-size: 1.5rem;
      color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
    }
  }

  .go-to-welcome {
    display: flex;
    align-items: center;
    gap: 0rem;
    z-index: 10;

    svg {
      color: red; /* Red color for the close icon */
      cursor: pointer;
      font-size: 2rem; /* Adjust icon size if needed */
    }
  }

  .logout-button {
    background-color: red;
    color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => (theme === 'dark' ? 'black' : 'white')};
    }
  }

  .chat-wrapper {
    height: 100vh;
    width: 100vw;
    background-color: ${({ theme }) => (theme === 'dark' ? '#00000076' : '#f0f0f0')};
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
