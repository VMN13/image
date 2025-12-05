import React, { useState, useEffect, FC, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./styles/global/global.css";


const CombinedContent = lazy(() => import("./components/content/CombinedContent"))
const AudioPlayer = lazy(() => import("./components/AudioPlayer/AudioPlayer"))
interface User {
  // Определите поля пользователя, например:
  id: string;
  name: string;
  // Добавьте другие поля
}

const App: FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user") || 'null');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  return (
    <>
      <ThemeProvider>
        <div className="App-fade-in">
          <Header />
          <Router>
            <Suspense fallback={<div>Loading...</div>}>
            <div className="App">
              <Routes>
                <Route path="/" element={<CombinedContent user={user} />} />
              </Routes>
            </div>
            </Suspense>
          </Router>
          <Footer />
          <Suspense fallback={<div>Loading...</div>}>
          </Suspense>
        </div>
      </ThemeProvider>
    </>
  );
};

export default App;
