import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '../app/page';
import { useRouter } from 'next/navigation';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Page', () => {
  it('renders a heading', () => {
    const pushMock = jest.fn();
    // Mengatur mock untuk useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    render(<Page />);

    const text = screen.getByText('Selamat Datang di School Scheduler');

    expect(text).toBeInTheDocument();
  });
});