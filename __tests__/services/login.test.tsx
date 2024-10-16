import '@testing-library/jest-dom';
import { login } from '@/services/login';
import axios from 'axios';
import { setCookie } from 'cookies-next';

jest.mock('axios');
jest.mock('cookies-next');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedSetCookie = setCookie as jest.Mock;

describe('login', () => {
    const mockData = {
        email: 'test@example.com',
        password: 'test123',
        otp: '123456',
    };

    it('should set auth token in cookie and return success message on successful login', async () => {
        const mockResponse = { accessToken: 'dummyToken' };

        mockedAxios.post.mockResolvedValueOnce({
            data: mockResponse,
        });

        const result = await login(mockData);

        expect(result).toEqual({ success: true, message: 'Login successful', token: 'dummyToken' });
        expect(mockedSetCookie).toHaveBeenCalledWith('authToken', 'dummyToken', {
            maxAge: 24 * 60 * 60,
            path: '/',
        });
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('should return error message if no access token is returned', async () => {
        const mockResponse = { message: 'Invalid OTP' };

        mockedAxios.post.mockResolvedValueOnce({
            data: mockResponse,
        });

        const result = await login(mockData);

        expect(result).toEqual({ success: false, message: 'Invalid OTP' });
        expect(mockedSetCookie).not.toHaveBeenCalled();
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('should return error message on axios error', async () => {
        const mockErrorResponse = {
            response: {
                data: {
                    message: 'Invalid credentials',
                },
            },
        };

        mockedAxios.post.mockRejectedValueOnce(mockErrorResponse);

        const result = await login(mockData);

        expect(result).toEqual({ success: false, message: 'Invalid credentials' });
        expect(mockedSetCookie).not.toHaveBeenCalled();
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('should return an unknown error message if a non-Axios error occurs', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Unknown error'));

        const result = await login(mockData);

        expect(result).toEqual({ success: false, message: 'An unknown error occurred.' });
        expect(mockedSetCookie).not.toHaveBeenCalled();
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('should return a default error message if no response is provided by axios', async () => {
        const mockError = {
            isAxiosError: true,
            response: undefined,
        };

        mockedAxios.post.mockRejectedValueOnce(mockError);

        const result = await login(mockData);

        expect(result).toEqual({ success: false, message: 'An error occurred during verification.' });
        expect(mockedSetCookie).not.toHaveBeenCalled();
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
    });
});
