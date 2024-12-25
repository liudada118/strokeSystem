/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontSize: {
      'xs': '0.75rem', // 12px
      'sm': '0.875rem', // 14px
      'base': '1rem', // 16px
      'lg': '1.125rem', // 18px
      'xl': '2.268rem', // 37px
      '2xl': '1.5rem', // 24px
    },

    screens: {
      md: { max: "940px" },
    },
    extend: {
      width: {
        'xl': '2.268rem', // 37px
      },
      height: {
        'xl': '2.268rem', // 37px
      },
    },
  },
  plugins: [],
}

