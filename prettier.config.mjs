/** @type {import("prettier").Config} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  semi: false,
  singleQuote: true,
  printWidth: 100,
  tailwindFunctions: ['cva'],
}

export default config
