import { render, screen } from '@testing-library/react';
import PasswordModal from '@/components/PasswordModal';
import '@testing-library/jest-dom';

describe('PasswordModal Component', () => {
    const setup = (password: string, touched: boolean) => {
        return render(<PasswordModal password={password} touched={touched} />);
    };

    it('renders the modal with correct password requirements when touched is true', () => {
        setup('Test1234', true);

        expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/at least one uppercase letter/i)).toBeInTheDocument();
        expect(screen.getByText(/at least one lowercase letter/i)).toBeInTheDocument();
        expect(screen.getByText(/at least one number/i)).toBeInTheDocument();
    });

    it('applies the correct class for valid and invalid password criteria', () => {
        setup('Test1234', true);

        expect(screen.getByText(/at least 8 characters/i)).toHaveClass('text-green-500');
        expect(screen.getByText(/at least one uppercase letter/i)).toHaveClass('text-green-500');
        expect(screen.getByText(/at least one lowercase letter/i)).toHaveClass('text-green-500');
        expect(screen.getByText(/at least one number/i)).toHaveClass('text-green-500');
    });

    it('applies the correct class when password does not meet the requirements', () => {
        setup('test', true);

        expect(screen.getByText(/at least 8 characters/i)).toHaveClass('text-red-500');
        expect(screen.getByText(/at least one uppercase letter/i)).toHaveClass('text-red-500');
        expect(screen.getByText(/at least one lowercase letter/i)).toHaveClass('text-green-500');
        expect(screen.getByText(/at least one number/i)).toHaveClass('text-red-500');
    });

    it('does not render the modal if touched is false', () => {
        setup('Test1234', false);

        expect(screen.queryByText(/at least 8 characters/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/at least one uppercase letter/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/at least one lowercase letter/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/at least one number/i)).not.toBeInTheDocument();
    });
});
