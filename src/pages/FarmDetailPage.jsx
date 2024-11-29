import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../axios';

const FarmDetailPage = () => {
    const location = useLocation();
    const { farmData } = location.state; // FarmListPage에서 전달된 농장 데이터
    const [environmentData, setEnvironmentData] = useState([]); // 환경 데이터
    const [optimalData, setOptimalData] = useState({}); // 적정 환경 값
    const [deviceData, setDeviceData] = useState([]); // 하드웨어 데이터
    const [deviceValues, setDeviceValues] = useState({}); // 기기 제어 값

    useEffect(() => {
        // 환경 데이터 호출
        const fetchEnvironmentData = async () => {
            try {
                const response = await api.get('/environment/current_environment', {
                    params: { farmId: farmData.farmId }, // 농장 ID로 데이터 필터링
                });
                const { Current, Opt } = response.data;

                setEnvironmentData(Current || []);
                setOptimalData(Opt || {});
            } catch (error) {
                console.error('환경 데이터 가져오기 오류:', error);
            }
        };

        // 하드웨어 데이터 호출
        const fetchDeviceData = async () => {
            try {
                const response = await api.get('/hardware/control', {
                    params: { farmID: farmData.farmId }, // 농장 ID로 데이터 필터링
                });
                setDeviceData(response.data.data || []);
            } catch (error) {
                console.error('하드웨어 데이터 가져오기 오류:', error);
            }
        };

        fetchEnvironmentData();
        fetchDeviceData();
    }, [farmData.farmId]);

    // 기기 제어
    const handleDeviceControl = async (device, targetValue) => {
        try {
            // targetValue를 double로 변환
            const valueAsDouble = parseFloat(targetValue);

            if (isNaN(valueAsDouble)) {
                alert("유효한 숫자를 입력하세요.");
                return;
            }

            const response = await api.patch(
                '/hardware/control',
                { device, targetValue: valueAsDouble }, // targetValue를 double로 변환하여 전송
                { params: { farmID: farmData.farmId } } // farmID를 쿼리 매개변수로 전달
            );

            alert(`${device} 설정이 업데이트되었습니다.`);
            console.log('기기 제어 응답:', response.data);

            // 기기 상태 갱신
            setDeviceData((prev) =>
                prev.map((d) => (d.device === device ? { ...d, status: valueAsDouble } : d))
            );
        } catch (error) {
            console.error('기기 제어 오류:', error.message);
            alert(`${device} 설정 업데이트에 실패했습니다.`);
        }
    };

    return (
        <div>
            <h2>농장: {farmData.farmName}</h2>
            <h3>작물: {farmData.cropName}</h3>

            <section>
                <h3>현재 환경 로그</h3>
                {environmentData.length > 0 ? (
                    environmentData.map((env, index) => (
                        <div key={index}>
                            <p><b>시간:</b> {env.timestamp.join('-')}</p>
                            <p><b>N:</b> {env.n}, <b>P:</b> {env.p}, <b>K:</b> {env.k}</p>
                            <p><b>온도:</b> {env.temperature}°C, <b>습도:</b> {env.humidity}%</p>
                            <p><b>pH:</b> {env.ph}, <b>강수량:</b> {env.rainfall}mm</p>
                        </div>
                    ))
                ) : (
                    <p>환경 로그가 없습니다.</p>
                )}
            </section>

            <section>
                <h3>기기 관리</h3>
                {deviceData.length > 0 ? (
                    deviceData.map((device, index) => (
                        <div key={index}>
                            <p><b>기기:</b> {device.device}, <b>상태:</b> {device.status}</p>
                            <input
                                type="number"
                                placeholder="새로운 값"
                                onChange={(e) =>
                                    setDeviceValues({ ...deviceValues, [device.device]: e.target.value })
                                }
                            />
                            <button
                                onClick={() =>
                                    handleDeviceControl(device.device, deviceValues[device.device])
                                }
                            >
                                업데이트
                            </button>
                        </div>
                    ))
                ) : (
                    <p>기기 정보가 없습니다.</p>
                )}
            </section>
        </div>
    );
};

export default FarmDetailPage;
