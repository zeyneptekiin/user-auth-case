import axios from 'axios';
import { setCookie } from 'cookies-next';
import { getUserData } from '../services/getUserData';

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
            const accessToken = response.data.accessToken;
            const tokenData = await getUserData(accessToken);

            if (tokenData.success && tokenData.iat && tokenData.exp) {
                const maxAge = tokenData.exp - tokenData.iat;

                if (maxAge > 0) {
                    setCookie('authToken', accessToken, {
                        maxAge,
                        path: '/',
                    });

                    return {
                        success: true,
                        message: 'Login successful',
                        token: accessToken,
                        issuedAt: tokenData.iat,
                        expiresAt: tokenData.exp
                    };
                } else {
                    return { success: false, message: 'Token is already expired.' };
                }
            } else {
                return { success: false, message: tokenData.message || 'Failed to retrieve token data.' };
            }
        } else {
            return { success: false, message: response.data.message || 'Login failed, no access token returned.' };
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'An error occurred during login.';
            return { success: false, message: errorMessage };
        } else {
            console.error('An unknown error occurred:', error);
            return { success: false, message: 'An unknown error occurred.' };
        }
    }
};
