"use client";

import React, { useEffect, useRef, useState } from "react";
import type { NoteModel } from "@/app/types";
import { useDrag } from "@/app/hooks/useDrag";
import { useResize } from "@/app/hooks/useResize";
import { TOOLBAR_HEIGHT } from "@/app/features/constants";

interface NoteProps {
    note: NoteModel;
    colors: readonly string[];
    onUpdate: (id: string, patch: Partial<NoteModel>) => void;
    onRemove: (id: string) => void;
    onBringToFront: (id: string) => void;
    trashRef: React.RefObject<HTMLDivElement | null>;
    onDragStart: () => void;
    onDragEnd: () => void;
    onDragOverTrash: (over: boolean) => void;
}

function isOverlapping(
    source: HTMLElement | null,
    target: HTMLElement | null
): boolean {
    if (!source || !target) return false;

    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    return (
        sourceRect.left < targetRect.right &&
        sourceRect.right > targetRect.left &&
        sourceRect.top < targetRect.bottom &&
        sourceRect.bottom > targetRect.top
    );
}

export default function Note({
    note,
    colors,
    onUpdate,
    onRemove,
    onBringToFront,
    trashRef,
    onDragStart,
    onDragEnd,
    onDragOverTrash,
}: NoteProps) {
    const [pos, setPos] = useState({ x: note.x, y: note.y });
    const noteRef = useRef<HTMLDivElement | null>(null);
    const dragStartPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        setPos({ x: note.x, y: note.y });
    }, [note.x, note.y]);

    const { startDrag } = useDrag({
        onMove: (dx, dy) => {
            const maxX = Math.max(0, window.innerWidth - note.width);
            const maxY = Math.max(0, window.innerHeight - TOOLBAR_HEIGHT - note.height);

            const nextX = Math.max(0, Math.min(dragStartPos.current.x + dx, maxX));
            const nextY = Math.max(0, Math.min(dragStartPos.current.y + dy, maxY));

            setPos({ x: nextX, y: nextY });

            const isOver = isOverlapping(noteRef.current, trashRef.current);
            onDragOverTrash(isOver);
        },
        onEnd: (dx, dy) => {
            onDragEnd();
            onDragOverTrash(false);

            if (isOverlapping(noteRef.current, trashRef.current)) {
                onRemove(note.id);
            } else {
                const maxX = Math.max(0, window.innerWidth - note.width);
                const maxY = Math.max(0, window.innerHeight - TOOLBAR_HEIGHT - note.height);

                const finalX = Math.max(0, Math.min(dragStartPos.current.x + dx, maxX));
                const finalY = Math.max(0, Math.min(dragStartPos.current.y + dy, maxY));

                onUpdate(note.id, { x: finalX, y: finalY });
            }
        },
    });

    const { startResize } = useResize({
        onResize: (width, height) => {
            const maxSize = clampNoteSize(
                { ...note, width, height },
                window.innerWidth,
                window.innerHeight
            );

            onUpdate(note.id, {
                width: Math.min(width, maxSize.width),
                height: Math.min(height, maxSize.height),
            });
        },
    });

    const handleHeaderMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;

        dragStartPos.current = { ...pos };
        onBringToFront(note.id);
        onDragStart();
        startDrag(e);
    };

    const handleResizeMouseDown = (e: React.MouseEvent) => {
        onBringToFront(note.id);
        startResize(e, { width: note.width, height: note.height });
    };

    return (
        <div
            ref={noteRef}
            className="note"
            style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                width: note.width,
                height: note.height,
                backgroundColor: note.color,
                zIndex: note.zIndex,
            }}
            onMouseDown={() => onBringToFront(note.id)}
        >
            <div
                className="note__header"
                onMouseDown={handleHeaderMouseDown}
            >
                <div className="note__colors">
                    {colors.map((c) => (
                        <button
                            key={c}
                            className="note__color-swatch"
                            style={{ backgroundColor: c }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onUpdate(note.id, { color: c });
                            }}
                            aria-label={`Color ${c}`}
                            title={`Color ${c}`}
                        />
                    ))}
                </div>
            </div>

            <textarea
                className="note__body"
                value={note.text}
                onChange={(e) => onUpdate(note.id, { text: e.target.value })}
                placeholder="Type your note…"
                onMouseDown={(e) => e.stopPropagation()}
                aria-label="Note text"
            />

            <div
                className="note__resize-handle"
                onMouseDown={handleResizeMouseDown}
            />
        </div>
    );
}