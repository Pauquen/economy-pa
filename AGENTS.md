# Repository Guidelines

## How to Use This Guide

- Start here for cross-project norms. this is a monorepo with several components.
- Each component has an `AGENTS.md` file with specific guidelines (e.g., `api/AGENTS.md`, `ui/AGENTS.md`).
- Component docs override this file when guidance conflicts.

## Available Skills

Use these skills for detailed patterns on-demand:

### Generic Skills (Any Project)
| Skill | Description | URL |
|-------|-------------|-----|
| `typescript` | Const types, flat interfaces, utility types | [SKILL.md](skills/typescript/SKILL.md) |
| `angular-20` | No useMemo/useCallback, React Compiler | [SKILL.md](skills/angular-20/SKILL.md) |
| `scss` | cn() utility, no var() in className | [SKILL.md](skills/scss/SKILL.md) |
| `playwright` | Page Object Model, MCP workflow, selectors | [SKILL.md](skills/playwright/SKILL.md) |
| `pytest` | Fixtures, mocking, markers, parametrize | [SKILL.md](skills/pytest/SKILL.md) |
| `django-drf` | ViewSets, Serializers, Filters | [SKILL.md](skills/django-drf/SKILL.md) |
| `ai-sdk-5` | UIMessage, streaming, LangChain | [SKILL.md](skills/ai-sdk-5/SKILL.md) |

### economyrpa-Specific Skills
| Skill | Description | URL |
|-------|-------------|-----|
| `economyrpa` | Project overview, component navigation | [SKILL.md](skills/economyrpa/SKILL.md) |
| `economyrpa-api` | Django + RLS + JSON:API patterns | [SKILL.md](skills/economyrpa-api/SKILL.md) |
| `economyrpa-ui` | Next.js + shadcn conventions | [SKILL.md](skills/economyrpa-ui/SKILL.md) |
| `economyrpa-mcp` | MCP server tools and models | [SKILL.md](skills/economyrpa-mcp/SKILL.md) |
| `economyrpa-test-sdk` | SDK testing (pytest + moto) | [SKILL.md](skills/economyrpa-test-sdk/SKILL.md) |
| `economyrpa-test-api` | API testing (pytest-django + RLS) | [SKILL.md](skills/economyrpa-test-api/SKILL.md) |
| `economyrpa-test-ui` | E2E testing (Playwright) | [SKILL.md](skills/economyrpa-test-ui/SKILL.md) |
| `economyrpa-compliance` | Compliance framework structure | [SKILL.md](skills/economyrpa-compliance/SKILL.md) |
| `economyrpa-compliance-review` | Review compliance framework PRs | [SKILL.md](skills/economyrpa-compliance-review/SKILL.md) |
| `economyrpa-changelog` | Changelog entries (keepachangelog.com) | [SKILL.md](skills/economyrpa-changelog/SKILL.md) |
| `economyrpa-docs` | Documentation style guide | [SKILL.md](skills/economyrpa-docs/SKILL.md) |
| `skill-creator` | Create new AI agent skills | [SKILL.md](skills/skill-creator/SKILL.md) |

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| Add changelog entry for a PR or feature | `economyrpa-changelog` |
| After creating/modifying a skill | `skill-sync` |
| Building AI chat features | `ai-sdk-5` |
| Create PR that requires changelog entry | `economyrpa-changelog` |
| Creating new skills | `skill-creator` |
| Creating/modifying economyrpa UI components | `economyrpa-ui` |
| Creating/modifying models, views, serializers | `economyrpa-api` |
| Creating/updating compliance frameworks | `economyrpa-compliance` |
| General economyrpa development questions | `economyrpa` |
| Generic DRF patterns | `django-drf` |
| Mapping checks to compliance controls | `economyrpa-compliance` |
| Mocking AWS with moto in tests | `economyrpa-test-sdk` |
| Regenerate AGENTS.md Auto-invoke tables (sync.sh) | `skill-sync` |
| Review changelog format and conventions | `economyrpa-changelog` |
| Reviewing compliance framework PRs | `economyrpa-compliance-review` |
| Testing RLS tenant isolation | `economyrpa-test-api` |
| Troubleshoot why a skill is missing from AGENTS.md auto-invoke | `skill-sync` |
| Update CHANGELOG.md in any component | `economyrpa-changelog` |
| Updating existing checks and metadata | `economyrpa-sdk-check` |
| Working on MCP server tools | `economyrpa-mcp` |
| Working on economyrpa UI structure (actions/adapters/types/hooks) | `economyrpa-ui` |
| Working with economyrpa UI test helpers/pages | `economyrpa-test-ui` |
| Working with SCSS classes | `scss` |
| Writing Playwright E2E tests | `playwright` |
| Writing economyrpa API tests | `economyrpa-test-api` |
| Writing economyrpa SDK tests | `economyrpa-test-sdk` |
| Writing economyrpa UI E2E tests | `economyrpa-test-ui` |
| Writing Python tests with pytest | `pytest` |
| Writing Angular components | `angular-20` |
| Writing TypeScript types/interfaces | `typescript` |
| Writing documentation | `economyrpa-docs` |

---

## Project Overview

EconomyRPA is an open-source web software that implements automated workflows in an understandable way for users who need to automate processes, allowing them to choose and assign RPAs to processes in different sectors and/or areas.

| Component | Location | Tech Stack |
|-----------|----------|------------|
| SDK | `econcomyrpa/` | Python 3.9+, Poetry |
| API | `api/` | Django 5.1, DRF, Celery |
| UI | `ui/` | TypeScript, Angular 20, SCSS |

<!-- | MCP Server | `mcp_server/` | FastMCP, Python 3.12+ | -->
<!-- | Dashboard | `dashboard/` | Dash, Plotly | -->

---

## Python Development

```bash
# Setup
poetry install --with dev
poetry run pre-commit install

# Code quality
poetry run make lint
poetry run make format
poetry run pre-commit run --all-files
```

---

## Commit & Pull Request Guidelines

Follow conventional-commit style: `<type>[scope]: <description>`

**Types:** `feat`, `fix`, `docs`, `chore`, `perf`, `refactor`, `style`, `test`

Before creating a PR:
1. Complete checklist in `.github/pull_request_template.md`
2. Run all relevant tests and linters
3. Link screenshots for UI changes





<!-- 
## Dev environment tips
- Use `ls` and `cd ECOPROJECT` for enter into the project, then use `cd src/app/`, there are 2 dirs with the 'features' and 'shared'.
- Check into the dirs 'shared' and 'features' and develop the components of the dirs.
- Develop the 'features' components and 'shared' components.
- Use the respective logic for the 'login' and 'register' component, use a style like a business software.
- In the component 'bussiness' and 'rpas' make grids with elements with general(random) data.
- In the component 'home' improve data of the user registered.
- Use responsive measures for visualize in mobile or other devices.

## Testing instructions
- Find the CI plan in the .github/workflows folder.
- Run `ng test` to test to improve the code.
- From the test tell me how you think resolve before make changes.
- Add or update tests for the code you change, even if nobody asked.
 
## PR instructions
- Title format: [ECOPROJECT] <Title>
- Create user stories for best development, and add into a section.
- Always run `ng lint` and `ng test` before create the .txt file for analize.
- Add a final section for future improvements.
-->
