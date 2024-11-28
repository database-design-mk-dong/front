import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import FarmModal from './FarmModal';

const FarmListPage = () => {
    const [farms, setFarms] = useState([]);
    const [showModal, setShowModal] = useState(false); // showModal과 setShowModal 정의
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

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

    const handleFarmSelect = async (farmID) => {
        try {
            // farmID를 쿼리 파라미터로 전달
            const response = await api.get(`/farm/getfarm/?farmID=${farmID}`, {
                headers: {
                    Authorization: api.defaults.headers.common['Authorization'], // 기존 토큰 사용
                },
            });

            // 새로운 토큰 설정
            //setAuthToken(response.data.newToken);

            // 농장 데이터를 farm-detail 페이지로 전달
            navigate('/farm-detail', { state: { farmData: response.data } });
        } catch (error) {
            console.error('농장 선택 오류:', error.message);
            alert('농장 선택에 실패했습니다. 다시 시도해주세요.');
        }
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
