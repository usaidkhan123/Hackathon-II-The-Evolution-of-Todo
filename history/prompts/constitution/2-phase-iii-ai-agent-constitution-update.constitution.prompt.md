---
id: 2
title: Phase III AI Agent Constitution Update
stage: constitution
date: 2026-02-03
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: main
user: user
command: /sp.constitution
labels: ["constitution", "phase-iii", "ai-agent", "mcp", "governance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

Update the existing project constitution to incorporate Phase III (AI Agent & Chat Interface) while preserving all principles and decisions from Phase I and Phase II.

Context:
- Phase I: In-memory Python console Todo app (spec-driven, clean code)
- Phase II: Full-stack, multi-user Todo app
  - Backend: FastAPI, SQLModel, Neon PostgreSQL
  - Frontend: Next.js App Router
  - Auth: Better Auth with JWT
- Phase III: AI-powered Todo Assistant using MCP (Model Context Protocol)

Update the constitution to explicitly define:

1. Core Principles
- Spec-driven development is mandatory (specify → plan → implement)
- Stateless AI agent execution
- Strong separation of concerns (agent logic, tools, UI)
- Security-first design (user isolation, JWT enforcement)
- Simplicity over over-engineering (hackathon scope aware)

2. AI & Agent Rules
- AI must NEVER access the database directly
- All data mutations must go through MCP tools
- MCP tools must enforce user-level authorization
- Agent must be stateless and request-scoped
- Safe defaults and graceful error handling are required

3. Architecture Constraints
- MCP server implemented using FastAPI
- Frontend communicates with AI via secure API routes
- Existing theme, UI, and layouts must remain unchanged
- No breaking changes to Phase II APIs

4. Quality & Judging Alignment
- Readability over cleverness
- Explicit specs and clear evolution history
- Decisions must be explainable to judges
- Focus on correctness, safety, and user experience

5. Non-Goals
- No autonomous background agents
- No long-term memory beyond user data
- No experimental or unstable features

Output Requirements:
- Update the constitution file only
- Keep language clear, authoritative, and concise
- Do not remove prior principles — extend them
- Ensure the constitution reflects all three phases cohesively

## Response snapshot

Updated constitution from v2.0.0 to v3.0.0 (MAJOR version bump due to new architectural layer).

Key changes:
- Retained all 6 original principles from Phase II
- Added 3 new NON-NEGOTIABLE principles for Phase III:
  - VII. AI Must Not Access Database Directly
  - VIII. Stateless AI Agent Execution
  - IX. Simplicity Over Over-Engineering
- Added AI & Agent Rules section with MCP Architecture Laws
- Added AI Behavior Constraints and Error Handling rules
- Added MCP Tools to API Contract Rules
- Added Non-Goals section (explicit out-of-scope items)
- Updated Technology Stack with AI & MCP Layer
- Updated Monorepo Structure with mcp/ directory
- Updated Agent Responsibilities (Backend Agent now includes MCP duties)
- Added Quality & Judging Alignment to Development Standards

## Outcome

- ✅ Impact: Constitution now governs all three phases cohesively with 9 core principles
- 🧪 Tests: N/A (documentation change)
- 📁 Files: 1 file updated (.specify/memory/constitution.md)
- 🔁 Next prompts: Create Phase III feature spec, plan MCP implementation
- 🧠 Reflection: Version bump to 3.0.0 appropriate given new architectural layer and principles

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): Standard constitution update
- Next experiment: Validate constitution against Phase III implementation during spec/plan
