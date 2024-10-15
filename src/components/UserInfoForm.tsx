import React, { useState } from 'react';

const UserInfoForm: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userInfo);
    // 여기에 제출 로직을 추가하세요
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-600 text-center">개인 정보 입력</h2>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userInfo.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">나이</label>
          <input
            type="number"
            id="age"
            name="age"
            value={userInfo.age}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">성별</label>
          <select
            id="gender"
            name="gender"
            value={userInfo.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">선택하세요</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">키 (cm)</label>
          <input
            type="number"
            id="height"
            name="height"
            value={userInfo.height}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">몸무게 (kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={userInfo.weight}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">활동 수준</label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={userInfo.activityLevel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">선택하세요</option>
            <option value="sedentary">거의 운동하지 않음</option>
            <option value="light">가벼운 운동 (주 1-3회)</option>
            <option value="moderate">중간 정도 운동 (주 3-5회)</option>
            <option value="active">활발한 운동 (주 6-7회)</option>
            <option value="veryActive">매우 활발한 운동 (하루 2회 이상)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
        >
          제출
        </button>
      </form>
    </div>
  );
};

export default UserInfoForm;