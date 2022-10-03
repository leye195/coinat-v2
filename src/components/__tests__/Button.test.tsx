import { render, fireEvent } from '@testing-library/react';
import Button from '@/components/Button';

describe('<Button/>', () => {
  it('should render Button', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick} type="button">
        button
      </Button>,
    );

    const button = getByText(/button/);
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).toBeCalledTimes(1);
  });

  it('should be render with bgColor, color', () => {
    const { getByText } = render(
      <Button type="button" color="#aabbcc" bgColor="#aadd00">
        button
      </Button>,
    );
    const button = getByText(/button/);

    expect(button).toHaveStyle('background-color: #aadd00');
    expect(button).toHaveStyle('color: #aabbcc');
  });

  it('should be disabled', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick} type="button" disabled>
        button
      </Button>,
    );

    const button = getByText(/button/);

    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).toBeCalledTimes(0);
  });
});
