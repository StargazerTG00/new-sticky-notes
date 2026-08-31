# Sticky Notes App — Technical Documentation

A lightweight sticky notes app built with Next.js and React, with no external UI libraries. Notes are created, moved, resized, recolored, and deleted, and the information is persisted in localstorage.

---

## Tech Stack

- **Next.js** — Typescript development.
- **ReactJS** — No external component libraries used.
- **Pure CSS** — Native CSS used for styling.

---

## How to run?

- Execute `npm run dev` to start the development server.
- Open `http://localhost:3000` in your browser.

---

## Architecture

The app is split into three layers:

### Types

`app/types/index.ts` defines the `NoteModel` shape — id, position (x, y), size (width, height), color, text content, and z-index.

### Hooks

`app/hooks/` contains the core logic:

- **`useNotes`**:  Manages the notes array and syncs it to localStorage (persisting and loading information).
- **`useDrag`**:  Handles drag gestures by attaching `mousemove` and `mouseup` listeners directly on the document, reporting changes or variations from the initial mouse position.
- **`useResize`**:  Same approach for resizing from the bottom-right corner handle only.

### Components

`app/components/` handles the UI:

- **`Canvas`**:  Main container. Renders the toolbar, all notes, and the trash zone. Also adjust the note positions when the window is resized so nothing ends up off-screen.
- **`Note`**:  Keeps its own local position state for smooth dragging, and only calls back to `Canvas` once the drag ends to persist the final position. It deletes the note if its over the trash zone.
- **`Toolbar`**:  Contains the button to add a new note.
- **`TrashZone`**:  Appears at the bottom of the screen during a drag and highlights when a note is dragged over it. Its hidden when theres no active dragging.

---

## Features

- Add notes via the toolbar button or by double-clicking the canvas.
- Move notes by dragging their header.
- Resize notes from the bottom-right corner handle.
- Change note color from the color buttons in the header.
- Delete a note by dragging it onto the trash zone.
- All note data (position, size, color, text) is persisted in `localStorage`.
- Notes and resize handles are limited to the current window view. On window resize, `Canvas` adjust all note positions to fit the new dimensions and it will be limited at the borders of the screen if trying to move it outside the current view.
