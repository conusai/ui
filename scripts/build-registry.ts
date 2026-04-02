#!/usr/bin/env bun

/**
 * build-registry.ts
 *
 * Validates the hand-authored registry/registry.json against the actual source
 * files in src/, and prints a diff if any registered files are missing.
 *
 * In CI, exit code 1 means the registry is out of sync.
 *
 * Usage:
 *   bun run scripts/build-registry.ts
 *   bun run scripts/build-registry.ts --validate-only
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY_PATH = join(ROOT, "registry/registry.json");
const SRC_DIR = join(ROOT, "src");

interface RegistryFile {
  path: string;
  type: string;
}

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
}

interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

function readRegistry(): Registry {
  return JSON.parse(readFileSync(REGISTRY_PATH, "utf-8")) as Registry;
}

function validateRegistry(registry: Registry): boolean {
  let valid = true;

  for (const item of registry.items) {
    for (const file of item.files) {
      const sourcePath = join(SRC_DIR, file.path);
      if (!existsSync(sourcePath)) {
        console.error(`✗ [${item.name}] File not found: src/${file.path}`);
        valid = false;
      }
    }
  }

  return valid;
}

function sortRegistry(registry: Registry): Registry {
  return {
    ...registry,
    items: [...registry.items].sort((a, b) => a.name.localeCompare(b.name)),
  };
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      "validate-only": { type: "boolean", default: false },
      sort: { type: "boolean", default: false },
    },
    allowPositionals: false,
  });

  const registry = readRegistry();

  // Validate that all registered files exist in src/
  console.log(
    `Validating registry (${registry.items.length} items, ${registry.items.reduce(
      (acc, i) => acc + i.files.length,
      0
    )} files)...`
  );

  const valid = validateRegistry(registry);

  if (!valid) {
    console.error(
      "\n❌ Registry is out of sync. Update registry/registry.json to match src/."
    );
    process.exit(1);
  }

  console.log("✅ All registry files exist in src/");

  // Optionally sort and write back
  if (values.sort) {
    const sorted = sortRegistry(registry);
    writeFileSync(
      REGISTRY_PATH,
      JSON.stringify(sorted, null, 2) + "\n",
      "utf-8"
    );
    console.log("✅ registry.json sorted alphabetically");
  }

  if (!values["validate-only"]) {
    // Future: generate registry from source metadata
    console.log(
      "\nℹ To regenerate from source, implement the auto-scan logic in this script."
    );
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
