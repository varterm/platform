# Releasing Varterm

This project publishes extension artifacts through GitHub Releases.

## Versioning

- Use semantic version tags (`v1.0.0`, `v1.1.0`, etc.).
- Update `CHANGELOG.md` before tagging.

## Create a release

1. Ensure `main` is green in CI.
2. Create and push a tag:
   - `git tag vX.Y.Z`
   - `git push origin vX.Y.Z`
3. GitHub Actions will:
   - Build Chrome extension zip
   - Build VS Code `.vsix`
   - Publish a GitHub Release with both artifacts

## Manual trigger

You can also run the `Release` workflow from Actions via `workflow_dispatch`.
