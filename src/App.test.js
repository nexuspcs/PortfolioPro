import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio header', () => {
  render(<App />);
  const linkElement = screen.getByText(/PortfolioPro/i);
  expect(linkElement).toBeInTheDocument();
});
