import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import Exchange from '@/components/Exchange';
import { globalTheme } from '@/styles/theme';

describe('<Exchange/>', () => {
  it('should render', () => {
    render(
      <EmotionThemeProvider theme={globalTheme}>
        <Exchange title="title" value="value" isLoading={false} />
      </EmotionThemeProvider>,
    );

    expect(screen.getByText(/title/)).toBeInTheDocument();
    expect(screen.getByText(/value/)).toBeInTheDocument();
  });

  it('should be loading', () => {
    const { getByText, queryByText } = render(
      <EmotionThemeProvider theme={globalTheme}>
        <Exchange title="title" value="value" isLoading />
      </EmotionThemeProvider>,
    );

    expect(screen.getByText(/title/)).toBeInTheDocument();
    expect(screen.queryByText(/value/)).not.toBeInTheDocument();
  });
});
