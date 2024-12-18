const rem = (value, base = 16) => `${value / base}rem`;
const colors = {

  primary: {
    25: '#F6FEF9',
    50: '#ECFDF3',
    100: '#D1FADF',
    200: '#A6F4C5',
    300: '#6CE9A6',
    400: '#32D583',
    500: '#00C16B',
    600: '#039855',
    700: '#027A48',
    800: '#05603A',
    900: '#07452C',
  },
  secondary: {
    25: "#F5F8FF",
    50: "#EFFAFF",
    100: "#D1EOFF",
    200: "#B2CCFF",
    300: "#84ADEF",
    400: "#528BFF",
    500: "#2970FF",
    600: "#155EEF",
    700: "#004ЕЕВ",
    800: "#0040C1",
    900: "#00359E",
  },
  gray: {
    25: "#FCFCFD",
    50: "#F8FAFC",
    100: "#EEF2F6",
    200: "#E3E8EF",
    300: "#CDD5DF",
    400: "#9AA4B2",
    500: "#697586",
    600: "#4B5565",
    700: "#364152",
    800: "#202939",
    900: "#121926",
  },
  error: {
    25: "#EFFBFA",
    50: "#FEF3F2",
    100: "#FEE4E2",
    200: "#FECDCA",
    300: "#FDA29B",
    400: "#F97066",
    500: "#F04438",
    600: "#D92D20",
    700: "#B42318",
    800: "#912018",
    900: "#7A271A",
  },
  warning: {
    25: "#FFFCF5",
    50: "#FFFAEB",
    100: "#FEFOC7",
    200: "#FEDF89",
    300: "#FEC84B",
    400: "#FDB022",
    500: "#F79009",
    600: "#DC6803",
    700: "#B54708",
    800: "#93370D",
    900: "#7A2E0E",
  },
  success: {
    25: "#F6FEF9",
    50: "#ECFDF3",
    100: "#D1FADF",
    200: "#A6F4C5",
    300: "#6CE9A6",
    400: "#32583",
    500: "#00C16B",
    600: "#099250",
    700: "#027A48",
    800: "#05603A",
    900: "#07452C",
  },
};
module.exports = {
  theme: {
    fontFamily: {
      display: 'Instrument Condensed',
      sans: 'Instrument',
      mono: 'monospace',
    },
    fontSize: {
      huge: '7rem',
      '7xl': '5rem',
      '6xl': '4.5rem',
      '5xl': '4rem',
      '4xl': '3.5rem',
      '3xl': '3rem',
      '2xl': '2.5rem',
      'button-xl': [
        '1.25rem',
        {
          letterSpacing: '0',
          lineHeight: '1.1875rem'
        }
      ],
      'display-xs': [
        '1.65rem',
        {
          letterSpacing: '0',
          lineHeight: '2rem',
        },
      ],
      'display-sm': [
        '1.85rem',
        {
          letterSpacing: '0',
          lineHeight: '2rem',
        },
      ],
      xl: '2rem',
      lg: [
        '1.25rem',
        {
          letterSpacing: '0',
          lineHeight: '1.75rem',
        },
      ],
      md: [
        '1rem',
        {
          letterSpacing: '0',
          lineHeight: '1.25rem',
        },
      ],
      base: [
        '1rem',
        {
          letterSpacing: '0',
          lineHeight: '1.5rem',
        },
      ],
      sm: [
        '0.875rem',
        {
          letterSpacing: '0',
          lineHeight: '1rem',
        },
      ],
      xs: [
        '0.75rem',
        {
          letterSpacing: '0',
          lineHeight: '0.875rem',
        },
      ],
    },
    screens: {
      "xs-only": { max: "639px" },
      sm: { min: "640px" },
      md: { min: "768px" },
      lg: { min: "1024px" },
      xl: { min: "1280px" },
    },
    extend: {
      borderRadius: {
        '4xl': rem(32),
      },
      colors: colors,
      height: {
        '1/4': '25%',
        '3/4': '75%',
        4: rem(16),
        18: rem(72),
        21: rem(84),
        30: rem(120),
        34: rem(136),
        35: rem(140),
        55: rem(220),
        70: rem(280),
        19: rem(304),
        100: rem(400),
        161.5: rem(646),
      },
      maxHeight: {
        40: rem(160),
        50: rem(200),
        55: rem(220),
        60: rem(240),
        100: rem(400),
      },
      minHeight: {
        12: rem(48),
        19: rem(76),
        21: rem(84),
        24: rem(96),
      },
      width: {
        '1/4': '25%',
        '1/3': '33.33%',
        '2/5': '40%',
        '3/5': '60%',
        '3/4': '75%',
        4: rem(16),
        18: rem(72),
        21: rem(84),
        28: rem(112),
        30: rem(120),
        38: rem(152),
        40: rem(160),
        168: rem(672),
      },
      maxWidth: {
        16: rem(64),
        100: rem(400),
        200: rem(800),
        '1/2': '50%'
      },
      minWidth: {
        16: rem(64),
        21: rem(84),
        30: rem(120),
      },
      rotate: {
        '15': '15deg',
        '23': '23deg',
        '38': '38deg',
      },
      transformOrigin: {
        'bottom-right-1/2-1/2': '100% 50%',
      },
    },
    variants: {
      extend: {
        borderWidth: ['hover'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
