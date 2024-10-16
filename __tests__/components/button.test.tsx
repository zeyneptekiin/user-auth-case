import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Button from '../../src/components/Button';

describe('Button', () => {
    it('renders the button with correct children', () => {
        render(<Button>Click Me</Button>);

        const buttonElement = screen.getByRole('button', { name: /click me/i });
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveTextContent('Click Me');
    });

    it('has correct class for styling', () => {
        render(<Button>Submit</Button>);

        const buttonElement = screen.getByRole('button', { name: /submit/i });
        expect(buttonElement).toHaveClass('w-full bg-primary-blue text-white px-4 py-2 rounded hover:bg-midnight-blue transition');
    });
});
