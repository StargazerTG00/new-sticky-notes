import { useCallback, useRef } from "react";
import { NOTE_MIN_HEIGHT, NOTE_MIN_WIDTH } from "@/app/features/constants";

interface ResizeCallbacks {
  onResize: (width: number, height: number) => void;
}

export function useResize({ onResize }: ResizeCallbacks) {
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  return {
    startResize: useCallback(
      (
        event: React.MouseEvent,
        currentSize: { width: number; height: number }
      ) => {
        event.preventDefault();

        const startX = event.clientX;
        const startY = event.clientY;
        const initialWidth = currentSize.width;
        const initialHeight = currentSize.height;

        const handleMove = (moveEvent: MouseEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;

          const newWidth = Math.max(NOTE_MIN_WIDTH, initialWidth + dx);
          const newHeight = Math.max(NOTE_MIN_HEIGHT, initialHeight + dy);

          onResizeRef.current(newWidth, newHeight);
        };

        const handleEnd = () => {
          document.removeEventListener("mousemove", handleMove);
          document.removeEventListener("mouseup", handleEnd);
        };

        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleEnd);
      },
      []
    ),
  };
}