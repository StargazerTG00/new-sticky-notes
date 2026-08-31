"use client";

import React from "react";

interface TrashZoneProps {
    visible: boolean;
    active: boolean;
    trashRef: React.RefObject<HTMLDivElement | null>;
}
export default function TrashZone({
    visible,
    active,
    trashRef,
}: TrashZoneProps) {
    return (
        <div
            ref={trashRef}
            className={`trash-zone ${visible ? "trash-zone--visible" : ""} ${active ? "trash-zone--active" : ""}`}
        >
            <span className="trash-zone__icon">🗑️</span>
            <span className="trash-zone__label">Drag here to delete</span>
        </div>
    );
}