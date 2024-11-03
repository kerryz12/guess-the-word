import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Footer, DarkModeToggle } from "./components";
import { DarkModeProvider } from "./components/darkmodetoggle/DarkModeContext";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/loginpage/LoginPage";
import SignupPage from "./pages/signuppage/SignupPage";
import ProfilePage from "./pages/profilepage/ProfilePage";

function App() {
  return (
    <div>
      <DarkModeProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Routes>
          <DarkModeToggle />
          <Footer />
        </Router>
      </DarkModeProvider>
    </div>
  );
}

export default App;
