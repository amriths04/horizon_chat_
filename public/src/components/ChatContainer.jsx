import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { useTheme } from "../ThemeContext";

export default function ChatContainer({ currentChat, socket, clearCurrentChat }) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };
    if (currentChat) fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container theme={theme}>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="" />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()} className={`message ${message.fromSelf ? "from-me" : "from-them"}`}>
            <div className="content">
              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  background-color: ${({ theme }) => (theme === 'dark' ? '#1c1c1c' : '#f9f9f9')};

  .chat-header {
    display: flex;
    align-items: center;
    padding: 0 2rem;
    background-color: ${({ theme }) => (theme === 'dark' ? '#333' : '#ddd')};

    .go-to-welcome {
      display: flex;
      align-items: center;
      cursor: pointer;

      svg {
        color: red;
        font-size: 1.5rem;
      }
    }

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-left: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    overflow: auto;
    background-color: ${({ theme }) => (theme === 'dark' ? '#2e2e2e' : '#ffffff')};

    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: ${({ theme }) => (theme === 'dark' ? '#555' : '#ccc')};
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 255px;
        word-wrap: break-word;
        margin-bottom: 12px;
        line-height: 24px;
        position: relative;
        padding: 10px 20px;
        border-radius: 25px;

        &:before, &:after {
          content: "";
          position: absolute;
          bottom: 0;
          height: 25px;
        }
      }
    }

    .from-me {
      justify-content: flex-end;
      .content {
        background-color: #0B93F6;
        color: white;
        align-self: flex-end;
        
        &:before {
          right: -7px;
          width: 20px;
          background-color: #0B93F6;
          border-bottom-left-radius: 16px 14px;
        }

        &:after {
          right: -26px;
          width: 26px;
          background-color: ${({ theme }) => (theme === 'dark' ? '#2e2e2e' : 'white')};
          border-bottom-left-radius: 10px;
        }
      }
    }

    .from-them {
      justify-content: flex-start;
      .content {
        background-color: #E5E5EA;
        color: black;
        align-self: flex-start;
        
        &:before {
          left: -7px;
          width: 20px;
          background-color: #E5E5EA;
          border-bottom-right-radius: 16px;
        }

        &:after {
          left: -26px;
          width: 26px;
          background-color: ${({ theme }) => (theme === 'dark' ? '#2e2e2e' : 'white')};
          border-bottom-right-radius: 10px;
        }
      }
    }
  }
`;
