import '@testing-library/jest-dom';
import { login } from '../../src/services/login';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { getUserData } from '../../src/services/getUserData';

jest.mock('axios');
jest.mock('cookies-next');
jest.mock('../../src/services/getUserData');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedSetCookie = setCookie as jest.Mock;
const mockedGetUserData = getUserData as jest.Mock;

describe('login', () => {
    const mockData = {
        email: 'test@example.com',
        password: 'test123',
        otp: '123456',
    };

    it('should set auth token in cookie with correct maxAge and return success message on successful login', async () => {
        const mockResponse = { accessToken: 'dummyToken' };
        const mockTokenData = { success: true, iat: 1729173818, exp: 1729260218 };
        const expectedMaxAge = mockTokenData.exp - mockTokenData.iat;

        mockedAxios.post.mockResolvedValueOnce({
            data: mockResponse,
        });

        mockedGetUserData.mockResolvedValueOnce(mockTokenData);

        const result = await login(mockData);

        expect(result).toEqual({
            success: true,
            message: 'Login successful',
            token: 'dummyToken',
            issuedAt: mockTokenData.iat,
            expiresAt: mockTokenData.exp,
        });
        expect(mockedSetCookie).toHaveBeenCalledWith('authToken', 'dummyToken', {
            maxAge: expectedMaxAge,
            path: '/',
        });
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
        expect(mockedGetUserData).toHaveBeenCalledWith('dummyToken');
    });

    it('should return error if token has already expired', async () => {
        const mockResponse = { accessToken: 'dummyToken' };
        const mockTokenData = { success: true, iat: 1729173818, exp: 1729173819 }; // Token already expired

        mockedAxios.post.mockResolvedValueOnce({
            data: mockResponse,
        });

        mockedGetUserData.mockResolvedValueOnce(mockTokenData);

        const result = await login(mockData);

        expect(result).toEqual({
            success: false,
            message: 'Token is already expired.',
        });
        expect(mockedSetCookie).not.toHaveBeenCalled();
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
        expect(mockedGetUserData).toHaveBeenCalledWith('dummyToken');
    });

    it('should return error if no access token is returned', async () => {
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
        expect(mockedGetUserData).not.toHaveBeenCalled();
    });

    it('should return error if getUserData fails to retrieve token data', async () => {
        const mockResponse = { accessToken: 'dummyToken' };
        const mockTokenData = { success: false, message: 'Failed to retrieve token data.' };

        mockedAxios.post.mockResolvedValueOnce({
            data: mockResponse,
        });

        mockedGetUserData.mockResolvedValueOnce(mockTokenData);

        const result = await login(mockData);

        expect(result).toEqual({
            success: false,
            message: 'Failed to retrieve token data.',
        });
        expect(mockedSetCookie).not.toHaveBeenCalled();
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
        expect(mockedGetUserData).toHaveBeenCalledWith('dummyToken');
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
        expect(mockedGetUserData).not.toHaveBeenCalled();
    });

    it('should return an unknown error message if a non-Axios error occurs', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Unknown error'));

        const result = await login(mockData);

        expect(result).toEqual({ success: false, message: 'An unknown error occurred.' });
        expect(mockedSetCookie).not.toHaveBeenCalled();
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/auth/login', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
        expect(mockedGetUserData).not.toHaveBeenCalled();
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
        expect(mockedGetUserData).not.toHaveBeenCalled();
    });
});
