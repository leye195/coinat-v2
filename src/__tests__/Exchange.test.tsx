import { render } from '@testing-library/react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { globalTheme } from '@/styles/theme';
import Exchange from '@/components/Exchange';

describe('<Exchange/>', () => {
  it('should render', () => {
    const { getByText } = render(
      <EmotionThemeProvider theme={globalTheme}>
        <Exchange title="title" value="value" isLoading={false} />
      </EmotionThemeProvider>,
    );

    expect(getByText(/title/)).toBeInTheDocument();
    expect(getByText(/value/)).toBeInTheDocument();
  });

  it('should be loading', () => {
    const { getByText, queryByText } = render(
      <EmotionThemeProvider theme={globalTheme}>
        <Exchange title="title" value="value" isLoading />
      </EmotionThemeProvider>,
    );

    expect(getByText(/title/)).toBeInTheDocument();
    expect(queryByText(/value/)).not.toBeInTheDocument();
  });
});
