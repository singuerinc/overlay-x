import { useMachine } from "@xstate/react";
import * as React from "react";
import styled from "styled-components";
import { useRef } from "react";
import { assign, createMachine } from "xstate";
import { ToolContainer } from "./ToolContainer";

interface IContext {
  imgRef?: React.RefObject<HTMLImageElement>;
  width: number;
  height: number;
  inverted: boolean;
  translucent: boolean;
}

const machine = createMachine<IContext>(
  {
    initial: "empty",
    context: {
      inverted: false,
      translucent: false,
      width: 0,
      height: 0
    },
    states: {
      empty: {
        on: {
          OPEN: "load"
        }
      },
      load: {
        invoke: {
          src: "loadImage",
          onError: "empty",
          onDone: {
            target: "idle",
            actions: ["setSize"]
          }
        }
      },
      idle: {
        on: {
          REMOVE: {
            actions: [
              assign(_ => ({ inverted: false, translucent: false })),
              "remove"
            ]
          },
          INVERT: {
            actions: [assign({ inverted: ctx => !ctx.inverted }), "invert"]
          },
          TRANSLUCENT: {
            actions: [
              assign({ translucent: ctx => !ctx.translucent }),
              "translucent"
            ]
          }
        }
      }
    }
  },
  {
    actions: {
      translucent: ctx => {
        ctx.imgRef.current.style.opacity = `${ctx.translucent ? 0.5 : 1}`;
      },
      invert: ctx => {
        ctx.imgRef.current.style.filter = `invert(${ctx.inverted ? 1 : 0})`;
      },
      setSize: assign({
        width: (_, event) => event.data.width,
        height: (_, event) => event.data.height
      })
    },
    services: {
      loadImage: (ctx, event) => {
        return new Promise((resolve, reject) => {
          const file = event.payload;
          if (!file.type.startsWith("image/")) {
            reject();
          }

          const reader = new FileReader();
          reader.onload = e => {
            const img = ctx.imgRef?.current;
            img.src = e.target.result;
            img.onload = () => {
              const cs = window.getComputedStyle(img);
              console.log(parseInt(cs.width, 10), parseInt(cs.height, 10));

              resolve({
                width: parseInt(cs.width, 10),
                height: parseInt(cs.height, 10)
              });
            };
          };
          reader.readAsDataURL(file);
        });
      }
    }
  }
);

export function OnionImage({ onDelete }: { onDelete: VoidFunction }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [state, send] = useMachine(machine, {
    context: {
      imgRef
    },
    actions: {
      remove: ctx => {
        ctx.imgRef.current.src = null;
        onDelete();
      }
    }
  });

  const handleFile = event => send("OPEN", { payload: event.target.files[0] });

  const handleAction = type => () => {
    switch (type) {
      case "invert":
        send("INVERT");
        break;
      case "translucent":
        send("TRANSLUCENT");
        break;
      case "remove":
        send("REMOVE");
        break;
    }
  };

  return (
    <ToolContainer width={state.context.width} height={state.context.height}>
      {state.value}
      {state.matches("idle") && (
        <Tools>
          <li onClick={handleAction("invert")}>invert</li>
          <li onClick={handleAction("translucent")}>translucent</li>
          <li onClick={handleAction("remove")}>remove</li>
        </Tools>
      )}
      {state.matches("empty") && (
        <input id="file" type="file" onChange={handleFile} />
      )}
      <img ref={imgRef} />
    </ToolContainer>
  );
}

const Tools = styled.ul`
  position: absolute;
  z-index: 1;
  background: red;
  list-style: none;
  margin: 0;
  padding: 0.6em;
  display: flex;

  > li {
    background: black;
    color: white;
    width: 50px;
    height: 50px;
    border: 2px solid gray;
  }
`;
