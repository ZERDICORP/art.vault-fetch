import { getInput, setFailed, info } from "@actions/core";
const fetch = require("node-fetch");
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join, basename, extname } from "path";
import { execSync } from "child_process";

export async function run() {
  try {
    const vaultSecret = getInput("vault-secret");
    const projectName = getInput("project-name");
    let artifactName = getInput("artifact-name");
    const outputPath = getInput("output-path");
    const autoUnzip = getInput("auto-unzip").toLowerCase() === "true";

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

    // Auto-add .zip extension if auto-unzip is enabled but artifact name doesn't have .zip
    if (autoUnzip && extname(artifactName).toLowerCase() !== '.zip') {
      artifactName += '.zip';
      info(`[Art.Vault]: Auto-unzip enabled, adding .zip extension: '${artifactName}'`);
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
      fileStream.on('finish', async () => {
        info(`[Art.Vault]: File downloaded successfully to '${filePath}'`);

        // Auto-unzip functionality
        if (autoUnzip && extname(artifactName).toLowerCase() === '.zip') {
          try {
            const baseFileName = basename(artifactName, '.zip');
            const extractPath = join(outputPath, baseFileName);

            if (!existsSync(extractPath)) {
              mkdirSync(extractPath, { recursive: true });
            }

            info(`[Art.Vault]: Extracting zip file to '${extractPath}'`);

            execSync(`unzip -o "${filePath}" -d "${extractPath}"`, { stdio: 'inherit' });

            info(`[Art.Vault]: File extracted successfully to '${extractPath}'`);
          } catch (extractError) {
            reject(new Error(`[Art.Vault]: Failed to extract zip file: ${(extractError as Error).message}`));
            return;
          }
        }

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
