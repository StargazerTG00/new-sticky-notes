"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NoteModel } from "@/app/types";
import { NOTE_COLORS } from "@/app/features/constants";
import { readNotes, saveNotes } from "@/app/features/storage";

type NoteUpdate = Partial<NoteModel>;

export function useNotes() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const highestZIndex = useRef(0);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const savedNotes = readNotes();

    highestZIndex.current = savedNotes.reduce(
      (highest, note) => Math.max(highest, note.zIndex),
      0
    );
    setNotes(savedNotes);
    // mark as loaded after the state update is queued so the save
    // effect that fires next won't run with the empty initial state
    setTimeout(() => {
      hasLoaded.current = true;
    }, 0);
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    saveNotes(notes);
  }, [notes]);

  const createNote = useCallback((x: number, y: number) => {
    const note: NoteModel = {
      id: crypto.randomUUID(),
      x,
      y,
      width: 220,
      height: 160,
      text: "",
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      zIndex: ++highestZIndex.current,
    };

    setNotes((current) => [...current, note]);
  }, []);

  const updateNote = useCallback((id: string, patch: NoteUpdate) => {
    setNotes((current) =>
      current.map((note) => (note.id === id ? { ...note, ...patch } : note))
    );
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((current) => current.filter((note) => note.id !== id));
  }, []);

  const bringToFront = useCallback(
    (id: string) => {
      updateNote(id, { zIndex: ++highestZIndex.current });
    },
    [updateNote]
  );

  return {
    notes,
    colors: NOTE_COLORS,
    createNote,
    updateNote,
    removeNote,
    bringToFront,
  };
}