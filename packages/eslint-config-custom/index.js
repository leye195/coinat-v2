module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "jest": true
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "ignorePatterns": ["*.config.js", "*.setup.js", "mockServiceWorker.js"],
  "extends": [
    "next/core-web-vitals",
    "prettier",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:tailwindcss/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": ["tsconfig.json"]
  },
  "plugins": [
    "@typescript-eslint",
    "unused-imports",
    "prettier",
    "testing-library"
  ],
  "overrides": [
    {
      "files": [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)"
      ],
      "extends": ["plugin:testing-library/react"]
    }
  ],
  "rules": {
    "@typescript-eslint/no-unnecessary-template-expression": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-duplicate-type-constituents": "error",
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }
    ],
    "prefer-template": "error",
    "import/extensions": "off",
    "import/order": [
      "error",
      {
        "groups": [
          "external",
          "builtin",
          "internal",
          ["parent", "sibling"],
          "index"
        ],
        "pathGroups": [
          {
            "pattern": "next",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "@fortawesome/**",
            "group": "external",
            "position": "after"
          },
          {
            "pattern": "@/**",
            "group": "internal",
            "position": "after"
          },
          {
            "pattern": "./**",
            "group": "internal",
            "position": "after"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react", "next"],
        "newlines-between": "never",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ]
  }
};
