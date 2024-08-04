import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  important: true,
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          light: '#3B81F6',
          DEFAULT: '#497B9D',
          dark: '#2B6DAA',
        },
        secondary: {
          light: '#7CBAF2',
          DEFAULT: '#5CA3DB',
          dark: '#437FB8',
        },
        success: {
          light: '#68D391',
          DEFAULT: '#48BB78',
          dark: '#38A169',
        },
        warning: {
          light: '#F6AD55',
          DEFAULT: '#ED8936',
          dark: '#DD6B20',
        },
        danger: {
          light: '#FC8181',
          DEFAULT: '#F56565',
          dark: '#E53E3E',
        },
        info: {
          light: '#63B3ED',
          DEFAULT: '#4299E1',
          dark: '#3182CE',
        },
      },
    },
  },
  plugins: [],
};
export default config;
