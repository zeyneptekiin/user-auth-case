import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Input from '../../src/components/Input';
import { useForm } from 'react-hook-form';

const InputWrapper = ({ type = 'text', error = '' }) => {
    const { register } = useForm();

    return (
        <Input
            type={type}
            placeholder="Test Input"
            register={register}
            name="testInput"
            options={{ required: 'This field is required' }}
            error={error}
        />
    );
};

describe('Input Component', () => {
    const setup = (type = 'text', error = '') => {
        return render(<InputWrapper type={type} error={error} />);
    };

    it('should render input field correctly', () => {
        const { getByPlaceholderText } = setup();
        const inputElement = getByPlaceholderText('Test Input');

        expect(inputElement).toBeInTheDocument();
        expect(inputElement).toHaveAttribute('type', 'text');
    });

    it('should render error message when error is passed', () => {
        const { getByText } = setup('text', 'Error message');

        const errorElement = getByText('Error message');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveClass('text-red-500');
    });

    it('should toggle password visibility when icon is clicked', () => {
        const { getByPlaceholderText, getByAltText } = setup('password');
        const inputElement = getByPlaceholderText('Test Input');
        const toggleIcon = getByAltText('Toggle Password Visibility');

        expect(inputElement).toHaveAttribute('type', 'password');

        fireEvent.click(toggleIcon);
        expect(inputElement).toHaveAttribute('type', 'text');

        fireEvent.click(toggleIcon);
        expect(inputElement).toHaveAttribute('type', 'password');
    });
});
