import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Input from '@/components/Input';
import '@testing-library/jest-dom';
import { useForm } from 'react-hook-form';
import { ImgHTMLAttributes } from 'react';

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
        const { src, alt = 'default-alt-text', width, height, ...rest } = props;
        return (
            <div style={{ width: `${width}px`, height: `${height}px` }}>
                <img src={src} alt={alt} {...rest} style={{ width: '100%', height: '100%' }} />
            </div>
        );
    },
}));

describe('Input Component', () => {
    const setup = (type: string, error?: string) => {
        const Component = () => {
            const { register } = useForm();
            return (
                <Input
                    type={type}
                    placeholder="Enter your password"
                    register={register}
                    name="password"
                    options={{ required: 'Password is required!' }}
                    error={error}
                />
            );
        };

        return render(<Component />);
    };

    it('renders the input field correctly', () => {
        setup('password');
        const inputElement = screen.getByPlaceholderText('Enter your password');
        expect(inputElement).toBeInTheDocument();
    });

    it('toggles password visibility and calls the toggle function', async () => {
        setup('password');

        const inputElement = screen.getByPlaceholderText('Enter your password') as HTMLInputElement;
        const toggleButton = screen.getByAltText('Toggle Password Visibility');

        expect(inputElement.type).toBe('password');

        fireEvent.click(toggleButton);

        await waitFor(() => {
            expect(inputElement.type).toBe('text');
        });

        fireEvent.click(toggleButton);

        await waitFor(() => {
            expect(inputElement.type).toBe('password');
        });
    });


    it('shows the error message when error is present', () => {
        setup('password', 'Password is required!');
        const errorMessage = screen.getByText('Password is required!');
        expect(errorMessage).toBeInTheDocument();
    });

    it('does not show password toggle for non-password input', () => {
        setup('text');

        const inputElement = screen.getByPlaceholderText('Enter your password');
        expect(inputElement).toBeInTheDocument();

        const toggleButton = screen.queryByAltText('Toggle Password Visibility');
        expect(toggleButton).not.toBeInTheDocument();
    });
});
