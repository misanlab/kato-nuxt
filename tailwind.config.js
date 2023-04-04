/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require("tailwindcss/defaultTheme");

export default {
  theme: {
    extend: {
      fontFamily: {
        primary: ["Inter", ...fontFamily.sans],
      },
      keyframes: {
        appear: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        zoomIn: {
          "0%": { opacity: 0, transform: "scale(.5)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: 0.99,
            filter:
              "drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))",
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: 0.4,
            filter: "none",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-700px 0",
          },
          "100%": {
            backgroundPosition: "700px 0",
          },
        },
      },
      animation: {
        appear: "appear 300ms ease-out 150ms both",
        zoomIn: "appear 300ms ease-out 150ms both",
        flicker: "flicker 3s linear infinite",
        shimmer: "shimmer 1.3s linear infinite",
      },
    },
  },
};
