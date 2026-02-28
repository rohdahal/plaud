# Contributing

Thanks for your interest. This is a small, agent-first CLI and we try to keep it simple and robust.

## Principles

- **No secret leakage**: never include tokens, HAR files, or signed URLs in issues/PRs.
- **Stable JSON contract**: keep `--json` output compatible with `docs/CONTRACT_V1.md`.
- **Agent-first UX**: stdout should be machine-friendly; progress/logs go to stderr.
- **Minimal deps**: prefer standard library; add dependencies only when they clearly improve correctness or maintainability.

## Development

Requirements:
- Node.js 22+

Commands:

```bash
npm install
npm test
```

## Submitting changes

- Keep PRs small and focused.
- Add or update tests when behavior changes.
- Update `README.md` and/or `docs/CONTRACT_V1.md` if you change CLI surface or JSON output.
