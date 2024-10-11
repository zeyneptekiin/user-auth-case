import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';
import '@testing-library/jest-dom';

describe('Home Page', () => {
    it('renders welcome message and description', () => {
        render(<Home />);

        const welcomeMessage = screen.getByText(/welcome!/i);
        expect(welcomeMessage).toBeInTheDocument();

        const description = screen.getByText(/please register or log in to continue/i);
        expect(description).toBeInTheDocument();
    });

    it('renders sign up and log in links', () => {
        render(<Home />);

        const signUpLink = screen.getByRole('link', { name: /sign up/i });
        expect(signUpLink).toBeInTheDocument();
        expect(signUpLink).toHaveAttribute('href', '/signup');

        const logInLink = screen.getByRole('link', { name: /log in/i });
        expect(logInLink).toBeInTheDocument();
        expect(logInLink).toHaveAttribute('href', '/login');
    });
});
