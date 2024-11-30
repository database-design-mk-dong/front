import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import FarmModal from './FarmModal';
import styles from './FarmList.module.css';

const FarmListPage = () => {
    const [farms, setFarms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const response = await api.get('/farm/getallfarm');
                const farmData = Array.isArray(response.data.data) ? response.data.data : [];
                setFarms(farmData);
                console.log('API 응답:', farmData);
            } catch (error) {
                console.error('농장 데이터를 가져오는 중 오류 발생:', error.message);
            }
        };

        fetchFarms();
    }, []);

    const handleFarmSelect = async (farmId) => {
        try {
            const response = await api.get(`/farm/getfarm?farmID=${farmId}`);
            console.log('농장 선택:', response.data.data);
            navigate('/farm-detail', {
                state: {
                    farmData: response.data.data,
                    farmEnvironment: response.data.data.farm_environment || []
                }
            });
        } catch (error) {
            console.error('농장 선택 오류:', error.message);
            alert('농장 선택에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className={styles.farmListContainer}>
            <h2>농장 리스트</h2>
            <ul>
                {farms.map((farm) => (
                    <li key={farm.farmId} className={styles.farmItem}>
                        <strong>{farm.farmName}</strong> - {farm.cropName}
                        <div className={styles.farmInfo}>
                            <p><b>온도:</b> {farm.farm_environment?.temperature ?? 'N/A'}°C, <b>습도:</b> {farm.farm_environment?.humidity ?? 'N/A'}%</p>
                            <p><b>질소:</b> {farm.farm_environment?.n ?? 'N/A'}, <b>인:</b> {farm.farm_environment?.p ?? 'N/A'}, <b>칼륨:</b> {farm.farm_environment?.k ?? 'N/A'}</p>
                            <p><b>pH:</b> {farm.farm_environment?.ph ?? 'N/A'}, <b>강수량:</b> {farm.farm_environment?.rainfall ?? 'N/A'}mm</p>
                            <p><b>데이터 시간:</b> {farm.farm_environment?.timestamp ?? 'N/A'}</p>
                        </div>
                        <button className={styles.selectButton} onClick={() => handleFarmSelect(farm.farmId)}>선택</button>
                    </li>
                ))}
            </ul>

            <button className={styles.createFarmButton} onClick={() => setShowModal(true)}>농장 생성</button>

            {showModal && <FarmModal onClose={() => setShowModal(false)}/>}
        </div>
    );
};

export default FarmListPage;