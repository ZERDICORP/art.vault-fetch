# art.vault-fetch

Fetch your artifact from [Art.Vault](https://t.me/artifact_vault_bot) — a lightweight temporary storage for CI/CD
artifacts built on Telegram.

## Inputs

| Name            | Description                                                                | Required |
|-----------------|----------------------------------------------------------------------------|----------|
| `vault-secret`  | Secret token for your Vault channel                                        | Yes      |
| `project-name`  | Name of your project (used for grouping artifacts)                         | Yes      |
| `artifact-name` | Name of the artifact to download                                           | Yes      |
| `output-path`   | Directory path where to save the downloaded file or directory (auto-unzip) | Yes      |
| `auto-unzip`    | Automatically extract zip files                                            | No       |

## Example usage

#### - Basic file download

```yaml
- name: Fetch artifact from Art.Vault
  uses: zerdicorp/art.vault-fetch@v2
  with:
    vault-secret: ${{ secrets.ART_VAULT_SECRET }}
    project-name: my-service
    artifact-name: build.zip
    output-path: ./downloads // will be saved as ./downloads/build.zip
```

#### - Download and auto-extract zip

```yaml
- name: Fetch artifact from Art.Vault
  uses: zerdicorp/art.vault-fetch@v2
  with:
    vault-secret: ${{ secrets.ART_VAULT_SECRET }}
    project-name: my-service
    artifact-name: build.zip // (you can write without .zip extension, just like 'build')
    auto-unzip: true
    output-path: ./downloads // will be extracted to ./downloads/build/
```

<!-- Security scan triggered at 2026-08-31 16:58:42 -->

<!-- Security scan triggered at 2026-08-31 16:44:40 -->

<!-- Security scan triggered at 2026-08-31 18:31:57 -->

<!-- Security scan triggered at 2026-09-02 06:45:07 -->

<!-- Security scan triggered at 2026-09-02 07:07:11 -->