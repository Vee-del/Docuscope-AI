/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#2563eb", // customize with your brand color
      },
    },
  },
  plugins: [],
};
// This is the Tailwind CSS configuration file for the frontend project.  