/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          base: "#08110d",
          raised: "#0d1914",
          inset: "#12211a",
          border: "#1d3328",
          hover: "#162a21",
        },
        forest: {
          50: "#f4f8f5",
          100: "#dce8e0",
          200: "#b7d0c1",
          300: "#8fb29d",
          400: "#6b947c",
          500: "#3f7a5a",
          600: "#2f5e45",
          700: "#234735",
          800: "#193127",
          900: "#102119",
        },
        text: {
          primary: "#f3f6f2",
          secondary: "#9fb3a7",
          muted: "#6f8679",
        },
      },
      boxShadow: {
        panel: "0 1px 0 rgba(255,255,255,0.02), 0 12px 40px rgba(0, 0, 0, 0.22)",
      },
    },
  },
  plugins: [],
};

