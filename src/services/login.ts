import axios from 'axios';
import { setCookie } from 'cookies-next';

type OtpLoginData = {
    email: string;
    password: string;
    otp: string;
};

export const login = async (data: OtpLoginData) => {
    try {
        const response = await axios.post('/api/auth/login', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.data && response.data.accessToken) {
            setCookie('authToken', response.data.accessToken, {
                maxAge: 24 * 60 * 60,
                path: '/',
            });

            return { success: true, message: 'Login successful', token: response.data.accessToken };
        } else {
            return { success: false, message: response.data.message || 'Login failed, no access token returned.' };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'An error occurred during verification.';
            return { success: false, message: errorMessage };
        } else {
            console.error('An unknown error occurred:', error);
            return { success: false, message: 'An unknown error occurred.' };
        }
    }
};
