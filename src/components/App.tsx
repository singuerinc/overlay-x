import * as React from "react";
import { useState } from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { OnionImage } from "./OnionImage";
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

  html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}main{display:block}h1{font-size:2em;margin:.67em 0}a{background-color:initial}img{border-style:none}button,input,select{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=button],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}[type=checkbox]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}h1,h2,h3{margin:0}button{background-color:initial;background-image:none}button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}ul{list-style:none;margin:0;padding:0}html{font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}*,:after,:before{box-sizing:border-box;border:0 solid #e2e8f0}img{border-style:solid}input::placeholder{color:#a0aec0}button{cursor:pointer}h1,h2,h3{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}button,input,select{padding:0;line-height:inherit;color:inherit}img,svg{display:block;vertical-align:middle}
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
  const [onions, setOnions] = useState<number[]>([]);
  const [rulers, setRulers] = useState<number[]>([]);

  const handleDelete = (el: number) => () => {
    setOnions(onions => onions.filter(x => x !== el));
  };

  const addOnion = () => setOnions(onions => [...onions, 10]);
  const addRuler = () => setRulers(ruler => [...ruler, 10]);

  return (
    <ThemeProvider theme={theme}>
      <Global />

      <ul>
        <li onClick={addOnion}>add onion</li>
        <li onClick={addRuler}>add ruler</li>
      </ul>

      <ToolsContainer>
        {rulers.map((o, key) => (
          <Ruler key={key} />
        ))}
      </ToolsContainer>
      <ToolsContainer>
        {onions.map((o, key) => (
          <OnionImage key={key} onDelete={handleDelete(o)} />
        ))}
      </ToolsContainer>
    </ThemeProvider>
  );
}
