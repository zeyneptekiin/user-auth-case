import axios from 'axios';
import { registerUser } from '../../src/services/register';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('registerUser', () => {
    const mockData = {
        userName: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
    };

    it('should return success with response data on successful registration', async () => {
        const mockResponse = { success: true, user: { id: 1, email: mockData.email } };

        mockedAxios.post.mockResolvedValueOnce({
            data: mockResponse,
        });

        const result = await registerUser(mockData);

        expect(result).toEqual({ success: true, data: mockResponse });
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/users/register', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('should return network or CORS error message if there is no response (no error.response)', async () => {
        const mockError = {
            isAxiosError: true,
            message: 'Network Error',
            response: undefined, // response yok
        };

        mockedAxios.post.mockRejectedValueOnce(mockError);

        const result = await registerUser(mockData);

        expect(result).toEqual({ success: false, message: 'Network or CORS error' });
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/users/register', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('should return API error message on API response error', async () => {
        const mockErrorResponse = {
            response: {
                data: {
                    message: 'Email is already taken',
                },
            },
            isAxiosError: true,
        };

        mockedAxios.post.mockRejectedValueOnce(mockErrorResponse);

        const result = await registerUser(mockData);

        expect(result).toEqual({ success: false, message: 'Email is already taken' });
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/users/register', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('should return an unknown error message if a non-Axios error occurs', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Unknown error'));

        const result = await registerUser(mockData);

        expect(result).toEqual({ success: false, message: 'An unknown error occurred' });
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/users/register', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
    });
});
