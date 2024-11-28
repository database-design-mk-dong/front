import React, { useState } from 'react';
import api from '../axios';

const FarmModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        farmName: '',
        N: '',
        P: '',
        K: '',
        temperature: '',
        humidity: '',
        ph: '',
        rainfall: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/crop-selection', formData);
            alert('농장 생성 및 작물 추천 완료!');
            console.log(response.data);
        } catch (error) {
            console.error('농장 생성 오류:', error.message);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
        onClose();
    };

    return (
        <div style={{ border: '1px solid black', padding: '20px', position: 'absolute', background: 'white' }}>
            <h2>농장 생성</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>농장 이름:</label>
                    <input type="text" name="farmName" value={formData.farmName} onChange={handleChange} required />
                </div>
                <div>
                    <label>N:</label>
                    <input type="number" name="N" value={formData.N} onChange={handleChange} required />
                </div>
                <div>
                    <label>P:</label>
                    <input type="number" name="P" value={formData.P} onChange={handleChange} required />
                </div>
                <div>
                    <label>K:</label>
                    <input type="number" name="K" value={formData.K} onChange={handleChange} required />
                </div>
                <div>
                    <label>온도:</label>
                    <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} required />
                </div>
                <div>
                    <label>습도:</label>
                    <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} required />
                </div>
                <div>
                    <label>pH:</label>
                    <input type="number" name="ph" value={formData.ph} onChange={handleChange} required />
                </div>
                <div>
                    <label>강수량:</label>
                    <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} required />
                </div>
                <button type="submit">농장 생성</button>
                <button onClick={onClose}>취소</button>
            </form>
        </div>
    );
};

export default FarmModal;
