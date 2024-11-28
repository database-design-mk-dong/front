import React, { useState } from 'react';
import api from '../axios'; // 커스텀 axios 객체를 import

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
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
            const response = await api.post('/users/register', formData);
            alert('회원가입 성공!');
            console.log(response.data);
        } catch (error) {
            console.error('회원가입 오류:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 400) {
                alert('잘못된 요청입니다. 입력값을 확인하세요.');
            } else {
                alert('회원가입 실패. 다시 시도해주세요.');
            }
        }
    };

    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>아이디</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};

export default RegisterPage;
