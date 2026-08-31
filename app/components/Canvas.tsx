"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNotes } from "@/app/hooks/useNotes";
import Note from "@/app/components/Note";
import TrashZone from "@/app/components/TrashZone";
import Toolbar from "@/app/components/Toolbar";
import { clampNotePosition } from "@/app/features/noteBounds";
import { TOOLBAR_HEIGHT } from "@/app/features/constants";

export default function Canvas() {
    const { notes, colors, createNote, updateNote, removeNote, bringToFront } =
        useNotes();

    const trashRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [trashActive, setTrashActive] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            notes.forEach((note) => {
                const clamped = clampNotePosition(
                    note,
                    window.innerWidth,
                    window.innerHeight
                );

                if (clamped.x !== note.x || clamped.y !== note.y) {
                    updateNote(note.id, { x: clamped.x, y: clamped.y });
                }
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [notes, updateNote]);

    const handleAddNote = () => {
        const x = Math.max(40, window.innerWidth / 2 - 110);
        const y = Math.max(40, window.innerHeight / 2 - 80);
        createNote(x, y);
    };

    const handleCanvasDoubleClick = (e: React.MouseEvent) => {
        if (e.target !== e.currentTarget) return;
        if (isDragging) return;

        const x = Math.max(0, e.clientX - 110);
        const y = Math.max(0, e.clientY - TOOLBAR_HEIGHT);

        createNote(x, y);
    };

    return (
        <main
            className="canvas"
            onDoubleClick={handleCanvasDoubleClick}
        >
            <Toolbar onAddNote={handleAddNote} />

            {notes.map((note) => (
                <Note
                    key={note.id}
                    note={note}
                    colors={colors}
                    onUpdate={updateNote}
                    onRemove={removeNote}
                    onBringToFront={bringToFront}
                    trashRef={trashRef}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => {
                        setIsDragging(false);
                        setTrashActive(false);
                    }}
                    onDragOverTrash={setTrashActive}
                />
            ))}

            <TrashZone
                visible={isDragging}
                active={trashActive}
                trashRef={trashRef}
            />
        </main>
    );
}