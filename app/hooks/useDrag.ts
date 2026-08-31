import { useCallback, useRef } from "react";

interface DragCallbacks {
  onMove: (dx: number, dy: number) => void;
  onEnd: (dx: number, dy: number) => void;
}

export function useDrag({ onMove, onEnd }: DragCallbacks) {
  const onMoveRef = useRef(onMove);
  const onEndRef = useRef(onEnd);

  onMoveRef.current = onMove;
  onEndRef.current = onEnd;

  return {
    startDrag: useCallback((event: React.MouseEvent) => {
      event.preventDefault();

      const startX = event.clientX;
      const startY = event.clientY;

      const handleMove = (moveEvent: MouseEvent) => {
        onMoveRef.current(
          moveEvent.clientX - startX,
          moveEvent.clientY - startY
        );
      };

      const handleEnd = (upEvent: MouseEvent) => {
        onEndRef.current(
          upEvent.clientX - startX,
          upEvent.clientY - startY
        );

        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
    }, []),
  };
}