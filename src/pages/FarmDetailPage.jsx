import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../axios';

const FarmDetailPage = () => {
    const location = useLocation();
    const { farmData } = location.state; // FarmModal에서 전달된 농장 데이터
    const [environmentData, setEnvironmentData] = useState([]);
    const [optimalData, setOptimalData] = useState({});
    const [deviceLogs, setDeviceLogs] = useState({});
    const [deviceValues, setDeviceValues] = useState({});

    // 환경 데이터 및 로그 호출
    useEffect(() => {
        const fetchEnvironmentData = async () => {
            try {
                const response = await api.get('/environment/current_environment');
                const { Current, Opt } = response.data;

                setEnvironmentData(Current);
                setOptimalData(Opt);
            } catch (error) {
                console.error('환경 데이터 가져오기 오류:', error);
            }
        };

        fetchEnvironmentData();
    }, []);

    // 기기 제어
    const handleDeviceControl = async (device, targetValue) => {
        try {
            const response = await api.post('/hardware/control', {
                device,
                targetValue,
            });

            alert(`${device} 설정이 업데이트되었습니다.`);
            console.log('기기 제어 응답:', response.data);
        } catch (error) {
            console.error('기기 제어 오류:', error.message);
            alert(`${device} 설정 업데이트에 실패했습니다.`);
        }
    };

    return (
        <div>
            <h2>농장: {farmData.FarmInfo.farmName}</h2>
            <h3>작물: {farmData.FarmInfo.cropName}</h3>

            <section>
                <h3>환경 로그</h3>
                {environmentData.map((env, index) => (
                    <div key={index}>
                        <p>시간: {env.timestamp}</p>
                        <p>N: {env.N}, P: {env.P}, K: {env.K}</p>
                        <p>온도: {env.temperature}°C, 습도: {env.humidity}%</p>
                        <p>pH: {env.ph}, 강수량: {env.rainfall}mm</p>
                    </div>
                ))}
            </section>

            <section>
                <h3>적정 환경 값</h3>
                <p>작물: {optimalData.cropName}</p>
                <p>N: {optimalData.N}, P: {optimalData.P}, K: {optimalData.K}</p>
                <p>온도: {optimalData.temperature}°C, 습도: {optimalData.humidity}%</p>
                <p>pH: {optimalData.ph}, 강수량: {optimalData.rainfall}mm</p>
            </section>

            <section>
                <h3>기기 관리</h3>
                {farmData.device.map((dev, index) => (
                    <div key={index}>
                        <p>기기: {dev.device}, 상태: {dev.status}</p>
                        <input
                            type="number"
                            placeholder="새로운 값"
                            onChange={(e) =>
                                setDeviceValues({ ...deviceValues, [dev.device]: e.target.value })
                            }
                        />
                        <button
                            onClick={() =>
                                handleDeviceControl(dev.device, deviceValues[dev.device])
                            }
                        >
                            업데이트
                        </button>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default FarmDetailPage;
