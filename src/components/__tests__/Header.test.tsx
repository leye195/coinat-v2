import { render } from '@testing-library/react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { RecoilRoot } from 'recoil';
import { globalTheme } from '@/styles/theme';
import Header from '@/components/Layout/Header';

describe('<Header/>', () => {
  it('should render Header component', () => {
    const { getByText } = render(
      <EmotionThemeProvider theme={globalTheme}>
        <RecoilRoot>
          <Header />
        </RecoilRoot>
      </EmotionThemeProvider>,
    );

    expect(getByText(/CoinAT/)).toBeInTheDocument();
  });
});
