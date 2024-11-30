import React, { useState, useEffect } from 'react';
import styles from './CropRecommend.module.css';

const CropRecommendationModal = ({ onClose, onRecommend }) => {
    const [inputData, setInputData] = useState({
        N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '',
    });
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const handleChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
    };

    const handleRecommend = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/environment/crop_selection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputData),
            });

            if (!response.ok) throw new Error('API 요청 실패');

            const responseData = await response.json();
            console.log('API 응답 데이터:', responseData);

            const entries = Object.entries(responseData);
            const [recommendedCrop, probability] = entries.sort((a, b) => b[1] - a[1])[0] || ['추천 없음', 0];

            onRecommend({
                cropName: recommendedCrop,
                probability,
                ...Object.fromEntries(Object.entries(inputData).map(([key, value]) => [key, value || 0]))
            });

            onClose();
        } catch (error) {
            console.error('작물 추천 오류:', error.message);
            alert(`작물 추천에 실패했습니다: ${error.message}`);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>작물 추천</h2>
                </div>
                <form onSubmit={handleRecommend} className={styles.form}>
                    {['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'].map((field) => (
                        <div key={field} className={styles.formGroup}>
                            <label>{field === 'ph' ? 'pH' : field}:</label>
                            <input
                                type="number"
                                name={field}
                                value={inputData[field]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                    <div className={styles.buttonGroup}>
                        <button type="submit" className={`${styles.button} ${styles.primaryButton}`}>
                            추천 결과 가져오기
                        </button>
                        <button type="button" onClick={onClose} className={`${styles.button} ${styles.secondaryButton}`}>
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CropRecommendationModal;