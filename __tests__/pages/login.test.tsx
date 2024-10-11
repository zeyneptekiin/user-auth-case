import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '@/app/login/page';
import { useRouter } from 'next/navigation';
import { verify } from '@/services/verify';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../../src/services/verify', () => ({
    verify: jest.fn(),
}));

describe('Login Page', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (verify as jest.Mock).mockResolvedValue({ success: true });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders form inputs and login button', () => {
        render(<Login />);

        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    it('displays validation error when email is missing', async () => {
        render(<Login />);

        fireEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => expect(screen.getByText(/Email is required!/i)).toBeInTheDocument());
    });

    it('submits the form and navigates on success', async () => {
        render(<Login />);
        fireEvent.input(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.input(screen.getByPlaceholderText(/Password/i), { target: { value: 'Password123' } });
        fireEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => expect(verify).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'Password123',
        }));

        expect(mockPush).toHaveBeenCalledWith('/login/verify?email=test%40example.com');
    });

    it('displays error message on failed verification', async () => {
        (verify as jest.Mock).mockResolvedValue({ success: false, message: 'Invalid credentials' });

        render(<Login />);

        fireEvent.input(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.input(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrongPassword1' } });
        fireEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument());
    });

    it('displays an error message when verify throws an unexpected error', async () => {
        (verify as jest.Mock).mockRejectedValue(new Error('Network error'));

        render(<Login />);

        fireEvent.input(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.input(screen.getByPlaceholderText(/Password/i), { target: { value: 'Password123' } });
        fireEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument());
    });
});
