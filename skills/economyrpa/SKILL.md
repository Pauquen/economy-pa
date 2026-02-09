---
name: economyrpa
description: >
  Main entry point for economyrpa development - quick reference for all components.
  Trigger: General economyrpa development questions, project overview, component navigation (NOT PR CI gates or GitHub Actions workflows).
license: Apache-2.0
metadata:
  scope: [root]
  auto_invoke: "General economyrpa development questions"
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch, Task
---

## Components

| Component | Stack | Location |
|-----------|-------|----------|
| SDK | Python 3.9+, Poetry | `economyrpa/` |
| API | Django 5.1, DRF, Celery | `api/` |
| UI | Typescript, Angular 20, SCSS | `ui/` |

## Quick Commands

```bash
# SDK
# poetry install --with dev
# poetry run python economyrpa-cli.py aws --check check_name
# poetry run pytest tests/

# API
cd api && poetry run python src/backend/manage.py runserver
cd api && poetry run pytest

# UI
cd ui && pnpm run dev
cd ui && pnpm run healthcheck

# MCP
cd mcp_server && uv run economyrpa-mcp

# Full Stack
docker-compose up -d
```

## Related Skills

<!-- `economyrpa-sdk-check` - Create security checks -->
- `economyrpa-api` - Django/DRF patterns
- `economyrpa-ui` - Next.js/React patterns
- `economyrpa-mcp` - MCP server tools
- `economyrpa-test` - Testing patterns

## Resources

- **Documentation**: See [references/](references/) for links to local developer guide
