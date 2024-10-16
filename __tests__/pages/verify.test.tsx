import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Verify from '../../src/app/login/verify/page';
import { useRouter } from 'next/navigation';
import { login } from '../../src/services/login';
import { useAuthStore } from '../../src/store/authStore';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../../src/services/login', () => ({
    login: jest.fn(),
}));

jest.mock('../../src/store/authStore', () => ({
    useAuthStore: jest.fn(),
}));

describe('Verify Page', () => {
    const mockPush = jest.fn();
    const mockSetPassword = jest.fn();
    const mockUseAuthStore = {
        email: 'test@example.com',
        password: 'test123',
        setPassword: mockSetPassword,
    };

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useAuthStore as unknown as jest.Mock).mockReturnValue(mockUseAuthStore);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('submits OTP and navigates on success', async () => {
        (login as jest.Mock).mockResolvedValue({ token: 'dummyToken' });

        render(<Verify />);

        const otpInputs = screen.getAllByRole('textbox');
        otpInputs.forEach((input, index) => {
            fireEvent.change(input, { target: { value: `${index + 1}` } });
        });

        const submitButton = screen.getByRole('button', { name: /submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'test123', otp: '123456' });
        });

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/');
        });

        expect(mockSetPassword).toHaveBeenCalledWith('');
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
            expect(screen.getByText(/an unknown error occurred/i)).toBeInTheDocument();
        });
    });
});
