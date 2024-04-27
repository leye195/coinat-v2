import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import Header from '@/components/Layout/Header';
import { globalTheme } from '@/styles/theme';

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
