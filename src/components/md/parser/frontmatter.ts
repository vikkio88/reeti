import { FRONT_MATTER_DELIMITER } from "./const";
import { parseYml } from "./yaml";

export type Primitive = string | number | boolean;
export type Frontmatter = {
  title?: string;

  //TODO: add UP DOWN LEFT RIGHT
  [key: string]: Primitive | Primitive[] | undefined;
};

export type Document = {
  frontmatter: Frontmatter;
  body: string;
};

export function parseDocument(raw: string): Document {
  const trimmedRaw = raw.trim();
  if (!trimmedRaw.startsWith(FRONT_MATTER_DELIMITER)) {
    return {
      frontmatter: {},
      body: trimmedRaw,
    };
  }
  const parts = trimmedRaw.split(FRONT_MATTER_DELIMITER);
  if (parts.length < 3) {
    return {
      frontmatter: {},
      body: raw.trim(),
    };
  }

  const rawFrontmatter = parts[1].trim();
  const body = parts.slice(2).join(FRONT_MATTER_DELIMITER).trim();

  const frontmatter = parseYml(rawFrontmatter);

  return {
    frontmatter,
    body,
  };
}
