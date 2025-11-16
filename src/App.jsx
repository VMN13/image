import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";

import Content from "./content/Content";
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
        <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={user ? <Content /> : <Navigate to="/auth" />} />
          
        </Routes>
      </div>
    </Router>
      <Header />
      <Content />
      <Footer />
    </>
  );
};

export default App;