import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

describe('Simple working test', () => {
    it('the title is visible', () => {
        render(<App />);
        expect(screen.getByRole('heading')).toHaveTextContent(
            'Hello Vite + React + TypeScript!',
        );
    });

    it('should increment count on click', async () => {
        render(<App />);
        expect(screen.getByRole('button')).toHaveTextContent('Count is: 0');
        await userEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('button')).toHaveTextContent('Count is: 1');
    });
});
