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
            const errorMessage = error.response?.data?.message || 'An error occurred during verification.';
            return { success: false, message: errorMessage };
        } else {
            console.error('An unknown error occurred during verification:', error);
            return { success: false, message: 'An unknown error occurred.' };
        }
    }
};
