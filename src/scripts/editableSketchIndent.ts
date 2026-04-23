export const EDITABLE_SKETCH_SPACE_TOKEN = "__P5JS_EDITABLE_SKETCH_SPACE__";
export const EDITABLE_SKETCH_TAB_TOKEN = "__P5JS_EDITABLE_SKETCH_TAB__";

const LEADING_INDENT_PATTERN = /^[ \t]+/gm;

const encodeIndentation = (indentation: string): string =>
  indentation
    .split("")
    .map((character) =>
      character === "\t"
        ? EDITABLE_SKETCH_TAB_TOKEN
        : EDITABLE_SKETCH_SPACE_TOKEN,
    )
    .join("");

export const encodeEditableSketchCode = (code: string): string =>
  code.replace(LEADING_INDENT_PATTERN, encodeIndentation);

export const decodeEditableSketchCode = (code: string): string =>
  code
    .replaceAll(EDITABLE_SKETCH_TAB_TOKEN, "\t")
    .replaceAll(EDITABLE_SKETCH_SPACE_TOKEN, " ");

export const normalizeEditableSketchCode = (code: string): string =>
  decodeEditableSketchCode(code)
    .replace(/^\r?\n/, "")
    .replace(/\r?\n[ \t]*$/, "");
