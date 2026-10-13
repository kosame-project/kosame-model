#!/usr/bin/env node
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { addPointer, installSkill, POINTER_LINE } from "./skills.js";

const HELP = `kosame — command line helpers

Usage:
  kosame skills install [--dir <project>] [--claude-md]

  Copies the Kosame skill into <project>/.claude/skills/kosame so coding agents
  (e.g. Claude Code) can read it. Run it again after upgrading kosame to update it.

Options:
  --dir <project>   Project directory (default: the current directory)
  --claude-md       Also add a line to CLAUDE.md that points to the skill
  -h, --help        Show this help
`;

function main(argv: string[]): number {
  const args = argv.slice(2);
  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    process.stdout.write(HELP);
    return args.length === 0 ? 1 : 0;
  }
  if (args[0] !== "skills" || args[1] !== "install") {
    process.stderr.write(`Unknown command: ${args.slice(0, 2).join(" ")}\n\n${HELP}`);
    return 1;
  }

  let projectDir = process.cwd();
  let claudeMd = false;
  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dir") {
      const value = args[++i];
      if (!value) {
        process.stderr.write("--dir needs a path\n");
        return 1;
      }
      projectDir = resolve(value);
    } else if (arg === "--claude-md") {
      claudeMd = true;
    } else {
      process.stderr.write(`Unknown option: ${arg}\n\n${HELP}`);
      return 1;
    }
  }

  // dist/cli/index.js -> the package root is two levels up.
  const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
  try {
    const { target, updated } = installSkill({ packageRoot, projectDir });
    process.stdout.write(`${updated ? "Updated" : "Installed"} the Kosame skill: ${target}\n`);
    if (claudeMd) {
      const file = join(projectDir, "CLAUDE.md");
      const wrote = addPointer(file);
      process.stdout.write(wrote ? `Added a pointer to ${file}\n` : `${file} already points to the skill\n`);
    } else {
      process.stdout.write(
        `\nTo make agents read it every time, add this line to CLAUDE.md or AGENTS.md (or rerun with --claude-md):\n  ${POINTER_LINE}\n`,
      );
    }
    return 0;
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 1;
  }
}

process.exit(main(process.argv));
