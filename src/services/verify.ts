import axios from 'axios';

type VerifyData = {
    email: string;
    password: string;
};

export const verify = async (data: VerifyData) => {
    try {
        const response = await axios.post('http://199.247.17.44:3001/users/verify', data, {
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
