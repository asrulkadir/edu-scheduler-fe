import js from "@eslint/js";
import typescript from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/", ".next/", "coverage/", "public/", "*.config.*"],
  },
  js.configs.recommended,
  ...typescript.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "no-console": "warn",
      semi: ["error", "always"],
      "@typescript-eslint/explicit-function-return-type": "off",
      "react/prop-types": "off",
    },
  },
  prettier,
];

