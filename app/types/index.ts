export interface NoteModel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  zIndex: number;
}

export type NoteUpdate = Partial<
  Pick<NoteModel, "x" | "y" | "width" | "height" | "color" | "text" | "zIndex">
>;