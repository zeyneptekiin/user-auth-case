import axios from 'axios';

type VerifyData = {
    email: string;
    password: string;
};

export const verify = async (data: VerifyData) => {
    try {
        const response = await axios.post('/api/users/verify', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Verification error:', error.response?.data);
            throw error;
        } else {
            console.error('An unknown error occurred during verification:', error);
            throw error;
        }
    }
};
