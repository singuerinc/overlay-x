import * as React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { Ruler } from "./Ruler";

const theme = {
  main: "red"
};

const Global = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: #CCC;
  }
`;

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <Global />
      <Ruler />
    </ThemeProvider>
  );
}
