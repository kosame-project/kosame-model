import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

export const SKILL_NAME = "kosame";

/** The line that points an agent at the installed skill (for CLAUDE.md / AGENTS.md). */
export const POINTER_LINE =
  "This project uses Kosame (the `kosame` npm package). Read `.claude/skills/kosame/SKILL.md` before writing or changing Kosame code.";

export interface InstallResult {
  target: string;
  updated: boolean;
}

/** Copy the skill shipped in the package into `<projectDir>/.claude/skills/kosame`. */
export function installSkill(options: { packageRoot: string; projectDir: string }): InstallResult {
  const source = join(options.packageRoot, "skills", SKILL_NAME);
  if (!existsSync(join(source, "SKILL.md"))) {
    throw new Error(`The skill was not found in the package (expected ${source}).`);
  }
  const target = join(resolve(options.projectDir), ".claude", "skills", SKILL_NAME);
  const updated = existsSync(target);
  if (updated) rmSync(target, { recursive: true, force: true });
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
  return { target, updated };
}

/** Append the pointer line to a markdown file unless it is already there. Returns true if it wrote. */
export function addPointer(file: string): boolean {
  const current = existsSync(file) ? readFileSync(file, "utf8") : "";
  if (current.includes(POINTER_LINE)) return false;
  const separator = current === "" || current.endsWith("\n\n") ? "" : current.endsWith("\n") ? "\n" : "\n\n";
  writeFileSync(file, `${current}${separator}${POINTER_LINE}\n`);
  return true;
}
