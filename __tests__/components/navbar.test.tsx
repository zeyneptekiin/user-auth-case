import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../src/components/Navbar';
import { useAuthStore } from '../../src/store/authStore';
import { getCookie } from 'cookies-next';

jest.mock('cookies-next');
jest.mock('../../src/store/authStore');

const mockGetCookie = getCookie as jest.Mock;

const mockClearAuth = jest.fn();

describe('Navbar', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useAuthStore as unknown as jest.Mock).mockReturnValue({
            clearAuth: mockClearAuth,
        });
    });

    it('should render Log In and Sign Up links when no auth token is present', () => {
        mockGetCookie.mockReturnValue(null);

        render(<Navbar />);

        expect(screen.getByText(/log in/i)).toBeInTheDocument();
        expect(screen.getByText(/sign up/i)).toBeInTheDocument();

        expect(screen.queryByText(/log out/i)).toBeNull();
    });

    it('should render Log Out button when auth token is present', () => {
        mockGetCookie.mockReturnValue('dummyToken');

        render(<Navbar />);

        expect(screen.getByText(/log out/i)).toBeInTheDocument();

        expect(screen.queryByText(/log in/i)).toBeNull();
        expect(screen.queryByText(/sign up/i)).toBeNull();
    });

    it('should call clearAuth and reload the page when Log Out is clicked', () => {
        mockGetCookie.mockReturnValue('dummyToken');

        const originalLocation = window.location;
        (window.location as unknown) = {
            reload: jest.fn(),
        };

        render(<Navbar />);

        const logoutButton = screen.getByText(/log out/i);
        fireEvent.click(logoutButton);

        expect(mockClearAuth).toHaveBeenCalled();
        expect(window.location.reload).toHaveBeenCalled();

        window.location = originalLocation;
    });

});
