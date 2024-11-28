import React, { useState } from 'react';
import api from '../axios';

const CropRecommendationModal = ({ onClose, onRecommend }) => {
    const [inputData, setInputData] = useState({
        N: '',
        P: '',
        K: '',
        temperature: '',
        humidity: '',
        ph: '',
        rainfall: '',
    });

    const handleChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
    };

    const handleRecommend = async (e) => {
        e.preventDefault();
        try {
            // 작물 추천 API 호출
            const response = await api.post('/crop-selection', inputData);
            alert('작물 추천이 완료되었습니다.');
            onRecommend(response.data); // 추천 결과 부모 컴포넌트로 전달
            onClose(); // 모달 닫기
        } catch (error) {
            console.error('작물 추천 오류:', error.message);
            alert('작물 추천에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div style={{ border: '1px solid black', padding: '20px', position: 'absolute', background: 'white' }}>
            <h2>작물 추천</h2>
            <form onSubmit={handleRecommend}>
                <div>
                    <label>N:</label>
                    <input type="number" name="N" value={inputData.N} onChange={handleChange} required />
                </div>
                <div>
                    <label>P:</label>
                    <input type="number" name="P" value={inputData.P} onChange={handleChange} required />
                </div>
                <div>
                    <label>K:</label>
                    <input type="number" name="K" value={inputData.K} onChange={handleChange} required />
                </div>
                <div>
                    <label>온도:</label>
                    <input
                        type="number"
                        name="temperature"
                        value={inputData.temperature}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>습도:</label>
                    <input type="number" name="humidity" value={inputData.humidity} onChange={handleChange} required />
                </div>
                <div>
                    <label>pH:</label>
                    <input type="number" name="ph" value={inputData.ph} onChange={handleChange} required />
                </div>
                <div>
                    <label>강수량:</label>
                    <input type="number" name="rainfall" value={inputData.rainfall} onChange={handleChange} required />
                </div>
                <button type="submit">추천 결과 가져오기</button>
                <button type="button" onClick={onClose}>
                    취소
                </button>
            </form>
        </div>
    );
};

export default CropRecommendationModal;
