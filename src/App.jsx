import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { ThemeProvider } from './components/ThemeContext';

import CombinedContent from './content/CombinedContent';  
import Header from "./header/Header";
import Footer from "./footer/Footer";

import "./styles/global/global.css";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

// const handleLogin = (userData) => {
//   setUser(userData);
// };

  return (
    <>
      <ThemeProvider>
     <Header />
    
        <Router>
      <div className="App">
        
        <Routes>
   
          <Route path="/" element={<CombinedContent user={user} />} />
        </Routes>
      </div>
    </Router>

      <Footer />
      </ThemeProvider>
    </>
  );
};

export default App;