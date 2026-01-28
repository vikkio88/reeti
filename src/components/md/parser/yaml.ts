import type { Frontmatter, Primitive } from "./frontmatter";

function cast(val: string): Primitive {
  const v = val.trim();
  const lower = v.toLowerCase();
  if (lower === "true") return true;
  if (lower === "false") return false;
  if (v !== "" && !isNaN(Number(v))) return Number(v);
  return v;
}

export function parseYml(raw: string): Frontmatter {
  const frontmatter: Frontmatter = {};
  const lines = raw.split("\n");

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1).trim();

    if (!key) continue;

    if (rawValue.includes(",")) {
      frontmatter[key] = rawValue.split(",").map((item) => cast(item));
    } else {
      frontmatter[key] = cast(rawValue);
    }
  }

  return frontmatter;
}
