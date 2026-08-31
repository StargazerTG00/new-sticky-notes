import type { NoteModel } from "@/app/types";
import { TOOLBAR_HEIGHT } from "./constants";

export function clampNotePosition(
  note: Pick<NoteModel, "x" | "y" | "width" | "height">,
  viewportWidth: number,
  viewportHeight: number
) {
  const maxX = Math.max(0, viewportWidth - note.width);
  const maxY = Math.max(0, viewportHeight - TOOLBAR_HEIGHT - note.height);

  return {
    x: Math.min(Math.max(note.x, 0), maxX),
    y: Math.min(Math.max(note.y, 0), maxY),
  };
}

export function clampNoteSize(
  note: Pick<NoteModel, "x" | "y" | "width" | "height">,
  viewportWidth: number,
  viewportHeight: number
) {
  const maxWidth = Math.max(0, viewportWidth - note.x);
  const maxHeight = Math.max(0, viewportHeight - TOOLBAR_HEIGHT - note.y);

  return {
    width: Math.max(0, maxWidth),
    height: Math.max(0, maxHeight),
  };
}