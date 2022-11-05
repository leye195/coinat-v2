import { render, screen } from '@testing-library/react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { RecoilRoot } from 'recoil';
import { globalTheme } from '@/styles/theme';
import Header from '@/components/Layout/Header';

describe('<Header/>', () => {
  it('should render Header component', () => {
    render(
      <EmotionThemeProvider theme={globalTheme}>
        <RecoilRoot>
          <Header />
        </RecoilRoot>
      </EmotionThemeProvider>,
    );

    expect(screen.getByText(/CoinAT/)).toBeInTheDocument();
  });
});
