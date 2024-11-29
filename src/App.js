import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/Loginpage';
import FarmListPage from "./pages/FarmListPage";
import FarmDetailPage from "./pages/FarmDetailPage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/farms" element={<FarmListPage />} />
                <Route path="/farm-detail" element={<FarmDetailPage />} />
            </Routes>
        </Router>
    );
};

export default App;
