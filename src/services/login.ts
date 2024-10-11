import axios from 'axios';

type OtpLoginData = {
    email: string;
    otp: string;
};

export const login = async (data: OtpLoginData) => {
    try {
        const response = await axios.post('/api/auth/login', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
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
