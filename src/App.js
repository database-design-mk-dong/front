import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/Loginpage';
import FarmListPage from "./pages/FarmListPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/farms" element={<FarmListPage />} />
            </Routes>
        </Router>
    );
};

export default App;
