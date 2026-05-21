# CodeBrush Project Documentation

---

## 📋 Table of Contents

| Chapter | Content | Page |
|---------|---------|------|
| [I. Project Overview](#i-project-overview) | Introduction, Features, Quick Start | 1 |
| [II. Strategic Planning](#ii-strategic-planning) | Core Positioning, Strategic Pillars, Roadmap | 2 |
| [III. API Documentation](#iii-api-documentation) | State Management, Layer Operations, Type Definitions | 3 |
| [IV. Community Guidelines](#iv-community-guidelines) | Code of Conduct, Contribution Process | 4 |
| [V. Operations Management](#v-operations-management) | Cleanup Strategy, Prevention Mechanisms, Maintenance Plan | 5 |
| [VI. Design Resources](#vi-design-resources) | Design Standards, Resource Structure | 5 |
| [VII. Website Information](#vii-website-information) | Page Routes, Deployment | 6 |
| [Appendix: Documentation Report](#appendix-documentation-report) | Removed Content, Retention Standards | 6 |

---

## I. Project Overview

### 1.1 🎯 Project Introduction

CodeBrush is a professional online design tool designed to provide designers and developers with a powerful and efficient design experience.

### 1.2 ✨ Core Features

| Feature Module | Core Capability | Description |
|---------------|-----------------|-------------|
| 🎨 Canvas Editor | Layer Management | Support for multiple layer types (frame, rectangle, text, image, etc.) |
| 📝 Text Processing | Rich Text Editing | Multiple fonts, sizes, colors, alignment options |
| 🖼️ Image Processing | Media Management | Upload, scale, crop, filter effects |
| 📤 Multi-format Export | Format Compatibility | PNG, SVG, JSON format export |
| ⌨️ Keyboard Shortcuts | Efficiency | Customizable shortcut configuration |
| 🔌 Plugin System | Feature Extension | Open plugin architecture support |
| ☁️ Cloud Storage | Data Sync | Project cloud backup and restore |
| 👥 Real-time Collaboration | Multi-user Editing | Real-time synchronized editing |

### 1.3 🚀 Quick Start

**Prerequisites**: Node.js ≥ 20.x, pnpm ≥ 8.x

```bash
git clone https://github.com/954510662-bot/CodeBrush.git
cd CodeBrush
pnpm install
pnpm run dev
```

Visit http://localhost:5173 to start using the application.

### 1.4 🌐 Online Experience

| Platform | URL | Status |
|----------|-----|--------|
| Cloudflare Pages | https://codebrush.pages.dev | ✅ Production |
| GitHub Pages | https://954510662-bot.github.io/CodeBrush/ | ✅ Backup |

### 1.5 🛠️ Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Frontend Framework | React + TypeScript | 18.x |
| Build Tool | Vite | 5.x |
| State Management | Zustand | 4.x |
| Styling Framework | Tailwind CSS | 3.x |
| Icon Library | Lucide React | 0.x |
| Animation Library | Framer Motion | 10.x |

---

## II. Strategic Planning

### 2.1 🎯 Core Positioning

**Differentiated Strategy**: Not a Figma replacement, but a smarter creative companion

| Dimension | Figma | CodeBrush |
|-----------|-------|----------|
| Positioning | Professional Design Tool | Smart Creative Assistant |
| Target Users | Professional Designers | Everyone (Pro + Non-pro) |
| Core Value | Powerful Feature Set | AI-powered + Easy to Use |
| Business Model | Subscription | Open Source + Value-added Services |

### 2.2 🌟 Six Strategic Pillars

1. **Modularity and Agility** - Focus on pain points, rapid response
2. **AI Empowerment, Smart Brush** - Natural language generation, sketch recognition
3. **Open Ecosystem, Seamless Migration** - .fig file compatibility, open API
4. **Community-Driven, Agile Iteration** - Fast feedback loop, transparent development
5. **Lower Barriers, Popularizing Creativity** - Zero-threshold experience, intuitive interaction
6. **Ecosystem Connection, Network Effects** - Workflow integration, creative community

### 2.3 📈 Product Roadmap

| Phase | Timeframe | Core Goal | Key Features |
|-------|-----------|-----------|--------------|
| Short-term | 0-6 months | Foundation Building | Canvas editor, core design features, multi-format export |
| Mid-term | 6-12 months | AI Empowerment | AI design assistant, .fig compatibility, cloud sync collaboration |
| Long-term | 1-3 years | Ecosystem Complete | Natural language generation, cross-platform collaboration, self-hosted solution |

### 2.4 📊 Phase Details

**Phase 1: Foundation Building (Months 1-3)**
- Complete core canvas editor
- Stabilize existing features
- Establish development workflow

**Phase 2: AI Empowerment (Months 4-6)**
- Introduce AI design assistant
- Implement natural language generation
- Sketch recognition functionality

**Phase 3: Open Ecosystem (Months 7-9)**
- .fig file compatibility
- Open API
- Plugin marketplace

**Phase 4: Community Growth (Months 10-12)**
- Self-hosted solution
- Community operations system
- Commercialization exploration

### 2.5 👥 Resource Planning

| Role | Count | Core Responsibilities |
|------|-------|----------------------|
| Tech Lead | 1 | Technical decisions, architecture design |
| Frontend Engineers | 3 | UI development, interaction implementation |
| Backend Engineers | 2 | API development, data storage |
| AI Engineers | 2 | AI feature development |
| DevOps | 1 | Deployment, operations, CI/CD |
| QA | 1 | Testing, quality assurance |
| Product Manager | 1 | Product planning, user research |
| Designer | 1 | UI/UX design, branding |
| Community Manager | 1 | Community operations, user communication |

### 2.6 ✅ Success Metrics

| Dimension | Metric | Target |
|-----------|--------|--------|
| Business | MAU Growth Rate | 50%/quarter |
| Business | Community Contributors | 100+ |
| Business | Plugin Count | 50+ |
| Product | Feature Completion Rate | 90% |
| Product | Bug Fix Rate | 95% |
| Product | NPS | ≥ 50 |
| Technical | First Screen Load Time | < 2s |
| Technical | API Response Time | < 200ms |
| Technical | System Stability | 99.9% |

---

## III. API Documentation

### 3.1 Overview

CodeBrush provides complete graphic editing capabilities. Below are the core APIs and state management interfaces.

### 3.2 State Management API

#### useStore

```typescript
const { projects, currentProjectId, currentTool, components } = useStore()
```

### 3.3 Project Management

| Method | Parameters | Description |
|--------|------------|--------------|
| `createProject(name)` | `name: string` | Create a new project |
| `getCurrentProject()` | none | Get the currently active project |

### 3.4 Layer Operations

| Method | Parameters | Description |
|--------|------------|--------------|
| `addLayer(projectId, layer)` | `projectId: string, layer: Layer` | Add a new layer |
| `updateLayer(projectId, layerId, updates)` | `projectId: string, layerId: string, updates: Partial<Layer>` | Update layer properties |
| `deleteLayer(projectId, layerId)` | `projectId: string, layerId: string` | Delete a layer |
| `selectLayers(projectId, layerIds)` | `projectId: string, layerIds: string[]` | Select layers |
| `groupLayers(projectId, layerIds)` | `projectId: string, layerIds: string[]` | Group multiple layers |
| `ungroupLayer(projectId, groupId)` | `projectId: string, groupId: string` | Ungroup layers |
| `duplicateLayer(projectId, layerId)` | `projectId: string, layerId: string` | Duplicate a layer |

### 3.5 Tool Operations

```typescript
selectTool(tool: ToolType) => void
```

**ToolType**: `'select' | 'rectangle' | 'ellipse' | 'polygon' | 'line' | 'pen' | 'text' | 'frame' | 'hand' | 'zoom'`

### 3.6 History

| Method | Description |
|--------|-------------|
| `undo()` | Undo the last operation |
| `redo()` | Redo the last undone operation |

### 3.7 Type Definitions

**LayerType**:
```typescript
'frame' | 'group' | 'rectangle' | 'ellipse' | 'polygon' | 'line' | 'path' | 'text' | 'image' | 'component' | 'boolean'
```

**Transform**:
```typescript
interface Transform {
  x: number; y: number; scaleX: number; scaleY: number; rotation: number; skewX: number; skewY: number
}
```

**RGBA**:
```typescript
interface RGBA { r: number; g: number; b: number; a: number }
```

---

## IV. Community Guidelines

### 4.1 📋 Code of Conduct

To create an open and friendly environment where everyone can participate without harassment.

**Positive Behaviors**:
- Use welcoming and inclusive language
- Respect different viewpoints and experiences
- Graciously accept constructive criticism
- Focus on what is best for the community
- Show empathy toward other community members

**Unacceptable Behaviors**:
- Use of sexualized language or imagery
- Malicious comments or personal/political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other unprofessional or inappropriate conduct

### 4.2 🤝 Contribution Guidelines

#### 4.2.1 Contribution Types

| Type | Icon | Content |
|------|------|---------|
| Design | 🎨 | UI optimization, icons, UX improvements, templates |
| Documentation | 📝 | Translation, tutorials, user guides, API docs |
| Non-code | 🐛 | Bug reports, feature suggestions, QA testing |
| Code | 💻 | Bug fixes, new features, performance optimization, plugins |

#### 4.2.2 Issue Label Guide

| Label | Description | Expected Time |
|-------|-------------|---------------|
| `good first issue` | Beginner-friendly tasks | Within 30 minutes |
| `help wanted` | Tasks needing help | 2-4 hours |
| `documentation` | Documentation tasks | 1-2 hours |
| `design needed` | Design contributions | Flexible |

#### 4.2.3 Contribution Process

```
1. Select or create an Issue
        ↓
2. Discuss and plan
        ↓
3. Fork the repository
        ↓
4. Create a branch
        ↓
5. Make changes
        ↓
6. Commit changes
        ↓
7. Push to Fork
        ↓
8. Create Pull Request
```

#### 4.2.4 Code Style Guidelines

- Use 2-space indentation
- Use single quotes
- Use semicolons
- Component names use PascalCase
- Function names use camelCase

#### 4.2.5 Commit Guidelines

Follow Conventional Commits specification:

```
<type>(<scope>): <description>

<body>

<footer>
```

**Types**: `feat`(new feature), `fix`(bug fix), `docs`(documentation), `style`(formatting), `refactor`(refactoring), `test`(testing), `chore`(build)

---

## V. Operations Management

### 5.1 🗑️ Residual File Identification Standards

| Category | Description | Examples |
|----------|-------------|----------|
| Dead Code | Source code no longer in use | old_module.ts |
| Unused Resources | Static assets not referenced | unused_image.png |
| Temporary Files | Generated during development | temp.txt, debug.log |
| Build Output | Build artifacts | dist/, build/, .next/ |
| Dependency Cache | Package manager cache | node_modules/, .pnpm-store/ |
| IDE Config | Editor configurations | .vscode/, .idea/ |

### 5.2 📋 Cleanup Priority

| Priority | Category | Risk Level | Recommended Action |
|----------|----------|------------|-------------------|
| P0 | Build Output | Low | Delete immediately |
| P1 | Temporary Files | Low | Delete immediately |
| P2 | Dependency Cache | Low | Delete immediately |
| P3 | Unused Resources | Medium | Verify then delete |
| P4 | Dead Code | High | Review then delete |

### 5.3 🛡️ Prevention Mechanisms

1. **Code Review**: Check for redundant files during PR review
2. **Automated Detection**: CI checks for unused imports
3. **Regular Cleanup**: Quarterly comprehensive cleanup
4. **Documentation Updates**: Update docs when deleting files

### 5.4 🛠️ Tool Support

| Tool | Purpose | Command |
|------|---------|---------|
| eslint | Detect unused imports | `eslint . --ext ts,tsx --report-unused-disable-directives` |
| depcheck | Detect unused dependencies | `npx depcheck` |
| git clean | Clean untracked files | `git clean -fd` |

### 5.5 📅 Regular Maintenance Schedule

| Frequency | Tasks | Owner |
|-----------|-------|-------|
| Monthly | eslint checks, .gitignore checks, temp file cleanup | DevOps |
| Quarterly | depcheck, dead code cleanup, archive old versions | Tech Lead |
| Annual | Comprehensive code audit, dependency updates, architecture docs | Team |

---

## VI. Design Resources

### 6.1 📁 Directory Structure

```
design-kit/
├── logo/              # Logo resources
├── ui-components/     # UI component design files
├── templates/         # Template resources
└── assets/            # Other design resources
```

### 6.2 🎨 Design Standards

**Color System**:
| Usage | Color Value |
|-------|------------|
| Primary | #2563EB |
| Secondary | #7C3AED |
| Success | #10B981 |
| Warning | #F59E0B |
| Error | #EF4444 |

**Typography**:
| Usage | Font Name |
|-------|-----------|
| Headings | Plus Jakarta Sans |
| Body | Inter |
| Code | JetBrains Mono |

### 6.3 💡 Design Contribution Process

1. Use CodeBrush design templates
2. Save in .codebrush format
3. Add to PR in `design-kit/templates/`

---

## VII. Website Information

### 7.1 📱 Page Routes

| Path | Page Name | Description |
|------|-----------|-------------|
| `/` | Home | Product introduction and download guide |
| `/product` | Product Page | Feature details and roadmap |
| `/download` | Download Page | Version selection and changelog |
| `/docs` | Documentation | User guides and API docs |
| `/contact` | Contact Page | Contact form and FAQ |
| `/login` | Login Page | User login |
| `/register` | Register Page | User registration |
| `/dashboard` | Dashboard | Account management |

### 7.2 🚀 Deployment

**Recommended: GitHub Actions Auto-Deploy**

1. Create a separate repository for website code
2. Configure GitHub Pages target branch
3. Enable GitHub Actions auto-build deployment

**Alternative: Cloudflare Pages**
- Supports auto-build deployment
- Provides CDN acceleration
- Custom domain support

---

## Appendix: Documentation Report

### A.1 📊 Before/After Comparison

| Dimension | Before | After |
|-----------|--------|-------|
| File Count | 12 separate files | 1 integrated file |
| Word Count | ~8000 words | ~5000 words |
| Redundant Content | Many duplicates | Removed |
| Structure Clarity | Scattered | Unified navigation |
| Readability | Average | Good |

### A.2 🗑️ Removed Content List

| Original File | Removal Reason | Handling | Impact |
|--------------|----------------|----------|--------|
| `website/PRD.md` | Website PRD too detailed, unrelated to core design tool | Simplified to summary | Low |
| `website/DEPLOYMENT.md` | Website deployment guide too detailed | Simplified to key steps | Low |
| `PULL_REQUEST_TEMPLATE.md` | PR template is CI config, not suitable for docs | Removed | Low |
| README Tech Stack | Duplicated with website info | Keep one copy | None |
| CONTRIBUTING Dev Environment | Duplicated with README | Keep one copy | None |
| VISION Duplicate Goals | Duplicated with ACTION_PLAN | Merged and optimized | None |

### A.3 ✅ Retained Content Description

| Category | Source | Retention Reason |
|----------|--------|------------------|
| Project Overview | README.md | Core project intro, valuable for all users |
| Strategic Planning | VISION.md + ACTION_PLAN.md | Strategic vision and roadmap, guides project direction |
| API Documentation | API.md | Developer docs, crucial for contributors |
| Code of Conduct | CODE_OF_CONDUCT.md | Community guidelines, maintains community health |
| Contribution Guide | CONTRIBUTING.md | Contribution guide, guides new contributors |
| Cleanup Strategy | CLEANUP_POLICY.md | Operations strategy, ensures project cleanliness |
| Design Resources | design-kit/README.md | Design standards, maintains design consistency |
| Website Overview | website/README.md | Website summary, provides product entry |

### A.4 📋 Documentation Retention Standards

#### Retention Standards (Meets any of the following)

| ID | Content | Applicable Scenarios |
|----|---------|---------------------|
| S1 | Directly related to CodeBrush core objectives | Core features, API, architecture |
| S2 | Practical guidance value for users/contributors | Usage guides, contribution process |
| S3 | Strategic guidance or decision reference value | Vision, roadmap, success metrics |
| S4 | Maintain community health and collaboration norms | Code of conduct, contribution guide |
| S5 | Ensure project operations and quality | Cleanup strategy, maintenance plan |

#### Deletion Standards (Meets any of the following)

| ID | Content | Examples |
|----|---------|----------|
| D1 | Duplicate content with no added value | Repeated tech stack info |
| D2 | Overly detailed operation guides | Specific deployment steps, CI config details |
| D3 | Weak relevance to core objectives | Detailed website PRD |
| D4 | Time-sensitive and outdated | Outdated version notes |
| D5 | Configuration files rather than documentation | PR template, CI configs |

---

**Document Version**: v2.1  
**Last Updated**: 2026-05-12  
**Status**: ✅ Systematically organized and optimized