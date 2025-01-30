/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
const content = [
  "./src/**/*.{js,ts,jsx,tsx}",
];
const theme = {
};
const plugins = [
  forms,
  "@tailwindcss/postcss",
];

export default {
  content,
  theme,
  plugins,
};