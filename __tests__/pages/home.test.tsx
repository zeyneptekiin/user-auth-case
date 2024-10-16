import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { getCookie } from 'cookies-next';
import { useAuthStore } from '../../src/store/authStore';

jest.mock('cookies-next', () => ({
    getCookie: jest.fn(),
}));

jest.mock('../../src/store/authStore', () => ({
    useAuthStore: jest.fn(),
}));

describe('Home Page', () => {
    it('renders welcome message and description when not logged in', () => {
        (getCookie as jest.Mock).mockReturnValue(null);
        (useAuthStore as unknown as jest.Mock).mockReturnValue({ userName: '' });

        render(<Home />);

        const welcomeMessage = screen.getByText(/welcome!/i);
        expect(welcomeMessage).toBeInTheDocument();

        const description = screen.getByText(/please register or log in to continue/i);
        expect(description).toBeInTheDocument();
    });

    it('renders sign up and log in links', () => {
        (getCookie as jest.Mock).mockReturnValue(null);
        (useAuthStore as unknown as jest.Mock).mockReturnValue({ userName: '' });

        render(<Home />);

        const signUpLink = screen.getByRole('link', { name: /sign up/i });
        expect(signUpLink).toBeInTheDocument();
        expect(signUpLink).toHaveAttribute('href', '/signup');

        const logInLink = screen.getByRole('link', { name: /log in/i });
        expect(logInLink).toBeInTheDocument();
        expect(logInLink).toHaveAttribute('href', '/login');
    });

    it('renders user information when logged in', () => {
        (getCookie as jest.Mock).mockReturnValue('authToken');
        (useAuthStore as unknown as jest.Mock).mockReturnValue({ userName: 'John Doe' });

        render(<Home />);

        const welcomeMessage = screen.getByText(/welcome john doe!/i);
        expect(welcomeMessage).toBeInTheDocument();

        const loginSuccessMessage = screen.getByText(/your login has been successfully completed/i);
        expect(loginSuccessMessage).toBeInTheDocument();
    });
});
