import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/**/*.html"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        primary: [
          "var(--notoSansJP)",
          "-apple-system",
          "var(--roboto)",
          "sans-serif",
          ...defaultTheme.fontFamily.sans,
        ],
        manrope: ["var(--manrope)"],
        times: ['"Times New Roman"', "Times", "serif"],
      },
      colors: {
        blue: {
          80: "#00D0D7",
        },
        red: {
          100: "#FF3826",
        },
        gray: {
          10: "#0F0C24",
          30: "#B2B8D0",
          60: "#3B4C5C",
          100: "#120F24",
        },
        mono: {
          50: "#7C8080",
        },
        element: {
          primary: "#121926",
          secondary: "#697586",
          skeleton: "#E3E8EF",
          tertiary: "#CDD5DF",
          primary2: "#0D121C",
          placeholder: "#CDD5DF",
          alert: "#FF3826",
          main: "#00D0D7",
          success: "#46A016",
          purchased: "#FF4287",
          notice: "#0587FF",
          danger: "#FF4245",
        },
        divider: {
          normal: "#E3E8EF",
        },
        overlay: {
          modal: "#000000",
        },
        background: {
          primary: { dark: "#39394B", light: "#ffffff" },
          secondary: { dark: "#222131", light: "#f1f4fa" },
        },
        color: {
          dark: "#e5e7eb",
          light: "#374151",
        },
        tundraBrown: "#474244",
      },
      keyframes: {
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: "0.99",
            filter:
              "drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))",
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: "0.4",
            filter: "none",
          },
        },
      },
      animation: {
        flicker: "flicker 3s linear infinite",
      },
      backgroundImage: {
        "primary-checkbox": "url('../../public/svg/primary-checkbox-icon.svg')",
      },
      listStyleType: {
        none: "none",
        disc: "disc",
        decimal: "decimal",
        lowerAlpha: "lower-alpha",
        lowerRoman: "lower-roman",
      },
      boxShadow: {
        custom: "0 -2px 6px 0 rgba(0, 0, 0, 0.1)",
        main: "0 0 20px 0 rgba(0,183,189,0.4)",
      },
    },
  },
  plugins: [],
} satisfies Config;
