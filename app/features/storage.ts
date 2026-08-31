import type { NoteModel } from "@/app/types";

const STORAGE_KEY = "sticky-notes";

export function readNotes(): NoteModel[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as NoteModel[]) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: NoteModel[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // fail silently
  }
}