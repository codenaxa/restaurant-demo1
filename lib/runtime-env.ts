import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

function parseEnvContent(content: string) {
  const values: Record<string, string> = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value.replace(/\\n/g, "\n");
  }

  return values;
}

async function readEnvFile(filename: string) {
  try {
    const content = await readFile(path.join(process.cwd(), filename), "utf8");
    return parseEnvContent(content);
  } catch {
    return {};
  }
}

export async function getRuntimeEnvValue(keys: string[], fallback?: string) {
  const [baseEnv, localEnv] = await Promise.all([
    readEnvFile(".env"),
    readEnvFile(".env.local")
  ]);

  const mergedValues = {
    ...baseEnv,
    ...localEnv
  };

  for (const key of keys) {
    const runtimeValue = mergedValues[key];

    if (typeof runtimeValue === "string" && runtimeValue.trim().length > 0) {
      return runtimeValue.trim();
    }

    const processValue = process.env[key];

    if (typeof processValue === "string" && processValue.trim().length > 0) {
      return processValue.trim();
    }
  }

  return fallback;
}
