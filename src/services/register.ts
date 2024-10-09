import axios from 'axios';

type RegisterData = {
    email: string;
    password: string;
    userName: string;
};

export const registerUser = async (data: RegisterData) => {
    try {
        const response = await axios.post('/api/users/register', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (!error.response) {
                console.error('Network or CORS error:', error.message);
                return { success: false, message: 'Network or CORS error' };
            } else {
                console.error('API error:', error.response.data);
                return { success: false, message: error.response.data.message || 'API request failed' };
            }
        } else {
            console.error('An unknown error occurred:', error);
            return { success: false, message: 'An unknown error occurred' };
        }
    }
};
