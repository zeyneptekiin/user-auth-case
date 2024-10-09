import axios from 'axios';

type OtpLoginData = {
    email: string;
    otp: string;
};

export const login = async (data: OtpLoginData) => {
    try {
        const response = await axios.post('http://199.247.17.44:3001/auth/login', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'OTP verification failed.');
        } else {
            throw new Error('An unknown error occurred during OTP verification.');
        }
    }
};
