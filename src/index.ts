import { getInput, setFailed, info } from "@actions/core";
const fetch = require("node-fetch");
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";

export async function run() {
  try {
    const vaultSecret = getInput("vault-secret");
    const projectName = getInput("project-name");
    const artifactName = getInput("artifact-name");
    const outputPath = getInput("output-path");

    if (!vaultSecret) {
      throw new Error("vault-secret is required");
    }
    if (!projectName) {
      throw new Error("project-name is required");
    }
    if (!artifactName) {
      throw new Error("artifact-name is required");
    }
    if (!outputPath) {
      throw new Error("output-path is required");
    }

    if (!existsSync(outputPath)) {
      mkdirSync(outputPath, { recursive: true });
    }

    const filePath = join(outputPath, artifactName);

    info(`[Art.Vault]: Fetching artifact '${projectName}/${artifactName}'`);

    const url = `https://art-vault.nanikin.ru/${projectName}/${artifactName}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Vault-Secret": vaultSecret
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[Art.Vault]: Fetch failed: ${errorText}`);
    }

    const fileStream = createWriteStream(filePath);
    response.body.pipe(fileStream);

    return new Promise((resolve, reject) => {
      fileStream.on('finish', () => {
        info(`[Art.Vault]: File downloaded successfully to '${filePath}'`);
        resolve(void 0);
      });

      fileStream.on('error', (error: Error) => {
        reject(new Error(`[Art.Vault]: Failed to save file: ${error.message}`));
      });

      response.body.on('error', (error: Error) => {
        reject(new Error(`[Art.Vault]: Failed to download file: ${error.message}`));
      });
    });

  } catch (error: unknown) {
    setFailed((error as Error)?.message ?? "Unknown error");
  }
}

if (!process.env.JEST_WORKER_ID) {
  run();
}
