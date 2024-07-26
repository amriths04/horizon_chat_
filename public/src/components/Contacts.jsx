import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { useTheme } from "../ThemeContext";

export default function Contacts({ contacts, changeChat, currentChat, clearCurrentChat }) {
  const { theme } = useTheme();
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);

  const changeCurrentChat = (index, contact) => {
    changeChat(contact);
  };

  useEffect(() => {
    if (currentChat === undefined) {
      clearCurrentChat();
    }
  }, [currentChat, clearCurrentChat]);

  return (
    <>
      {currentUserImage && (
        <Container theme={theme}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Horizon Chat</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    currentChat?._id === contact._id ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: ${({ theme }) => (theme === 'dark' ? '#000000' : '#f0f0f0')};

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 3.4rem;
    }

    h3 {
      color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
      text-transform: uppercase;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    border-radius: 1.5rem;
    gap: 0.8rem;
  
    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: ${({ theme }) => (theme === 'dark' ? '#555' : '#ccc')};
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .contact {
      background-color: ${({ theme }) => (theme === 'dark' ? '#333' : '#ddd')};
      min-height: 2rem;
      cursor: pointer;
      width: 90%;
      border-radius: 30px;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;

      &:hover {
      background-color: ${({ theme }) => (theme === 'dark' ? '#0B93F6' : '#0B93F6')};
    }
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

    .selected {
      background-color: ${({ theme }) => (theme === 'dark' ? '#0B93F6' : '#0B93F6')};
    }
  }

  .current-user {
    background-color: ${({ theme }) => (theme === 'dark' ? '#333' : '#ddd')};
    display: flex;
    border-radius:7px;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }

    .username {
      h2 {
        color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
      }
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;

      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
