import { render, screen } from '@testing-library/react';
import Home from 'pages/index';

describe('Home', () => {
  it('renders a header', () => {
    render(<Home />);

    const header = screen.getByText(/Main Page/);

    expect(header).toBeInTheDocument();
  });
});
