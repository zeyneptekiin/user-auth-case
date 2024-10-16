import '@testing-library/jest-dom';
import { verify } from '../../src/services/verify';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('verify', () => {
    const mockData = {
        email: 'test@example.com',
        password: 'test123',
    };

    it('should return response data on successful verification', async () => {
        const mockResponse = { success: true, token: 'dummyToken' };

        mockedAxios.post.mockResolvedValueOnce({
            data: mockResponse,
        });

        const result = await verify(mockData);

        expect(result).toEqual(mockResponse);
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/users/verify', mockData, {
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

        const result = await verify(mockData);

        expect(result).toEqual({ success: false, message: 'Invalid credentials' });
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/users/verify', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('should return a generic error message on unknown error', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

        const result = await verify(mockData);

        expect(result).toEqual({ success: false, message: 'An unknown error occurred.' });
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/users/verify', mockData, {
            headers: { 'Content-Type': 'application/json' },
        });
    });
});
