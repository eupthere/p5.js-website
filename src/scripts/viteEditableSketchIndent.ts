import type { Plugin } from "vite";
import { encodeEditableSketchCode } from "./editableSketchIndent";

const EDITABLE_SKETCH_CODE_PATTERN =
  /(<EditableSketch\b[\s\S]*?\bcode=\{`)([\s\S]*?)(`\}[\s\S]*?\/\>)/g;

export default function viteEditableSketchIndent(): Plugin {
  return {
    name: "vite-editable-sketch-indent",
    enforce: "pre",
    transform(source, id) {
      if (!id.includes(".mdx")) {
        return null;
      }

      let transformed = false;
      const code = source.replace(
        EDITABLE_SKETCH_CODE_PATTERN,
        (fullMatch, opening, editableSketchCode, closing) => {
          const encodedCode = encodeEditableSketchCode(editableSketchCode);
          if (encodedCode === editableSketchCode) {
            return fullMatch;
          }

          transformed = true;
          return `${opening}${encodedCode}${closing}`;
        },
      );

      if (!transformed) {
        return null;
      }

      return {
        code,
        map: null,
      };
    },
  };
}
