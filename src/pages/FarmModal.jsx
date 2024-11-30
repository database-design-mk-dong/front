import React, { useState } from 'react';
import api from '../axios';
import CropRecommendationModal from './CropRecommendationModal';
import styles from './FarmModal.module.css';

const FarmModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        farmName: '',
        cropName: '',
        devices: JSON.stringify(['Airconditioner', 'Humidifier', 'Fertilizer']),
    });
    const [recommendations, setRecommendations] = useState(null);
    const [environmentData, setEnvironmentData] = useState(null);
    const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCropRecommendation = (data) => {
        const defaultData = {
            N: 0, P: 0, K: 0, temperature: 0, humidity: 0, ph: 0, rainfall: 0,
        };
        setEnvironmentData({ ...defaultData, ...data });
        if (data.cropName) {
            setFormData((prev) => ({ ...prev, cropName: data.cropName }));
            setRecommendations(data);
        }
        setIsRecommendModalOpen(false);
    };

    const handleCreateFarm = async (e) => {
        e.preventDefault();
        try {
            const deviceList = [
                { device: 'Airconditioner' },
                { device: 'Humidifier' },
                { device: 'Fertilizer' },
            ];

            const createFarmResponse = await api.post('/farm/createFarm', {
                farmName: formData.farmName,
                cropName: formData.cropName,
                devices: deviceList,
            });

            const farmId = createFarmResponse.data.data.farmInfo.farmId;
            console.log('농장 생성:', createFarmResponse.data);
            alert('농장이 성공적으로 생성되었습니다.');

            if (environmentData) {
                const environmentResponse = await api.post(
                    `/environment?farmId=${farmId}`,
                    environmentData
                );
                console.log('환경 정보 등록:', environmentResponse.data);
                alert('환경 정보가 성공적으로 등록되었습니다.');
            } else {
                alert('환경 정보가 없어 기본값으로 등록합니다.');
                const defaultEnvironmentResponse = await api.post(
                    `/environment?farmId=${farmId}`,
                    {
                        n: 0, p: 0, k: 0, temperature: 0, humidity: 0, ph: 0, rainfall: 0,
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
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>농장 생성</h2>
                </div>
                <form onSubmit={handleCreateFarm}>
                    <div className={styles.formGroup}>
                        <label>농장 이름:</label>
                        <input
                            type="text"
                            name="farmName"
                            value={formData.farmName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>작물 이름:</label>
                        <input
                            type="text"
                            name="cropName"
                            value={formData.cropName}
                            onChange={handleChange}
                            placeholder={recommendations && recommendations.cropName ? recommendations.cropName : '추천 작물 이름 없음'}
                            required
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={() => setIsRecommendModalOpen(true)} className={`${styles.button} ${styles.secondaryButton}`}>
                            작물 추천
                        </button>
                        <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
                            농장 생성
                        </button>
                        <button type="button" onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>
                            취소
                        </button>
                    </div>
                </form>
            </div>

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