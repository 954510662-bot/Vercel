# CodeBrush Deployment Configuration Guide

This document provides deployment and CI/CD configuration guidance for the CodeBrush project.

---

## 📋 Table of Contents

1. [GitHub Actions CI/CD](#github-actions-cicd)
2. [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
3. [Codecov Integration](#codecov-integration)
4. [Environment Variables Configuration](#environment-variables-configuration)

---

## GitHub Actions CI/CD

### Workflow Overview

The project uses GitHub Actions for continuous integration and deployment with the following stages:

```
quality-check (Type Check + ESLint)
        ↓
test (Unit Tests + Coverage)
        ↓
build (Production Build)
        ↓
security-scan (Security Vulnerability Scan)
        ↓
deploy (Cloudflare Pages Production)
```

### Workflow File Location

```
.github/workflows/main.yml
```

---

## Cloudflare Pages Deployment

### Prerequisites

1. Cloudflare account
2. Wrangler CLI installed (optional)

### Obtaining Cloudflare API Token

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **API Tokens** page
3. Click **Create Token**
4. Select **Edit Cloudflare Workers** template
5. Configure account permissions:
   - Account: `Edit`
   - Zone: `Edit` (if using custom domain)
6. Set token name to `Cloudflare Pages Deploy`
7. Click **Create Token**
8. **Important**: Copy the token immediately - it will only be shown once

### Obtaining Account ID

1. Log in to Cloudflare Dashboard
2. Select the target account
3. Find **Account ID** at the bottom of the **Overview** page
4. Copy and save it

### Configuring GitHub Secrets

1. Open the GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |

### Manual Deployment (Optional)

Deploy manually using Wrangler CLI:

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=codebrush
```

### Custom Domain (Optional)

1. Add domain in Cloudflare Dashboard
2. Configure DNS records pointing to Cloudflare Pages
3. Bind custom domain in Pages project settings

---

## Codecov Integration

### About Codecov

Codecov is a code coverage analysis platform that helps track test coverage and code change impact.

### Obtaining Codecov Token

1. Visit [codecov.io](https://codecov.io/)
2. Log in with GitHub
3. Add the `954510662-bot/CodeBrush` repository
4. Copy the repository's **Codecov Token**

### Configuring GitHub Secrets

1. Open the GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add:

| Secret Name | Description |
|-------------|-------------|
| `CODECOV_TOKEN` | Codecov Repository Token |

### How Codecov Works

The test step in the workflow automatically:

1. Runs `pnpm test:coverage` to generate coverage report
2. Uploads `coverage/coverage-final.json` to Codecov
3. Codecov analyzes and generates coverage trend charts

### Viewing Coverage Reports

1. Visit [codecov.io](https://codecov.io/)
2. Select the CodeBrush repository
3. View coverage trends and change impact

---

## Environment Variables Configuration

### Required Secrets

| Secret Name | Required | Description |
|-------------|----------|-------------|
| `CLOUDFLARE_API_TOKEN` | Yes | For deploying to Cloudflare Pages |
| `CLOUDFLARE_ACCOUNT_ID` | Yes | Cloudflare account identifier |
| `CODECOV_TOKEN` | No | Code coverage upload (CI/CD still runs, only skips upload) |

### Verifying Secrets Configuration

After secrets are configured, the GitHub Actions workflow should be able to:

1. ✅ Run tests and generate coverage reports
2. ✅ Upload coverage reports to Codecov
3. ✅ Deploy to Cloudflare Pages

### Local Testing

Verify CI/CD flow locally:

```bash
# Run all checks
pnpm run lint
pnpm test:run
pnpm test:coverage
pnpm run build
```

---

## Troubleshooting

### Common Issues

**Q: Cloudflare deployment failed?**
- Check if `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are correct
- Ensure token has Pages deployment permissions
- Check Cloudflare account status

**Q: Codecov upload failed?**
- `CODECOV_TOKEN` may be invalid or expired
- Can temporarily remove the step, tests still run
- Coverage reports are saved locally in `coverage/` directory

**Q: Tests pass but coverage shows 0?**
- Check if tests are running correctly
- Confirm coverage configuration in vitest.config.ts is correct

---

## Reference Links

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Codecov Documentation](https://docs.codecov.io/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Vitest Documentation](https://vitest.dev/)

---

**Last Updated**: 2026-05-12
