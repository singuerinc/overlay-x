import * as React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { Ruler } from "./Ruler";
import { OnionImage } from "./OnionImage";
import styled from "styled-components";

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

const ToolsContainer = styled.div`
  position: fixed;
  pointer-events: none;
  width: 100%;
  height: 100%;
  > * {
    pointer-events: initial;
  }
`;

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <Global />
      <ToolsContainer>
        <Ruler />
      </ToolsContainer>
      <ToolsContainer>
        <OnionImage />
      </ToolsContainer>
    </ThemeProvider>
  );
}
