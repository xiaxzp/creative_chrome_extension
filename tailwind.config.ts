import type { Config } from 'tailwindcss';

export const colors = {
  primary: {
    1: '#D7F2F0', // 950
    2: '#9ee1dd', // 850
    3: '#6fd5d1', // 750
    4: '#31bdb8', // 650
    5: '#00a5a0', // 550
    6: '#009995', // 500
    onSurface: '#017976', // 450
    7: '#017976', // 450
    8: '#005a58', // 350
    9: '#004a48', // 300
    10: '#003b3a', // 250
    11: '#002c2b', // 150
    fill: '#009995',
    onFill: '#FFFFFF',
    fillLow: '#9EE1DD',
    onFillLow: '#002C2B',
    surface: '#FFFFFF',
    surface1: '#F2FDFC',
    surface2: '#E8FBF9',
    surface3: '#D7F2F0',
    transparentFill: '#01797600',
  },
  gray: {
    1: '#FFFFFF',
    2: '#f8f8f9',
    3: '#f2f3f3',
    4: '#f1f2f2',
    5: '#ececed',
    6: '#d3d4d5',
    7: '#d3d4d5',
    8: '#a9abac',
    9: '#8A8A8A',
    10: '#6d6e70',
    11: '#121415',
    12: '#87898b',
    page: '#f6f6f6',
    form: 'rgba(248, 248, 248, 0.5)',
  },
  support: {
    fill: '#8078F6',
    onFill: '#FFFFFF',
    fillLow: '#CDCFFF',
    onFillLow: '#221F4B',
    surface: '#FFFFFF',
    surface1: '#FBFAFF',
    surface2: '#F5F4FF',
    surface3: '#E9EBFF',
    onSurface: '#665CD6',
  },
  info: {
    1: '#dbf0ff', // 950
    2: '#a6dcff', // 850
    3: '#7eceff', // 750
    4: '#4eb3e9', // 650
    5: '#189cd4', // 550
    6: '#0e91c6', // 500
    7: '#0c75a0', // 450
    8: '#105676', // 350
    9: '#0b4761', // 300
    10: '#09394f', // 250
    11: '#071a25', // 150
  },
  success: {
    1: '#d7fcd9', // 950
    2: '#99e4a2', // 850
    3: '#7ad889', // 750
    4: '#55bd69', // 650
    5: '#35a752', // 550
    6: '#2a9c49', // 500
    7: '#057e33',
    8: '#035d23',
    9: '#034c1c',
    10: '#033d15',
    11: '#052d0f',
    fill: '#2A9C49',
    fillLow: '#99E4A2',
    onFill: '#FFFFFF',
    onFillLow: '#052D0F',
    surface1: '#EFFFF0',
    surface2: '#E7FDE8',
    surface3: '#DDF9DF',
    onSurface: '#057E33',
  },
  error: {
    fill: '#EF504B',
    fillLow: '#FFC6BD',
    onFill: '#FFFFFF',
    onFillLow: '#4E0C0B',
    surface1: '#FFF9F8',
    surface2: '#FFF2F0',
    surface3: '#FFE7E3',
    onSurface: '#CA242E',
  },
  warning: {
    1: '#fbde89',
    2: '#fad253',
    3: '#f0c133',
    4: '#d2a106',
    5: '#ba8b04',
    6: '#ad821a',
    7: '#8d670b',
    8: '#7a580e',
    9: '#68490b',
    10: '#573b09',
    11: '#462f08',
    fill: '#D2A106',
    fillLow: '#FAD253',
    onFill: '#FFFFFF',
    onFillLow: '#342209',
    surface1: '#FFFBEC',
    surface2: '#FDF5DA',
    surface3: '#FBEBBC',
    onSurface: '#8D670B',
  },
  danger: {
    1: '#ffd8d2',
    2: '#ffc6bd',
    3: '#ffafa3',
    4: '#f78a7e',
    5: '#f4655b',
    6: '#ef504b',
    7: '#ca242e',
    8: '#b51d27',
    9: '#9b1720',
    10: '#801118',
    11: '#680e13',
  },
  neutral: {
    fillMedHigh: '#404142',
    fill: '#87898B',
    fillLow: '#D3D4D5',
    fillLowInverse: '#ECECED',
    onFill: '#FFFFFF',
    onFillLow: '#262627',
    surface: '#FFFFFF',
    surface1: '#F8F8F9',
    surface2: '#F2F3F3',
    surface3: '#ECECED',
    highOnSurface: '#121415',
    onSurface: {
      disabled: '#A9ABAC',
      DEFAULT: '#6D6E70',
    },
    lowOnSurface: '#87898B',
    transparentFill: '#12141500',
    overlay: '#26262750',
    overlayLow: '#26262715',
  },
  data: {
    data1: {
      fill: '#8987F6',
      fillHigh: '#665CD6',
      surface: '#A1A1FA20',
    },
    data2: {
      fill: '#00577D',
      surface: '#7CC0ED20',
    },
    data3: {
      fill: '#E3CBE1',
      fillMedHigh: '#B87BB4',
      fillHigh: '#442942',
      surface: '#D19DCD20',
    },
    data4: {
      fill: '#A45626',
      fillHigh: '#623216',
      surface: '#F69C6B20',
    },
    data5: {
      fill: '#98CCF0',
      fillMedHigh: '#3D9FD4',
      fillHigh: '#0074A6',
      surface: '#B0DBFA20',
    },
    data6: {
      fill: '#5548BD',
      fillHigh: '#473AA5',
      surface: '#CDCFFF20',
    },
    data7: {
      fill: '#F8DBCC',
      fillMedHigh: '#D7763E',
      fillHigh: '#A45626',
      surface: '#F7C9B120',
    },
    data8: {
      fill: '#664163',
      fillHigh: '#533451',
      surface: '#E3CBE120',
    },
    data9: {
      fill: '#BABDFF',
      fillMedHigh: '#3A3086',
      fillHigh: '#221F4B',
      surface: '#8987F620',
      onSurface: '#8987F6',
    },
    error: {
      fill: '#F78A7E',
      fillHigh: '#F4655B',
      surface: '#F78A7E20',
    },
    warning: {
      fill: '#F0C133',
      fillHigh: '#BA8B04',
      surface: '#FAD25320',
    },
    success: {
      fill: '#035D23',
      surface: '#55BD6920',
    },
    neutral: {
      fill: '#728DEC',
      fillHigh: '#5E5F61',
      surface: '#A9ABAC20',
    },
  },
};
const range = (end: number, start = 0, step = 1) =>
  Array.from({ length: Math.ceil((end - start) / step) + 1 }, (_, i) => i * step + start).filter((x) => x <= end);

const rangeToUnit = (input: number[], unit = 'px') => Object.fromEntries(input.map((item) => [item, `${item}${unit}`]));

const fontSize: Record<string, [fontSize: string, lineHeight: string]> = {
  xs: ['12px', '20px'],
  sm: ['14px', '22px'],
  base: ['16px', '24px'],
  lg: ['18px', '26px'],
  '2lg': ['20px', '28px'],
  '3lg': ['22px', '30px'],
  xl: ['24px', '32px'],
  '2xl': ['26px', '34px'],
  '3xl': ['28px', '36px'],
  '4xl': ['30px', '38px'],
  '5xl': ['32px', '40px'],
};

const spacing = {
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px',
};

const borderRadius = {
  none: '0',
  sm: '2px',
  md: '4px',
  DEFAULT: '4px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
};

const semanticColors = {
  secondary: colors.gray['10'], // gray-10
  tertiary: colors.gray['9'], // gray-9
  disabled: colors.gray['8'], // gray-8
  white: '#fff', // gray-1
  black: '#000',
  dark: colors.gray['11'],
  inherit: 'inherit',
};

const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
};

const tailwindConfig: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // container: {
  //   screens: [],
  // },
  // corePlugins: {
  //   preflight: false,
  // },
  theme: {
    // borderRadius,
    backgroundColor: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
      ...semanticColors,
    },
    textColor: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
      ...semanticColors,
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
      ...semanticColors,
    },
    // spacing: {
    //   ...spacing,
    //   ...rangeToUnit(range(24, 0, 1)), // 0-24
    //   ...rangeToUnit(range(100, 24, 2)), // 24-100，每个数字间隔 2，例如 26, 28, 30...
    // },
    // fontSize: {
    //   ...fontSize,
    //   ...rangeToUnit(range(60, 10, 2)), // 10-60, 间隔 2
    // },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '500',
      bold: '700',
      black: '900',
    },
    // lineHeight: {
    //   ...lineHeight,
    //   ...rangeToUnit(range(60, 12, 2)), // 12-60, 间隔 2
    // },

    extend: {
      fontFamily: {
        default:
          'TikTokFont, -apple-system, pingfang sc, hiragino sans gb, microsoft yahei, helvetica neue, helvetica, arial, sans-serif, apple color emoji, segoe ui emoji, segoe ui symbol, auto;',
      },
      boxShadow: {
        1: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        2: '0px 3px 9px rgba(0, 0, 0, 0.08)',
        3: '0px 4px 12px rgba(0, 0, 0, 0.08)',
        4: '0px 6px 18px rgba(0, 0, 0, 0.08)',
      },
      opacity: {
        '14': '0.14',
      },
    },
  },
};

export default tailwindConfig;
