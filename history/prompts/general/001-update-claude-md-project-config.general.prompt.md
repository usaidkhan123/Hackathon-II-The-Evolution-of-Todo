---
id: 001
title: Update CLAUDE.md Project Config
stage: general
date: 2026-01-29
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: User
command: /sp.implement
labels: ["configuration", "project-setup", "agents"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - /mnt/c/Users/User/Desktop/h/CLAUDE.md
tests:
  - none
---

## Prompt

Update the claude.md file based on my project requirements. In this file:

Use Auth Agent for authentication
Use Frontend Agent for frontend development (e.g., Next.js)
Use DB Agent for database design and operations
Use Backend Agent for FastAPI development
Below are my project requirements:

Basic Level Functionality
Objective: Using Claude Code and Spec-Kit Plus transform the console app into a modern multi-user web application with persistent storage.
💡Development Approach: Use the Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code. No manual coding allowed. We will review the process, prompts, and iterations to judge each phase and project.
Requirements
Implement all 5 Basic Level features as a web application
Create RESTful API endpoints
Build responsive frontend interface
Store data in Neon Serverless PostgreSQL database
Authentication – Implement user signup/signin using Better Auth
Technology Stack
Layer
Technology
Frontend
Next.js 16+ (App Router)
Backend
Python FastAPI
ORM
SQLModel
Database
Neon Serverless PostgreSQL
Spec-Driven
Claude Code + Spec-Kit Plus
Authentication
Better Auth

Better Auth can be configured to issue JWT (JSON Web Token) tokens when users log in. These tokens are self-contained credentials that include user information and can be verified by any service that knows the secret key.
How It Works
User logs in on Frontend → Better Auth creates a session and issues a JWT token
Frontend makes API call → Includes the JWT token in the Authorization: Bearer <token> header
Backend receives request → Extracts token from header, verifies signature using shared secret
Backend identifies user → Decodes token to get user ID, email, etc. and matches it with the user ID in the URL
Backend filters data → Returns only tasks belonging to that user

## Response snapshot

Updated CLAUDE.md with comprehensive project configuration including:
- Project overview and objectives
- Technology stack (Next.js, FastAPI, SQLModel, Neon PostgreSQL, Better Auth)
- Agent responsibilities (Auth, Frontend, Database, Backend agents)
- Authentication architecture with JWT flow
- Project structure for frontend and backend
- Required API endpoints (5 CRUD operations for tasks)
- Environment variable requirements
- Quick reference table for agent invocation

## Outcome

- ✅ Impact: CLAUDE.md now contains complete project configuration for multi-user Todo web application
- 🧪 Tests: none
- 📁 Files: 1 file modified (CLAUDE.md)
- 🔁 Next prompts: Run /sp.specify to create feature spec, /sp.plan to create architecture plan
- 🧠 Reflection: Successfully configured project rules with agent delegation patterns

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A - configuration task
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
