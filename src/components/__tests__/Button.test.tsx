import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/Button';

describe('<Button/>', () => {
  it('should render Button', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} type="button">
        button
      </Button>,
    );

    const button = screen.getByText(/button/);
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be render with bgColor, color', () => {
    render(
      <Button type="button" color="#aabbcc" bgColor="#aadd00">
        button
      </Button>,
    );
    const button = screen.getByText(/button/);

    expect(button).toHaveStyle('background-color: #aadd00');
    expect(button).toHaveStyle('color: #aabbcc');
  });

  it('should be disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} type="button" disabled>
        button
      </Button>,
    );

    const button = screen.getByText(/button/);

    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(0);
  });
});
