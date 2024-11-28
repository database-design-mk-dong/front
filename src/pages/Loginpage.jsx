import React, { useState } from 'react';
import api from '../axios'; // 커스텀 axios 객체 import

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // api 객체를 사용해 요청 전송
            const response = await api.post('/users/login', formData);
            if (response.status === 200) {
                alert('로그인 성공!');
                console.log('Access Token:', response.data.access_token);
                console.log('Refresh Token:', response.data.refresh_token);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    alert('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
                } else if (error.response.status === 500) {
                    alert('서버 오류: 관리자에게 문의하세요.');
                }
            } else {
                alert('네트워크 오류: 다시 시도해주세요.');
            }
            console.error('로그인 오류:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>이메일</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">로그인</button>
            </form>
        </div>
    );
};

export default LoginPage;
