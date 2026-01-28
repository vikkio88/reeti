import { describe, expect, test } from "bun:test";
import { FRONT_MATTER_DELIMITER } from "./const";
import { parseDocument } from "./frontmatter";

describe("parseDocument", () => {
  test("parses document with valid frontmatter and body", () => {
    const raw = `${FRONT_MATTER_DELIMITER}
title: My Note
${FRONT_MATTER_DELIMITER}
This is the body content.`;

    const result = parseDocument(raw);
    expect(result).toEqual({
      frontmatter: { title: "My Note" },
      body: "This is the body content.",
    });
  });

  test("handles missing frontmatter", () => {
    const raw = "Just a plain markdown file.";
    const result = parseDocument(raw);
    expect(result).toEqual({
      frontmatter: {},
      body: "Just a plain markdown file.",
    });
  });

  test("handles empty frontmatter block", () => {
    const raw = `${FRONT_MATTER_DELIMITER}
${FRONT_MATTER_DELIMITER}
Body after empty frontmatter.`;
    const result = parseDocument(raw);
    expect(result.frontmatter).toEqual({});
    expect(result.body).toBe("Body after empty frontmatter.");
  });

  test("preserves delimiters inside the body", () => {
    const raw = `${FRONT_MATTER_DELIMITER}
title: Delimiter Test
${FRONT_MATTER_DELIMITER}
Top section.
${FRONT_MATTER_DELIMITER}
Bottom section.`;
    const result = parseDocument(raw);
    expect(result.body).toBe(
      `Top section.\n${FRONT_MATTER_DELIMITER}\nBottom section.`,
    );
  });

  test("parses multiple keys in frontmatter", () => {
    const raw = `${FRONT_MATTER_DELIMITER}
title: Reeti
tags: sicilian, tauri
${FRONT_MATTER_DELIMITER}
Content`;
    const result = parseDocument(raw);
    expect(result.frontmatter).toEqual({
      title: "Reeti",
      tags: ["sicilian", "tauri"],
    } as any);
  });

  test("handles values with colons correctly", () => {
    const raw = `${FRONT_MATTER_DELIMITER}
title: Project: Katinazzu
${FRONT_MATTER_DELIMITER}
Body`;
    const result = parseDocument(raw);
    expect(result.frontmatter.title).toBe("Project: Katinazzu");
  });

  test("trims whitespace from keys and values", () => {
    const raw = `${FRONT_MATTER_DELIMITER}
   title   :    Spaced Title
${FRONT_MATTER_DELIMITER}
Body`;
    const result = parseDocument(raw);
    expect(result.frontmatter.title).toBe("Spaced Title");
  });

  test("handles malformed frontmatter line", () => {
    const raw = `${FRONT_MATTER_DELIMITER}
this has no colon
title: Correct
${FRONT_MATTER_DELIMITER}
Body`;
    const result = parseDocument(raw);
    expect(result.frontmatter).toEqual({ title: "Correct" });
  });

  test("returns empty body if document only contains frontmatter", () => {
    const raw = `${FRONT_MATTER_DELIMITER}
title: Only Frontmatter
${FRONT_MATTER_DELIMITER}`;
    const result = parseDocument(raw);
    expect(result.frontmatter.title).toBe("Only Frontmatter");
    expect(result.body).toBe("");
  });

  test("ignores delimiters if they don't start at the beginning of the file", () => {
    const raw = `# Title
  Some text
  ${FRONT_MATTER_DELIMITER}
  More text`;

    const result = parseDocument(raw);
    expect(result.frontmatter).toEqual({});
    expect(result.body).toContain(FRONT_MATTER_DELIMITER);
  });

  test("parseYml handles boolean and numeric values", () => {
    const input = `${FRONT_MATTER_DELIMITER}
  append: true
  count: 42
  title: Katinazzu
  ${FRONT_MATTER_DELIMITER}
  Body`;

    const result = parseDocument(input);
    expect(result.frontmatter).toEqual({
      append: true,
      count: 42,
      title: "Katinazzu",
    } as any);
  });

  test("parseYml handles keys with empty values", () => {
    const input = `${FRONT_MATTER_DELIMITER}
  title:
  description: valid
  ${FRONT_MATTER_DELIMITER}
  Body`;

    const result = parseDocument(input);
    expect(result.frontmatter.description).toBe("valid");
    expect(result.frontmatter.title).toBe("");
  });
});
