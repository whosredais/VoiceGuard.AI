/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', /* blue-900 */
        secondary: '#3b82f6', /* blue-500 */
        accent: '#ef4444', /* red-500 */
        success: '#10b981', /* emerald-500 */
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
