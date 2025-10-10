# art.vault-fetch

Fetch your artifact from [Art.Vault](https://t.me/artifact_vault_bot) — a lightweight temporary storage for CI/CD
artifacts built on Telegram.

## Inputs

| Name            | Description                                        | Required |
|-----------------|----------------------------------------------------|----------|
| `vault-secret`  | Secret token for your Vault channel                | Yes      |
| `project-name`  | Name of your project (used for grouping artifacts) | Yes      |
| `artifact-name` | Name of the artifact to download                   | Yes      |
| `output-path`   | Directory path where to save the downloaded file   | Yes      |

## Example usage

```yaml
- name: Fetch artifact from Art.Vault
  uses: zerdicorp/art.vault-fetch@v1
  with:
    vault-secret: ${{ secrets.ART_VAULT_SECRET }}
    project-name: my-service
    artifact-name: main-build.zip
    output-path: .
```