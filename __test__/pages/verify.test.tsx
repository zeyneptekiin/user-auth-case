import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Verify from '@/app/login/verify/page';
import { useRouter, useSearchParams } from 'next/navigation';
import { login } from '@/services/login';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

jest.mock('../../src/services/login', () => ({
    login: jest.fn(),
}));

describe('Verify Page', () => {
    const mockPush = jest.fn();
    const mockSearchParams = {
        get: jest.fn(),
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
        mockSearchParams.get.mockReturnValue('test@example.com');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('submits OTP and navigates on success', async () => {
        (login as jest.Mock).mockResolvedValue({ success: true });

        render(<Verify />);

        const otpInputs = screen.getAllByRole('textbox');
        otpInputs.forEach((input, index) => {
            fireEvent.change(input, { target: { value: `${index + 1}` } });
        });

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({ email: 'test@example.com', otp: '123456' });
        });

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/');
        });
    });

    it('displays the error message when OTP verification fails', async () => {
        (login as jest.Mock).mockResolvedValue({ success: false, message: 'Invalid OTP' });

        render(<Verify />);

        const otpInputs = screen.getAllByRole('textbox');
        otpInputs.forEach((input, index) => {
            fireEvent.change(input, { target: { value: `${index + 1}` } });
        });

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/invalid otp/i)).toBeInTheDocument();
        });
    });

    it('displays an error message when an unknown error occurs', async () => {
        (login as jest.Mock).mockRejectedValue(new Error('Network error'));

        render(<Verify />);

        const otpInputs = screen.getAllByRole('textbox');
        otpInputs.forEach((input, index) => {
            fireEvent.change(input, { target: { value: `${index + 1}` } });
        });

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/an unknown error occurred: network error/i)).toBeInTheDocument(); // Verify error message
        });
    });
});
