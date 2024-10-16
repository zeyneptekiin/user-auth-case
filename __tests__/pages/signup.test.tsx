import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from '../../src/app/signup/page';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../src/services/register';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../../src/services/register', () => ({
    registerUser: jest.fn(),
}));

describe('SignUp Page', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const fillAndSubmitForm = async (username: string, email: string, password: string, confirmPassword: string) => {
        render(<SignUp />);

        fireEvent.input(screen.getByPlaceholderText('Username'), { target: { value: username } });
        fireEvent.input(screen.getByPlaceholderText('Email'), { target: { value: email } });
        fireEvent.input(screen.getByPlaceholderText('Password'), { target: { value: password } });
        fireEvent.input(screen.getByPlaceholderText('Confirm Password'), { target: { value: confirmPassword } });

        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(submitButton);
    };

    it('renders all input fields and submit button', () => {
        render(<SignUp />);

        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('displays error when fields are empty', async () => {
        render(<SignUp />);

        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/username is required!/i)).toBeInTheDocument();
            expect(screen.getByText(/email is required!/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required!/i)).toBeInTheDocument();
            expect(screen.getByText(/confirm password is required!/i)).toBeInTheDocument();
        });
    });

    it('shows error if passwords do not match', async () => {
        await fillAndSubmitForm('testuser', 'test@example.com', 'password123', 'password456');

        await waitFor(() => {
            expect(screen.getByText(/passwords do not match!/i)).toBeInTheDocument();
        });
    });

    it('submits form and navigates to login on success', async () => {
        (registerUser as jest.Mock).mockResolvedValue({ success: true });

        await fillAndSubmitForm('testuser', 'test@example.com', 'password123', 'password123');

        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
                userName: 'testuser',
            });

            expect(mockPush).toHaveBeenCalledWith('/login');
        });
    });

    it('displays error message on failed registration', async () => {
        (registerUser as jest.Mock).mockResolvedValue({ success: false, message: 'Registration failed' });

        await fillAndSubmitForm('testuser', 'test@example.com', 'password123', 'password123');

        await waitFor(() => {
            expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
        });
    });
});
