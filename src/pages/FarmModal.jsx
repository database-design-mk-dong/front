import React, { useState } from 'react';
import api from '../axios';
import CropRecommendationModal from './CropRecommendationModal'; // 새로운 모달 컴포넌트 import

const FarmModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        farmName: '',
        cropName: '',
        devices: JSON.stringify(['Airconditioner','Humidifier','Fertilizer']),
    });
    const [recommendations, setRecommendations] = useState(null); // 추천 작물 결과 저장
    const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false); // 추천 모달 상태

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCropRecommendation = (data) => {
        setRecommendations(data); // 추천 결과 저장
        setIsRecommendModalOpen(false); // 추천 모달 닫기
    };

    const handleCreateFarm = async (e) => {
        e.preventDefault();
        try {
            // 농장 생성 API 호출
            const createFarmResponse = await api.post('/farm/createfarm', {
                farmName: formData.farmName,
                cropName: formData.cropName,
                devices: ['Airconditioner', 'Humidifier', 'Fertilizer'], // 하드코딩된 devices
            });

            alert('농장이 성공적으로 생성되었습니다.');
            console.log('농장 생성:', createFarmResponse.data);
            onClose();
        } catch (error) {
            console.error('농장 생성 오류:', error.message);
            alert('농장 생성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div style={{ border: '1px solid black', padding: '20px', position: 'absolute', background: 'white' }}>
            <h2>농장 생성</h2>
            <form>
                <div>
                    <label>농장 이름:</label>
                    <input
                        type="text"
                        name="farmName"
                        value={formData.farmName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>작물 이름:</label>
                    <input
                        type="text"
                        name="cropName"
                        value={formData.cropName}
                        onChange={handleChange}
                        placeholder={recommendations ? recommendations.crops[0] : ''}
                        required
                    />
                </div>
                <button type="button" onClick={() => setIsRecommendModalOpen(true)}>
                    작물 추천
                </button>
                <button type="button" onClick={handleCreateFarm}>
                    농장 생성
                </button>
                <button onClick={onClose}>취소</button>
            </form>

            {isRecommendModalOpen && (
                <CropRecommendationModal
                    onClose={() => setIsRecommendModalOpen(false)}
                    onRecommend={handleCropRecommendation}
                />
            )}
        </div>
    );
};

export default FarmModal;
