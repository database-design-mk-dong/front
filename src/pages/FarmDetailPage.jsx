import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../axios';
import styles from './FarmDetail.module.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FarmDetailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { farmData } = location.state;
    const [environmentData, setEnvironmentData] = useState([]);
    const [optimalData, setOptimalData] = useState({});
    const [deviceData, setDeviceData] = useState([]);
    const [deviceValues, setDeviceValues] = useState({});
    const [updateData, setUpdateData] = useState({
        farmName: farmData.farmName,
        cropName: farmData.cropName,
    });
    const [activeTab, setActiveTab] = useState('temperature');

    useEffect(() => {
        console.log(location.state.farmEnvironment); // 환경 데이터 확인용 로그
        // 환경 데이터 호출
        const fetchEnvironmentData = async () => {
            try {
                const response = await api.get('/environment/current_environment', {
                    params: { farmID: farmData.farmId },
                });

                console.log('환경 데이터 응답:', response.data); // 디버깅용

                const environmentArray = response.data.data || []; // 환경 데이터 배열 추출
                const formattedEnvironmentData = environmentArray.map((env) => ({
                    ...env,
                    timestamp: new Date(env.timestamp).toLocaleDateString('ko-KR'), // 날짜 형식 변환
                }));

                setEnvironmentData(formattedEnvironmentData);
            } catch (error) {
                console.error('환경 데이터 가져오기 오류:', error);
                alert('환경 데이터를 가져오는 중 오류가 발생했습니다.');
            }
        };


        // 하드웨어 데이터 호출
        const fetchDeviceData = async () => {
            try {
                const response = await api.get('/hardware/control', {
                    params: { farmID: farmData.farmId },
                });
                setDeviceData(response.data.data || []);
            } catch (error) {
                console.error('하드웨어 데이터 가져오기 오류:', error);
            }
        };

        // 환경 데이터 POST
        const postEnvironmentData = async () => {
            try {
                const environment = location.state.farmEnvironment?.[0] || {};

                const environmentPayload = {
                    n: environment.n || 0,
                    p: environment.p || 0,
                    k: environment.k || 0,
                    temperature: environment.temperature || 0,
                    humidity: environment.humidity || 0,
                    ph: environment.ph || 0,
                    rainfall: environment.rainfall || 0,
                };

                console.log('POST 환경 데이터:', environmentPayload);

                await api.post(
                    '/environment',
                    environmentPayload, // 요청 본문
                    {
                        params: { farmID: farmData.farmId }, // 쿼리 파라미터
                    }
                );

                alert('환경 데이터가 성공적으로 등록되었습니다.');
            } catch (error) {
                console.error('환경 데이터 POST 오류:', error.message);
                alert('환경 데이터를 등록하는 중 오류가 발생했습니다.');
            }
        };




        // 데이터 호출 및 POST 순서 보장
        const fetchData = async () => {
            await fetchDeviceData();
            await postEnvironmentData();
            await fetchEnvironmentData();
        };

        fetchData();
    }, [farmData.farmId]);

    const handleUpdateFarm = async () => {
        if (!updateData.farmName.trim()) {
            alert('농장 이름을 입력해주세요.');
            return;
        }
        if (!updateData.cropName.trim()) {
            alert('작물 이름을 입력해주세요.');
            return;
        }

        try {
            const updatePayload = {
                newFarmName: updateData.farmName,
            };

            console.log('농장 업데이트 요청:', updatePayload);

            await api.patch('/farm/updatefarm', updatePayload, {
                params: { farmID: farmData.farmId },
            });

            alert('농장 정보가 성공적으로 업데이트되었습니다.');
        } catch (error) {
            console.error('농장 업데이트 오류:', error.message);
            alert('농장 정보를 업데이트하는 중 오류가 발생했습니다.');
        }
    };


    // 농장 삭제
    const handleDeleteFarm = async () => {
        if (!window.confirm('정말로 이 농장을 삭제하시겠습니까?')) return;

        try {
            await api.delete('/farm/deletefarm', {
                params: { farmID: farmData.farmId },
            });

            alert('농장이 성공적으로 삭제되었습니다.');
            navigate('/farms'); // 삭제 후 농장 리스트 페이지로 이동
        } catch (error) {
            console.error('농장 삭제 오류:', error.message);
            alert('농장을 삭제하는 중 오류가 발생했습니다.');
        }
    };

    const handleDeviceControl = async (device, targetValue, deviceId) => {
        try {
            const valueAsDouble = parseFloat(targetValue);
            if (isNaN(valueAsDouble)) {
                alert('유효한 숫자를 입력하세요.');
                return;
            }

            const response = await api.patch(
                '/hardware/control',
                { device, targetValue: valueAsDouble, deviceId }, // deviceId 추가
                { params: { farmID: farmData.farmId } }
            );

            alert(`${device} 설정이 업데이트되었습니다.`);
            console.log('기기 제어 응답:', response.data);

            // 기기 상태 갱신
            setDeviceData((prev) =>
                prev.map((d) =>
                    d.device === device ? { ...d, status: valueAsDouble } : d
                )
            );
        } catch (error) {
            console.error('기기 제어 오류:', error.message);
            alert(`${device} 설정 업데이트에 실패했습니다.`);
        }
    };

    const tabs = [
        { id: 'temperature', label: '온도' },
        { id: 'humidity', label: '습도' },
        { id: 'n', label: '질소' },
        { id: 'p', label: '인' },
        { id: 'k', label: '칼륨' },
        { id: 'ph', label: 'pH' },
        { id: 'rainfall', label: '강수량' },
    ];

    const getChartData = (dataKey) => {
        const colors = {
            temperature: 'rgb(255, 99, 132)',
            humidity: 'rgb(54, 162, 235)',
            n: 'rgb(75, 192, 192)',
            p: 'rgb(255, 206, 86)',
            k: 'rgb(153, 102, 255)',
            ph: 'rgb(255, 159, 64)',
            rainfall: 'rgb(201, 203, 207)'
        };

        return {
            labels: environmentData.map(data => data.timestamp),
            datasets: [
                {
                    label: tabs.find(tab => tab.id === dataKey).label,
                    data: environmentData.map(data => data[dataKey]),
                    borderColor: colors[dataKey],
                    backgroundColor: colors[dataKey],
                    tension: 0.1,
                    fill: false
                }
            ]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: true }
        }
    };





    return (
        <div className={styles.farmDetailContainer}>
            <h2>농장: {farmData.farmName}</h2>
            <h3>작물: {farmData.cropName}</h3>

            <section>
                <h3>농장 관리</h3>
                <div className={styles.inputGroup}>
                    <label>농장 이름:</label>
                    <input
                        type="text"
                        value={updateData.farmName}
                        onChange={(e) => setUpdateData({...updateData, farmName: e.target.value})}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>작물 이름:</label>
                    <input
                        type="text"
                        value={updateData.cropName}
                        onChange={(e) => setUpdateData({...updateData, cropName: e.target.value})}
                    />
                </div>
                <button className={styles.button} onClick={handleUpdateFarm}>농장 업데이트</button>
                <button className={`${styles.button} ${styles.deleteButton}`} onClick={handleDeleteFarm}>농장 삭제</button>
            </section>

            <section>
                <h3>환경 데이터 그래프</h3>
                <div className={styles.tabContainer}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className={styles.chartContainer}>
                    <Line data={getChartData(activeTab)} options={chartOptions} />
                </div>
            </section>

            <section>
                <h3>현재 환경 로그</h3>
                {environmentData.length > 0 ? (
                    environmentData.map((env, index) => (
                        <div key={index} className={styles.environmentLog}>
                            <p><b>시간:</b> {env.timestamp}</p>
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
                        <div key={index} className={styles.deviceItem}>
                            <p><b>{device.device}:</b> {device.status}</p>
                            <input
                                type="number"
                                placeholder="새로운 값"
                                onChange={(e) => setDeviceValues({...deviceValues, [device.device]: e.target.value})}
                            />
                            <button
                                className={styles.button}
                                onClick={() => handleDeviceControl(device.device, deviceValues[device.device], device.deviceId)}
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