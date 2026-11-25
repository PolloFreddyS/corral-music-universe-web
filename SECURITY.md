# Security policy

This repository builds a **static** website: no server, no database, no user accounts, no forms and no analytics.

## Reporting a vulnerability

Please report security issues **privately** using GitHub's **Security → Report a vulnerability** button on this repository. Do not open a public issue.

Please include the affected URL or file and the steps to reproduce. We aim to acknowledge reports within 7 days.

## Scope

- The published site and the build and deploy workflows in `.github/workflows/`.
- Out of scope: third-party platforms that the site links to (Spotify, Apple Music, YouTube).

## Hardening already in place

- Strict, hash-based Content-Security-Policy. The only third-party frame is the Spotify player, which loads only when a visitor clicks it.
- All external links use `rel="noopener noreferrer"`. Nothing in the site depends on third-party scripts, fonts or trackers.
- Dependencies are audited (`npm audit` → 0 known vulnerabilities at publication). GitHub Actions are pinned to commit SHAs.
- Credentials exist only as GitHub Actions secrets. They are used solely by the scheduled release-sync job, never on pull requests.
