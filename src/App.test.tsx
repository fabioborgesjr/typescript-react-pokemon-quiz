import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Make Your Own Pokemon Quiz text', () => {
  render(<App />);
  const element = screen.getByText(/Make Your Own Pokemon Quiz/i);
  expect(element).toBeInTheDocument();
});
