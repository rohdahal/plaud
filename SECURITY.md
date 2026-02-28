# Security policy

This project is an **unofficial** CLI for Plaud. It works by capturing a Plaud bearer token from an authenticated browser session and calling private endpoints.

## Reporting a security issue

Please **do not** open a public issue containing secrets.

If you find a security issue (token leakage, unsafe file permissions, etc.), report it privately to the maintainer.

## Never share secrets

Do not paste any of the following into issues, PRs, logs, or screenshots:

- Plaud auth tokens (`Authorization: Bearer …`, typically JWTs starting with `eyJ`)
- HAR files (`*.har`, `*.har.gz`) — these often contain auth headers
- Signed file URLs returned by Plaud (may embed temporary credentials)

## Local storage

By default the CLI stores the token at `~/.config/plaud/config.json` with file mode `0600`.

If you don’t want local storage, use the `PLAUD_AUTH_TOKEN` environment variable instead.
