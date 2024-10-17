import axios from 'axios';

export const getUserData = async (token: string) => {
    try {
        const response = await axios({
            method: 'post',
            url: '/api/auth/data',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: undefined,
        });

        const { iat, exp } = response.data;

        if (iat && exp) {
            return { success: true, iat, exp };
        } else {
            return { success: false, message: 'Token data is missing issued or expiration fields.' };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Error fetching token data.';
            return { success: false, message: errorMessage };
        } else {
            return { success: false, message: 'An unknown error occurred.' };
        }
    }
};
