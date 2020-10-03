import styled from "styled-components";

export const View = styled.div`
  position: fixed;
  border: 1px dashed transparent;
  background-color: rgba(0, 0, 0, 0);
  touch-action: none;
  transform: translate3d(var(--left, 0), var(--top, 0), 0);
  min-width: 200px;
  min-height: 200px;
  width: var(--width, 200px);
  height: var(--height, 200px);
  > * {
    user-select: none;
    /* pointer-events: none; */
  }

  &:hover {
    border-color: black;
  }
`;

import { useMachine } from "@xstate/react";
import interact from "interactjs";
import * as React from "react";
import { useEffect, useRef } from "react";
import { assign, createMachine } from "xstate";

interface IContext {
  ref?: React.RefObject<HTMLDivElement>;
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

export function ToolContainer({
  children,
  width,
  height
}: {
  children: React.ReactNode;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [, send] = useMachine(machine, {
    context: {
      ref: ref
    }
  });

  useEffect(() => {
    ref.current &&
      interact(ref.current).draggable({
        listeners: {
          move: ({ rect }) => {
            const { left, top } = rect;
            send("DRAG", {
              payload: { left, top }
            });
          }
        }
      });
  }, [ref]);

  useEffect(() => {
    send("RESIZE", { payload: { width, height } });
  }, [width, height]);

  return <View ref={ref}>{children}</View>;
}
