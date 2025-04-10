import { COLORS } from "./colors";

const LIGHT = {
  foreground: {
    primary: COLORS.black,
    secondary: "#6F6F6F",
    tertiary: "#E9E9E9",
  },
  background: {
    primary: "#fdf4e7",
    secondary: "#ffffff",
    tertiary: "#f4c890",
  },
  overlay: "rgba(30, 30, 30, 0.4)",
  brand: {
    primary: COLORS.primary,
    cobalt: COLORS.cobalt,
    yolk: COLORS.yolk,
    radish: COLORS.radish,
    powder: COLORS.powder,
    kale: COLORS.kale,
    beet: COLORS.beet,
  },
  default: {
    white: COLORS.white,
    black: COLORS.black,
  },
  state: {
    focus: {
      outline: COLORS.cobalt,
    },
    disabled: {
      color: "#6F6F6F",
      background: "#E9E9E9",
    },
  },
  semantic: {
    error: COLORS.primary,
    success: "#00A840",
    warning: COLORS.yolk,
    information: COLORS.cobalt,
  },
};

const DARK = {
  foreground: {
    primary: COLORS.white,
    secondary: "#6d6d6d",
    tertiary: "#434343",
  },
  background: {
    primary: COLORS.black,
    secondary: "#2e2e2e",
    tertiary: "#787878",
  },
  overlay: "rgba(30, 30, 30, 0.9)",
  brand: {
    primary: COLORS.primary,
    cobalt: COLORS.cobalt,
    yolk: COLORS.yolk,
    radish: COLORS.radish,
    powder: COLORS.powder,
    kale: COLORS.kale,
    beet: COLORS.beet,
  },
  default: {
    white: COLORS.black,
    black: COLORS.white,
  },
  state: {
    focus: {
      outline: COLORS.white,
    },
    disabled: {
      color: "#6d6d6d",
      background: "#434343",
    },
  },
  semantic: {
    error: COLORS.primary,
    success: "#00A840",
    warning: COLORS.yolk,
    information: COLORS.cobalt,
  },
};

const THEMES = {
  light: LIGHT,
  dark: DARK,
};

const AVAILABLE_THEMES = Object.keys(THEMES);

export { THEMES, AVAILABLE_THEMES };
