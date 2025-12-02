// ViewId enumerates all valid “pages” in the app.
//
// Using a string union instead of plain strings gives us type-safety:
// - Components like AppLayout or App can only navigate to these values.
// - If we add or rename a route, TypeScript will surface all affected places.
export type ViewId = "dashboard" | "information" | "accessibility" | "imprint";
