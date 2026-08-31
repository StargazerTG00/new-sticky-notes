"use client";

import React from "react";

interface ToolbarProps {
    onAddNote: () => void;
}

export default function Toolbar({ onAddNote }: ToolbarProps) {
    return (
        <header className="toolbar">
            <button className="toolbar__button" onClick={onAddNote}>
                + New note
            </button>
        </header>
    );
}