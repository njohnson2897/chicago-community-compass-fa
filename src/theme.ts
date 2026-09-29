import { createTheme } from "@mui/material/styles";

// True Chicago-flag blue (#41B6E6) is too light for white button text,
// so main is a deepened version and light holds the original for accents.
const theme = createTheme({
  palette: {
    primary: {
      main: "#0B8FC4",
      light: "#41B6E6",
      dark: "#086A92",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#455A64",
      contrastText: "#ffffff",
    },
    background: {
      default: "#F7F9FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A2B33",
      secondary: "#5A6B73",
    },
  },

  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderColor: "#E3E9EC",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E3E9EC",
        },
      },
    },
  },
});

export default theme;