module.exports = {
  extends: ['stylelint-config-standard'],
  customSyntax: 'postcss-styled-syntax',
  plugins: ['stylelint-order'],
  overrides: [
    {
      files: ['./src/styles/**/*.{ts,js}'],
      rules: {
        'order/properties-order': null,
      },
    },
  ],
  rules: {
    'media-query-no-invalid': null,
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-order': [
      {
        groupName: 'Positioning',
        properties: ['position', 'z-index', 'top', 'right', 'bottom', 'left'],
      },
      {
        groupName: 'BoxModel',
        properties: [
          'display',
          'flex',
          'flex-direction',
          'flex-wrap',
          'flex-flow',
          'flex-grow',
          'flex-shrink',
          'flex-basis',
          'justify-content',
          'align-items',
          'align-content',
          'align-self',
          'order',
          'gap',
        ],
      },
      {
        groupName: 'Size',
        properties: [
          'width',
          'min-width',
          'max-width',
          'height',
          'min-height',
          'max-height',
        ],
      },
      {
        groupName: 'Spacing',
        properties: [
          'margin',
          'margin-top',
          'margin-right',
          'margin-bottom',
          'margin-left',
          'padding',
          'padding-top',
          'padding-right',
          'padding-bottom',
          'padding-left',
        ],
      },
      {
        groupName: 'Borders',
        properties: [
          'border',
          'border-width',
          'border-style',
          'border-color',
          'border-radius',
        ],
      },
      {
        groupName: 'Backgrounds',
        properties: [
          'background',
          'background-color',
          'background-image',
          'background-repeat',
          'background-position',
          'background-size',
        ],
      },
      {
        groupName: 'Typography',
        properties: [
          'color',
          'font-family',
          'font-size',
          'font-weight',
          'line-height',
          'text-align',
          'text-decoration',
        ],
      },
      {
        groupName: 'Effects',
        properties: [
          'opacity',
          'visibility',
          'cursor',
          'pointer-events',
          'transition',
          'transform',
          'animation',
        ],
      },
    ],
  },
};
