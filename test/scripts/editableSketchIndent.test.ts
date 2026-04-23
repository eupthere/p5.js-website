import { expect, test } from "vitest";
import {
  EDITABLE_SKETCH_SPACE_TOKEN,
  encodeEditableSketchCode,
  normalizeEditableSketchCode,
} from "../../src/scripts/editableSketchIndent";
import viteEditableSketchIndent from "../../src/scripts/viteEditableSketchIndent";

test("encodeEditableSketchCode preserves leading indentation through normalization", () => {
  const source = "\n  function setup() {\n    createCanvas(100, 100);\n  }\n";

  const encoded = encodeEditableSketchCode(source);

  expect(encoded).toContain(EDITABLE_SKETCH_SPACE_TOKEN);
  expect(normalizeEditableSketchCode(encoded)).toBe(
    "  function setup() {\n    createCanvas(100, 100);\n  }",
  );
});

test("viteEditableSketchIndent rewrites only EditableSketch code props in mdx files", async () => {
  const plugin = viteEditableSketchIndent();
  const transform =
    typeof plugin.transform === "function"
      ? plugin.transform
      : plugin.transform?.handler;
  const source = `<EditableSketch code={\`\n  function setup() {\n    createCanvas(100, 100);\n  }\n\`} />\n\n\
<OtherComponent code={\`\n  keep me untouched\n\`} />`;

  expect(transform).toBeDefined();

  const runTransform = transform as (
    code: string,
    id: string,
  ) =>
    | Promise<{ code: string } | string | null>
    | { code: string }
    | string
    | null;
  const result = await runTransform(source, "/virtual/tutorial.mdx");

  expect(result).not.toBeNull();
  const transformedCode =
    typeof result === "string" ? result : (result?.code ?? "");
  expect(transformedCode).toContain(EDITABLE_SKETCH_SPACE_TOKEN);
  expect(transformedCode).toContain(
    "<OtherComponent code={`\n  keep me untouched\n`} />",
  );
});
