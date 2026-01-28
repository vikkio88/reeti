import { describe, expect, test } from "bun:test";
import { parseYml } from "./yaml";

describe("parseYml", () => {
  test("parses standard key-value pairs", () => {
    const input = `title: Reeti\nauthor: Dev`;
    expect(parseYml(input)).toEqual({
      title: "Reeti",
      author: "Dev",
    } as any);
  });

  test("handles values with colons (like URLs or file paths)", () => {
    const input = `to: <%- folder %>/<%= Name %>.svelte\nurl: https://getreeti.com`;
    const result = parseYml(input) as any;
    expect(result.to).toBe("<%- folder %>/<%= Name %>.svelte");
    expect(result.url).toBe("https://getreeti.com");
  });

  test("converts boolean strings to actual booleans", () => {
    const input = `append: true\npublished: false`;
    const result = parseYml(input) as any;
    expect(result.append).toBe(true);
    expect(result.published).toBe(false);
  });

  test("converts numeric strings to numbers", () => {
    const input = `x: 100\ny: -25.5\nversion: 1.0.0`;
    const result = parseYml(input) as any;
    expect(result.x).toBe(100);
    expect(result.y).toBe(-25.5);
    expect(result.version).toBe("1.0.0");
  });

  test("handles empty values and whitespace", () => {
    const input = `  key  :   value  \nempty:`;
    const result = parseYml(input) as any;
    expect(result.key).toBe("value");
    expect(result.empty).toBe("");
  });

  test("ignores lines without a colon", () => {
    const input = `just a random line\ntitle: Correct`;
    expect(parseYml(input)).toEqual({ title: "Correct" } as any);
  });
  describe("parseYml - Array Support", () => {
    test("parses array of strings (tags)", () => {
      const input = `tags: sicilian, tauri, svelte`;
      const result = parseYml(input);
      expect(result.tags).toEqual(["sicilian", "tauri", "svelte"]);
    });

    test("parses array of numbers", () => {
      const input = `coords: 10, 20, 30.5`;
      const result = parseYml(input);
      expect(result.coords).toEqual([10, 20, 30.5]);
    });

    test("parses array of booleans", () => {
      const input = `flags: true, false, true`;
      const result = parseYml(input);
      expect(result.flags).toEqual([true, false, true]);
    });

    test("handles mixed arrays (as strings)", () => {
      const input = `mixed: true, 42, reeti`;
      const result = parseYml(input);
      expect(result.mixed).toEqual([true, 42, "reeti"]);
    });

    test("handles single value with trailing comma as array", () => {
      const input = `list: item,`;
      const result = parseYml(input);
      // filter(Boolean) could be added to parser if you want to skip trailing commas
      expect(result.list).toEqual(["item", ""]);
    });
  });
});
