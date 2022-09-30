import { render, screen } from '@testing-library/react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { RecoilRoot } from 'recoil';
import { globalTheme } from '@/styles/theme';
import Home from 'pages/index';

describe('Home', () => {
  it('renders a header', () => {
    render(
      <EmotionThemeProvider theme={globalTheme}>
        <RecoilRoot>
          <Home />
        </RecoilRoot>
      </EmotionThemeProvider>,
    );
  });
});
