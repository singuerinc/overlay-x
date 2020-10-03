import { useMachine } from "@xstate/react";
import * as React from "react";
import { useRef } from "react";
import { assign, createMachine } from "xstate";
import { ToolContainer } from "./ToolContainer";

interface IContext {
  imgRef?: React.RefObject<HTMLImageElement>;
  width: number;
  height: number;
}

const machine = createMachine<IContext>(
  {
    initial: "empty",
    context: {
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
      idle: {}
    }
  },
  {
    actions: {
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

export function OnionImage() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [state, send] = useMachine(machine, {
    context: {
      imgRef
    }
  });

  const handleFile = event => send("OPEN", { payload: event.target.files[0] });

  console.log(state.context);

  return (
    <ToolContainer width={state.context.width} height={state.context.height}>
      <>
        {state.matches("empty") && (
          <input id="file" type="file" onChange={handleFile} />
        )}
        <img ref={imgRef} />
      </>
    </ToolContainer>
  );
}
