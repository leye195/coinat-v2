import '@emotion/react';
import { Theme as LibTheme } from 'styles/theme';

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends LibTheme {}
}
