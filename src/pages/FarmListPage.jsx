import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../axios';
import FarmModal from './FarmModal';

const FarmListPage = () => {
    const [farms, setFarms] = useState([]);
    const [selectedFarm, setSelectedFarm] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const response = await api.get('/farm/getallfarms');
                setFarms(response.data);
            } catch (error) {
                console.error('농장 데이터를 가져오는 중 오류 발생:', error.message);
            }
        };

        fetchFarms();
    }, []);

    const handleFarmSelect = (farmID) => {
        setSelectedFarm(farmID);
        alert(`농장 ${farmID}이 선택되었습니다.`);
    };

    return (
        <div>
            <h2>농장 리스트</h2>
            <ul>
                {farms.map((farm) => (
                    <li key={farm.farmID}>
                        <span>
                            {farm.farmName} - {farm.cropName}
                        </span>
                        <button onClick={() => handleFarmSelect(farm.farmID)}>선택</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => setShowModal(true)}>농장 생성</button>

            {showModal && <FarmModal onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default FarmListPage;
