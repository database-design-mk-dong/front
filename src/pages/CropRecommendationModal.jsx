import React, { useState, useEffect } from 'react';

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

    // 마운트 상태 관리
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        // 컴포넌트 마운트 상태 관리
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        };
    }, []);

    const handleChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
    };

    const handleRecommend = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/environment/crop_selection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData),
            });

            if (!response.ok) {
                throw new Error('API 요청 실패');
            }

            const responseData = await response.json();

            console.log('API 응답 데이터:', responseData);

            // 추천 작물 추출 (확률이 가장 높은 작물 선택)
            const entries = Object.entries(responseData);
            const bestRecommendation = entries.sort((a, b) => b[1] - a[1])[0]; // 확률 내림차순 정렬 후 첫 번째
            const [recommendedCrop, probability] = bestRecommendation || ['추천 없음', 0];

            // 부모 컴포넌트로 전달
            onRecommend({
                cropName: recommendedCrop, // 추천 작물 이름
                probability, // 확률
                N: inputData.N || 0,
                P: inputData.P || 0,
                K: inputData.K || 0,
                temperature: inputData.temperature || 0,
                humidity: inputData.humidity || 0,
                ph: inputData.ph || 0,
                rainfall: inputData.rainfall || 0,
            });

            onClose(); // 모달 닫기
        } catch (error) {
            console.error('작물 추천 오류:', error.message);
            alert(`작물 추천에 실패했습니다: ${error.message}`);
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
