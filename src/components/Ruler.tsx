import { useMachine } from "@xstate/react";
import interact from "interactjs";
import * as React from "react";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { assign, createMachine } from "xstate";

interface IContext {
  ref?: React.RefObject<HTMLDivElement>;
  ruler?: React.RefObject<HTMLDivElement>;
  left: number;
  top: number;
  width: number;
  height: number;
}

const machine = createMachine<IContext>({
  initial: "idle",
  context: {
    left: 0,
    top: 0,
    width: 200,
    height: 200
  },
  states: {
    idle: {
      on: {
        DRAG: {
          actions: [
            assign((_, { payload: { left, top } }) => ({ left, top })),
            (ctx, { payload }) => {
              ctx.ref?.current?.style.setProperty(
                "--left",
                `${payload.left}px`
              );
              ctx.ref?.current?.style.setProperty("--top", `${payload.top}px`);
            }
          ]
        },
        RESIZE: {
          actions: [
            assign((_, { payload: { width, height } }) => ({ width, height })),
            (ctx, { payload }) => {
              ctx.ref?.current?.style.setProperty(
                "--width",
                `${payload.width}px`
              );
              ctx.ref?.current?.style.setProperty(
                "--height",
                `${payload.height}px`
              );
            }
          ]
        }
      }
    }
  }
});

const View = styled.div`
  position: fixed;
  border: 1px solid black;
  background-color: rgba(255, 0, 0, 0.5);
  touch-action: none;
  transform: translate3d(var(--left, 0), var(--top, 0), 0);
  user-select: none;
  * {
    pointer-events: none;
  }
  width: var(--width, 200px);
  height: var(--height, 200px);
`;

export function Ruler() {
  const ref = useRef<HTMLDivElement>(null);
  const ruler = useRef<HTMLDivElement>(null);
  const [state, send] = useMachine(machine, {
    context: {
      ref: ref,
      ruler: ruler
    }
  });

  useEffect(() => {
    ref.current &&
      interact(ref.current)
        .draggable({
          listeners: {
            move: ({ rect }) => {
              const { left, top } = rect;
              send("DRAG", {
                payload: { left, top }
              });
            }
          }
        })
        .resizable({
          edges: { left: false, right: true, bottom: true, top: false },
          modifiers: [
            interact.modifiers.restrictSize({
              min: { width: 200, height: 200 },
              max: { width: 500, height: 500 }
            })
          ],
          listeners: {
            move: ({ rect }) => {
              const { width, height } = rect;
              send("RESIZE", {
                payload: { width, height }
              });
            }
          }
        });
  }, [ref]);

  return (
    <View ref={ref}>
      {state.value} ({state.context.left}, {state.context.top}) [
      {state.context.width}, {state.context.height}]
    </View>
  );
}
