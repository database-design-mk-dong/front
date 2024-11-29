import React, { useState } from 'react';
import api from '../axios';
import CropRecommendationModal from './CropRecommendationModal';

const FarmModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        farmName: '',
        cropName: '',
        devices: JSON.stringify(['Airconditioner', 'Humidifier', 'Fertilizer']),
    });
    const [recommendations, setRecommendations] = useState(null);
    const [environmentData, setEnvironmentData] = useState(null); // 환경 정보 저장
    const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCropRecommendation = (data) => {
        // 추천 데이터를 저장하고 환경 정보 업데이트
        const defaultData = {
            N: 0,
            P: 0,
            K: 0,
            temperature: 0,
            humidity: 0,
            ph: 0,
            rainfall: 0,
        };

        setEnvironmentData({ ...defaultData, ...data }); // 입력받은 데이터가 없으면 기본값 사용

        // 추천받은 작물 이름을 cropName에 설정
        if (data.cropName) {
            setFormData((prev) => ({ ...prev, cropName: data.cropName }));
            setRecommendations(data); // 추천 결과 저장
        }

        setIsRecommendModalOpen(false); // 추천 모달 닫기
    };

    const handleCreateFarm = async (e) => {
        e.preventDefault();
        try {
            const deviceList = [
                { device: 'Airconditioner' },
                { device: 'Humidifier' },
                { device: 'Fertilizer' },
            ];

            // 농장 생성 API 호출
            const createFarmResponse = await api.post('/farm/createFarm', {
                farmName: formData.farmName,
                cropName: formData.cropName,
                devices: deviceList,
            });

            const farmId = createFarmResponse.data.data.farmInfo.farmId; // 농장 ID 추출
            console.log('농장 생성:', createFarmResponse.data);
            alert('농장이 성공적으로 생성되었습니다.');

            // 환경 정보 등록
            if (environmentData) {
                const environmentResponse = await api.post(
                    `/environment?farmId=${farmId}`,
                    {
                        n: environmentData.N,
                        p: environmentData.P,
                        k: environmentData.K,
                        temperature: environmentData.temperature,
                        humidity: environmentData.humidity,
                        ph: environmentData.ph,
                        rainfall: environmentData.rainfall,
                    }
                );
                console.log('환경 정보 등록:', environmentResponse.data);
                alert('환경 정보가 성공적으로 등록되었습니다.');
            } else {
                alert('환경 정보가 없어 기본값으로 등록합니다.');
                const defaultEnvironmentResponse = await api.post(
                    `/environment?farmId=${farmId}`,
                    {
                        n: 0,
                        p: 0,
                        k: 0,
                        temperature: 0,
                        humidity: 0,
                        ph: 0,
                        rainfall: 0,
                    }
                );
                console.log('기본 환경 정보 등록:', defaultEnvironmentResponse.data);
            }

            onClose();
        } catch (error) {
            console.error('오류 발생:', error.message);
            if (error.response && error.response.data) {
                console.error('서버 응답:', error.response.data);
            }
            alert('요청 처리에 실패했습니다. 다시 시도해주세요.');
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
                        placeholder={
                            recommendations && recommendations.cropName
                                ? recommendations.cropName
                                : '추천 작물 이름 없음'
                        }
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
