import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { addPointer, installSkill, POINTER_LINE } from "./skills.js";

let root: string;
let packageRoot: string;
let project: string;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "kosame-cli-"));
  packageRoot = join(root, "pkg");
  project = join(root, "project");
  mkdirSync(join(packageRoot, "skills", "kosame", "references"), { recursive: true });
  writeFileSync(join(packageRoot, "skills", "kosame", "SKILL.md"), "skill v1");
  writeFileSync(join(packageRoot, "skills", "kosame", "references", "a.md"), "ref");
  mkdirSync(project);
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("installSkill", () => {
  test("copies the skill into .claude/skills/kosame", () => {
    const result = installSkill({ packageRoot, projectDir: project });
    expect(result.updated).toBe(false);
    expect(readFileSync(join(project, ".claude/skills/kosame/SKILL.md"), "utf8")).toBe("skill v1");
    expect(readFileSync(join(project, ".claude/skills/kosame/references/a.md"), "utf8")).toBe("ref");
  });

  test("replaces an existing install, dropping files that no longer exist", () => {
    installSkill({ packageRoot, projectDir: project });
    writeFileSync(join(project, ".claude/skills/kosame/stale.md"), "old");
    writeFileSync(join(packageRoot, "skills", "kosame", "SKILL.md"), "skill v2");
    const result = installSkill({ packageRoot, projectDir: project });
    expect(result.updated).toBe(true);
    expect(readFileSync(join(project, ".claude/skills/kosame/SKILL.md"), "utf8")).toBe("skill v2");
    expect(existsSync(join(project, ".claude/skills/kosame/stale.md"))).toBe(false);
  });

  test("fails clearly when the package has no skill", () => {
    rmSync(join(packageRoot, "skills"), { recursive: true });
    expect(() => installSkill({ packageRoot, projectDir: project })).toThrow(/skill was not found/);
  });
});

describe("addPointer", () => {
  test("creates CLAUDE.md with the line", () => {
    const file = join(project, "CLAUDE.md");
    expect(addPointer(file)).toBe(true);
    expect(readFileSync(file, "utf8")).toBe(`${POINTER_LINE}\n`);
  });

  test("appends after existing content and is idempotent", () => {
    const file = join(project, "CLAUDE.md");
    writeFileSync(file, "# Notes\nuse bun\n");
    expect(addPointer(file)).toBe(true);
    expect(addPointer(file)).toBe(false);
    const text = readFileSync(file, "utf8");
    expect(text.startsWith("# Notes\nuse bun\n\n")).toBe(true);
    expect(text.split(POINTER_LINE).length).toBe(2);
  });
});
