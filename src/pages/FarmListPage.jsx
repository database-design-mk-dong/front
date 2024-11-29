import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import FarmModal from './FarmModal';

const FarmListPage = () => {
    const [farms, setFarms] = useState([]); // farms 초기값을 빈 배열로 설정
    const [showModal, setShowModal] = useState(false); // showModal과 setShowModal 정의
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

    useEffect(() => {
        const fetchFarms = async () => {
            try {
                const response = await api.get('/farm/getallfarm');

                // API 응답 데이터에서 farms 배열 추출
                const farmData = Array.isArray(response.data.data) ? response.data.data : [];
                setFarms(farmData);

                console.log('API 응답:', farmData); // 데이터 구조 확인용 로그
            } catch (error) {
                console.error('농장 데이터를 가져오는 중 오류 발생:', error.message);
            }
        };

        fetchFarms();
    }, []);

    const handleFarmSelect = async (farmId) => {
        try {
            const response = await api.get(`/farm/getfarm?farmID=${farmId}`);

            // 농장 데이터를 farm-detail 페이지로 전달
            console.log('농장 선택:', response.data.data);
            navigate('/farm-detail', {
                state: {
                    farmData: response.data.data,
                    farmEnvironment: response.data.data.farm_environment || [] // 환경 데이터 전달
                }
            });
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
                    <li key={farm.farmId}>
                        <strong>{farm.farmName}</strong> - {farm.cropName}
                        <br/>
                        <small>
                            <b>온도:</b> {farm.farm_environment?.temperature ?? 'N/A'}°C,
                            <b> 습도:</b> {farm.farm_environment?.humidity ?? 'N/A'}%
                        </small>
                        <br/>
                        <small>
                            <b>질소:</b> {farm.farm_environment?.n ?? 'N/A'},
                            <b> 인:</b> {farm.farm_environment?.p ?? 'N/A'},
                            <b> 칼륨:</b> {farm.farm_environment?.k ?? 'N/A'}
                        </small>
                        <br/>
                        <small>
                            <b>pH:</b> {farm.farm_environment?.ph ?? 'N/A'},
                            <b> 강수량:</b> {farm.farm_environment?.rainfall ?? 'N/A'}mm
                        </small>
                        <br/>
                        <small>
                            <b>데이터 시간:</b>{' '}
                            {farm.farm_environment?.timestamp ?? 'N/A'}
                        </small>
                        <br/>
                        <button onClick={() => handleFarmSelect(farm.farmId)}>선택</button>
                    </li>
                ))}
            </ul>

            <button onClick={() => setShowModal(true)}>농장 생성</button>

            {showModal && <FarmModal onClose={() => setShowModal(false)}/>}
        </div>
    );
};

export default FarmListPage;
