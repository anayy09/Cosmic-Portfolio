import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

// Mock heavy components to speed up tests and avoid side effects
jest.mock('./components/CosmicLoader', () => () => <div>Loading...</div>);
jest.mock('./components/CosmicBackground', () => () => <div />);
jest.mock('./sections/Hero', () => () => <div />);
jest.mock('./sections/Skills', () => () => <div />);
jest.mock('./sections/Timeline', () => () => <div />);
jest.mock('./sections/Projects', () => () => <div />);
jest.mock('./sections/Blogs', () => () => <div />);
jest.mock('./sections/Publications', () => () => <div />);
jest.mock('./sections/Certifications', () => () => <div />);
jest.mock('./sections/CosmicJourneys', () => () => <div />);
jest.mock('./sections/Contact', () => () => <div />);
jest.mock('./components/Footer', () => () => <div />);

test('renders navigation logo text', async () => {
  jest.useFakeTimers();
  render(<App />);

  // Fast-forward timers to skip the loader
  act(() => {
    jest.runAllTimers();
  });

  const logoElement = await screen.findByText((content, element) => {
    const text = element.textContent.replace(/\s+/g, '');
    return text.toLowerCase() === 'anay.live';
  });
  expect(logoElement).toBeInTheDocument();

  jest.useRealTimers();
});
