import axios from 'axios';
import { getUserData } from '@/services/getUserData';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getUserData', () => {
    const mockToken = 'dummyToken';

    it('should return success and token data when valid token is provided', async () => {
        const mockResponse = {
            data: {
                iat: 1729173818,
                exp: 1729260218,
            },
        };

        mockedAxios.mockResolvedValueOnce(mockResponse);

        const result = await getUserData(mockToken);

        expect(result).toEqual({
            success: true,
            iat: 1729173818,
            exp: 1729260218,
        });

        expect(mockedAxios).toHaveBeenCalledWith({
            method: 'post',
            url: '/api/auth/data',
            headers: {
                Authorization: `Bearer ${mockToken}`,
                'Content-Type': 'application/json',
            },
            data: undefined,
        });
    });

    it('should return error if token data is missing iat or exp', async () => {
        const mockResponse = {
            data: {},
        };

        mockedAxios.mockResolvedValueOnce(mockResponse);

        const result = await getUserData(mockToken);

        expect(result).toEqual({
            success: false,
            message: 'Token data is missing issued or expiration fields.',
        });

        expect(mockedAxios).toHaveBeenCalledWith({
            method: 'post',
            url: '/api/auth/data',
            headers: {
                Authorization: `Bearer ${mockToken}`,
                'Content-Type': 'application/json',
            },
            data: undefined,
        });
    });

    it('should return error message when axios error occurs', async () => {
        const mockErrorResponse = {
            response: {
                data: {
                    message: 'Invalid token',
                },
            },
        };

        mockedAxios.mockRejectedValueOnce(mockErrorResponse);

        const result = await getUserData(mockToken);

        expect(result).toEqual({
            success: false,
            message: 'Invalid token',
        });

        expect(mockedAxios).toHaveBeenCalledWith({
            method: 'post',
            url: '/api/auth/data',
            headers: {
                Authorization: `Bearer ${mockToken}`,
                'Content-Type': 'application/json',
            },
            data: undefined,
        });
    });

    it('should return a default error message if an unknown error occurs', async () => {
        mockedAxios.mockRejectedValueOnce(new Error('Unknown error'));

        const result = await getUserData(mockToken);

        expect(result).toEqual({
            success: false,
            message: 'An unknown error occurred.',
        });

        expect(mockedAxios).toHaveBeenCalledWith({
            method: 'post',
            url: '/api/auth/data',
            headers: {
                Authorization: `Bearer ${mockToken}`,
                'Content-Type': 'application/json',
            },
            data: undefined,
        });
    });
});
