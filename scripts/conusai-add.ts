#!/usr/bin/env node

/**
 * conusai-add — Download ConusAI UI components from GitHub into your project.
 *
 * Usage:
 *   bunx conusai-add <component...> [options]
 *   bunx conusai-add --list
 *   bunx conusai-add --all
 *
 * Options:
 *   --repo <owner/repo>   GitHub repository (default: conusai/conusai-ui)
 *   --branch <branch>     Git branch (default: main)
 *   --dir <path>          Target directory (default: src)
 *   --list                List available components
 *   --all                 Install all components
 *   --overwrite           Overwrite existing files
 *   --dry-run             Show what would be installed without writing
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parseArgs } from "node:util";

// --- Types ---

interface RegistryFile {
  path: string;
  type: string;
}

interface RegistryItem {
  name: string;
  type: "registry:ui" | "registry:hook" | "registry:lib";
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
}

interface Registry {
  name: string;
  homepage: string;
  items: RegistryItem[];
}

// --- Config ---

const DEFAULT_REPO = "conusai/conusai-ui";
const DEFAULT_BRANCH = "main";
const DEFAULT_DIR = "src";
const REGISTRY_PATH = "registry/registry.json";

// --- Helpers ---

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

function rawURL(repo: string, branch: string, path: string): string {
  return `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;
}

function resolveDeps(
  items: RegistryItem[],
  names: string[],
  resolved = new Set<string>()
): RegistryItem[] {
  for (const name of names) {
    if (resolved.has(name)) continue;
    const item = items.find((i) => i.name === name);
    if (!item) {
      console.warn(`⚠ Unknown component: ${name} — skipping`);
      continue;
    }
    resolved.add(name);
    // Recursively resolve registry dependencies that are also conusai components
    const conusaiDeps = item.registryDependencies.filter((d) =>
      items.some((i) => i.name === d)
    );
    if (conusaiDeps.length > 0) {
      resolveDeps(items, conusaiDeps, resolved);
    }
  }
  return items.filter((i) => resolved.has(i.name));
}

// --- Main ---

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      repo: { type: "string", default: DEFAULT_REPO },
      branch: { type: "string", default: DEFAULT_BRANCH },
      dir: { type: "string", default: DEFAULT_DIR },
      list: { type: "boolean", default: false },
      all: { type: "boolean", default: false },
      overwrite: { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
    },
    allowPositionals: true,
  });

  const repo = values.repo!;
  const branch = values.branch!;
  const targetDir = resolve(values.dir!);
  const dryRun = values["dry-run"]!;

  // 1. Fetch registry
  const registryURL = rawURL(repo, branch, REGISTRY_PATH);
  console.log(`Fetching registry from ${repo}@${branch}...`);
  const registry = await fetchJSON<Registry>(registryURL);

  // 2. List mode
  if (values.list) {
    console.log(`\nAvailable components (${registry.items.length}):\n`);
    const maxNameLen = Math.max(...registry.items.map((i) => i.name.length));
    for (const item of registry.items) {
      const deps =
        item.dependencies.length > 0
          ? ` [deps: ${item.dependencies.join(", ")}]`
          : "";
      console.log(
        `  ${item.name.padEnd(maxNameLen + 2)} ${item.description}${deps}`
      );
    }
    return;
  }

  // 3. Resolve components to install
  const names = values.all ? registry.items.map((i) => i.name) : positionals;

  if (names.length === 0) {
    console.error(
      "Usage: conusai-add <component...> | --list | --all\n" +
        "       Run with --list to see available components."
    );
    process.exit(1);
  }

  const toInstall = resolveDeps(registry.items, names);

  if (toInstall.length === 0) {
    console.error(
      "No matching components found. Run with --list to see options."
    );
    process.exit(1);
  }

  if (dryRun) {
    console.log("\n[dry-run] No files will be written.\n");
  }

  console.log(`Installing ${toInstall.length} component(s):\n`);

  // 4. Download and write files
  const allDeps = new Set<string>();
  let filesWritten = 0;

  for (const item of toInstall) {
    console.log(`  📦 ${item.title} (${item.name})`);
    for (const dep of item.dependencies) allDeps.add(dep);

    for (const file of item.files) {
      const sourcePath = `src/${file.path}`;
      const targetPath = join(targetDir, file.path);

      if (existsSync(targetPath) && !values.overwrite) {
        console.log(
          `     ⏭  ${file.path} (exists — use --overwrite to replace)`
        );
        continue;
      }

      if (dryRun) {
        console.log(`     →  ${file.path}`);
        filesWritten++;
        continue;
      }

      const content = await fetchText(rawURL(repo, branch, sourcePath));
      mkdirSync(dirname(targetPath), { recursive: true });
      writeFileSync(targetPath, content, "utf-8");
      console.log(`     ✓  ${file.path}`);
      filesWritten++;
    }
  }

  // 5. Summary
  const verb = dryRun ? "would be installed" : "installed";
  console.log(`\n✅ ${filesWritten} file(s) ${verb} to ${targetDir}\n`);

  if (allDeps.size > 0) {
    const depList = [...allDeps].sort().join(" ");
    console.log("📎 Install peer dependencies:");
    console.log(`   bun add ${depList}`);
    console.log(`   # or: npm install ${depList}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
