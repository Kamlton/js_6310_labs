import js from '@eslint/js'
import globals from 'globals'
import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import pluginReact from 'eslint-plugin-react'

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: Object.assign({}, 
        globals.browser,
        globals.node,
        {
          describe: 'readonly',
          it: 'readonly',
          test: 'readonly',
          expect: 'readonly',
          beforeEach: 'readonly',
          afterEach: 'readonly',
          jest: 'readonly'
        }
      ),
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      'react': pluginReact
    },
    rules: Object.assign({},
      js.configs.recommended.rules,
      typescriptPlugin.configs.recommended.rules,
      pluginReact.configs.recommended.rules,
      {
        'indent': ['error', 2],
        'quotes': ['error', 'single'],
        'semi': ['error', 'never'],
        'no-var': 'error',
        'react/react-in-jsx-scope': 'off',
        'no-trailing-spaces': 'error',
        'eol-last': ['error', 'always']
      }
    ),
    settings: {
      react: {
        version: 'detect'
      }
    }
  }
]