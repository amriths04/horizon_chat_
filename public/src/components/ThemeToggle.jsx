// // src/components/ThemeToggle.jsx
// import React from 'react';
// import Switch from 'react-switch';
// import styled from 'styled-components';
// import { useTheme } from '../ThemeContext';

// export default function ThemeToggle({ isVisible }) {
//   const { theme, toggleTheme } = useTheme();
//   const [isDarkMode, setIsDarkMode] = React.useState(theme === 'dark');

//   const handleThemeToggle = () => {
//     setIsDarkMode(!isDarkMode);
//     toggleTheme();
//   };

//   return (
//     isVisible && (
//       <ToggleContainer>
//         <span>{isDarkMode ? "🌙" : "☀️"}</span>
//         <Switch
//           onChange={handleThemeToggle}
//           checked={isDarkMode}
//           offColor="#bbb"
//           onColor="#000"
//           checkedIcon={false}
//           uncheckedIcon={false}
//         />
//       </ToggleContainer>
//     )
//   );
// }

// const ToggleContainer = styled.div`
//   position: absolute;
//   top: 1rem;
//   right: 1rem;
//   display: flex;
//   align-items: center;
//   gap: 0.5rem;
//   background-color: ${({ theme }) => (theme === 'dark' ? '#1f1f1f' : '#e0e0e0')};
//   border-radius: 0.5rem;
//   padding: 0.5rem;
//   box-shadow: 0 0 5px ${({ theme }) => (theme === 'dark' ? '#000' : '#ccc')};
//   z-index: 10;

//   span {
//     font-size: 1.5rem;
//     color: ${({ theme }) => (theme === 'dark' ? 'white' : 'black')};
//   }
// `;
