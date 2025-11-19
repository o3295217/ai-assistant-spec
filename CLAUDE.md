# CLAUDE.md - AI Assistant Guide

## Repository Overview

This repository contains the **technical specification** for a Personal AI Effectiveness Assistant web application. It is **not** the implementation itself, but rather a comprehensive requirements document that defines the project architecture, features, and development guidelines.

**Primary Language:** Russian (Specification documents)
**Project Type:** Technical Specification / Requirements Document
**Target Implementation:** Next.js web application with AI integration

## What This Repository Contains

### Core Documents

1. **README.md** (`/README.md`)
   - Brief project description in Russian
   - Project tagline: "личный помощник для достижения мечты" (Personal assistant for achieving dreams)

2. **ai-assistant-spec.md** (`/ai-assistant-spec.md`)
   - Comprehensive 662-line technical specification
   - Written in Russian
   - Contains complete requirements for the application

## Project Concept

The specification describes a local web application for personal effectiveness management with the following characteristics:

### Core Purpose
A daily planning system with hierarchical goal tracking from daily tasks up to 5-year dreams, with AI-powered evaluation using Anthropic's Claude API.

### Key Features
- **Hierarchical Goal System:** Dream (5 years) → Year → Half-year → Quarter → Month → Week → Day
- **Daily Planning:** Morning planning and evening fact-checking
- **AI Evaluation:** Claude API evaluates daily performance across 4 dimensions
- **Alignment Analysis:** AI checks if daily tasks align with weekly goals, weekly with monthly, etc., all the way to the 5-year dream
- **Analytics:** Trend graphs, historical data, weekly reports
- **Task Tracking:** Open tasks that weren't completed

## Technical Stack (As Specified)

### Frontend
- Next.js (React framework)
- TypeScript
- Tailwind CSS
- Recharts (for graphs)

### Backend
- Next.js API Routes
- Node.js

### Database
- SQLite (local storage)
- Prisma ORM

### AI Integration
- Anthropic Claude API (model: claude-sonnet-4.5)

### Development Environment
- Vibe coding (rapid development)
- Local execution (localhost)

## Database Schema

The specification defines 5 main tables:

### 1. `dream_goal`
- Single record for the 5-year goal
- Fields: id, goal_text, created_at, updated_at

### 2. `period_goals`
- Goals for different time periods (year/half_year/quarter/month/week)
- Goals stored as JSON array in `goals_json` field
- Fields: id, period_type, period_start, period_end, goals_json, created_at, updated_at

### 3. `daily_entries`
- Daily plan and fact entries
- Fields: id, date (UNIQUE), plan_text, fact_text, created_at, updated_at

### 4. `evaluations`
- AI evaluation results for each day
- Fields: id, daily_entry_id (FK), strategy_score, operations_score, team_score, efficiency_score, overall_score, feedback_text, plan_vs_fact_text, alignment_* fields, recommendations_text, created_at

### 5. `open_tasks`
- Unclosed tasks from previous days
- Fields: id, task_text, task_type, origin_date, is_closed, closed_at, created_at

## API Endpoints (As Specified)

The specification defines these API routes (see `/api-assistant-spec.md:197-256`):

### Goals API
- `GET /api/goals/dream` - Get current dream goal
- `POST /api/goals/dream` - Create/update dream goal
- `GET /api/goals/period?type=week&date=2025-11-10` - Get period goals
- `POST /api/goals/period` - Create/update period goals

### Daily Entries API
- `GET /api/daily/:date` - Get entry for specific day
- `POST /api/daily` - Create/update plan or fact
- `GET /api/daily/list?from=...&to=...` - Get list of days

### Evaluation API
- `POST /api/evaluate` - Send request to Claude API for evaluation
- `GET /api/evaluate/:daily_entry_id` - Get saved evaluation

### Open Tasks API
- `GET /api/tasks/open` - Get list of unclosed tasks
- `POST /api/tasks/close/:id` - Mark task as closed

### Analytics API
- `GET /api/analytics/trend?days=30` - Get data for graphs
- `GET /api/analytics/week-report?week_start=...` - Get weekly report

## Claude API Integration

### Evaluation Criteria
The Claude API evaluates each day on 4 dimensions (1-10 scale):
1. **Strategic Development** (Стратегическое развитие)
2. **Operational Management** (Операционное управление)
3. **Team Work** (Работа с командой)
4. **Time Efficiency** (Эффективность времени)
5. **Overall Score** (average of above)

### Alignment Checking
The most critical feature is **alignment analysis** - checking if:
- Daily tasks align with weekly goals
- Weekly goals align with monthly goals
- Monthly goals align with quarterly goals
- Quarterly goals align with half-year goals
- Half-year goals align with yearly goals
- Yearly goals align with the 5-year dream

Each alignment gets a status:
- ✅ Works (green)
- ⚠️ Partially works (yellow)
- ❌ Doesn't work (red)

### Prompt Structure
The specification includes a detailed prompt template (`/ai-assistant-spec.md:259-345`) that:
- Provides all hierarchical goals
- Shows daily plan and fact
- Requests structured JSON response
- Asks for harsh constructive criticism
- Requests specific recommendations

### Expected JSON Response Format
```json
{
  "strategy_score": 1-10,
  "operations_score": 1-10,
  "team_score": 1-10,
  "efficiency_score": 1-10,
  "overall_score": 1-10,
  "plan_vs_fact": "analysis text",
  "feedback": "harsh constructive feedback",
  "alignment": {
    "day_to_week": "analysis + status (works/partial/no)",
    "week_to_month": "...",
    "month_to_quarter": "...",
    "quarter_to_half": "...",
    "half_to_year": "...",
    "year_to_dream": "..."
  },
  "recommendations": "specific recommendations"
}
```

## User Interface Pages

The specification defines 8 main pages (`/ai-assistant-spec.md:357-472`):

1. **Dashboard** (`/`) - Main page with today's tasks, goal hierarchy, and recent trends
2. **Goals Planning** (`/goals`) - Tabbed interface for managing all goal levels
3. **Daily Planning** (`/daily/:date`) - Create plan and enter facts for specific day
4. **Evaluation** (`/evaluation/:date`) - View AI evaluation with alignment visualization
5. **History** (`/history`) - Calendar heatmap of all evaluated days
6. **Analytics** (`/analytics`) - Trend graphs and statistics
7. **Open Tasks** (`/tasks`) - List of unclosed tasks (strategic/operational)
8. **Weekly Report** (`/reports/week?start=...`) - Aggregated weekly summary

## Period Auto-Detection Logic

The specification defines automatic period calculation (`/ai-assistant-spec.md:500-523`):

- **Week:** Previous Monday to upcoming Sunday
- **Month:** 1st to last day of current month
- **Quarter:** Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec)
- **Half-year:** H1 (Jan-Jun), H2 (Jul-Dec)
- **Year:** Jan 1 to Dec 31 of current year

## Development Stages

The specification outlines 6 development stages (`/ai-assistant-spec.md:526-560`):

1. **Project Setup** - Next.js, TypeScript, Prisma, Tailwind
2. **Backend** - API endpoints, Claude integration
3. **Frontend - Basic Pages** - Dashboard, goals, daily planning
4. **Frontend - Evaluation & History** - Evaluation, history, analytics
5. **Additional Features** - Open tasks, weekly reports, alignment visualization
6. **Testing & Bug Fixes** - Testing, bug fixes, UI/UX improvements

## Non-Functional Requirements

### Performance (`/ai-assistant-spec.md:476-481`)
- Page load: < 1 second
- Claude API timeout: 30 seconds
- DB queries: < 100ms

### Security (`/ai-assistant-spec.md:482-485`)
- API key stored in `.env.local`
- Never commit API key to git
- All data is local (except Claude API calls)

### UX/UI (`/ai-assistant-spec.md:493-497`)
- Responsive design (desktop-first)
- Clear navigation
- Pleasant color scheme (not too bright)
- Loader/spinner during Claude API requests

## Environment Configuration

Required environment variables:
```
DATABASE_URL="file:./dev.db"
ANTHROPIC_API_KEY="sk-ant-..."
```

## Example Data

The specification includes realistic examples (`/ai-assistant-spec.md:563-607`):

### Dream Example
```
"Стать топ-менеджером федеральной IT-компании с управлением департаментом 200+ человек
и влиянием на стратегические решения компании"
```

### Daily Plan Example
```
1. Утром - работа над ИИ ассистентом
2. Калькулятор на 2026 год
3. Штатное расписание на 2026
4. Отправить второе заявление на обучение
5. Начать курс по ИБ
```

### Daily Fact Example
```
1. ИИ ассистент - не сделал
2. Калькулятор - готов
3. Штатное расписание - не сделал
4. Заявление - не отправил
5. Курс начал
```

## Definition of Done

The specification defines completion criteria (`/ai-assistant-spec.md:649-659`):
1. All pages work without errors
2. Can create/edit goals at all levels
3. Can create daily plan, add facts, get Claude evaluation
4. Evaluation correctly saved to DB and displayed
5. Alignment visualization works
6. History and analytics show data
7. Application runs locally with single command
8. Code is documented (comments in complex areas)

## Working with This Repository

### For AI Assistants Implementing This Spec

When implementing this specification:

1. **Read the Full Spec First**
   - Always read `/ai-assistant-spec.md` completely before starting implementation
   - The specification is comprehensive and detailed

2. **Follow the Tech Stack**
   - Use Next.js with TypeScript
   - Use Prisma with SQLite
   - Use Tailwind CSS for styling
   - Use Anthropic Claude SDK for AI integration

3. **Database Schema is Fixed**
   - Follow the exact schema defined in section 4 (`/ai-assistant-spec.md:122-193`)
   - Use Prisma migrations

4. **API Contracts are Defined**
   - Implement all endpoints as specified in section 5 (`/ai-assistant-spec.md:197-256`)
   - Follow the exact request/response formats

5. **Claude Prompt is Critical**
   - Use the exact prompt structure from section 6 (`/ai-assistant-spec.md:259-345`)
   - The prompt must request JSON response
   - Must include all hierarchical goals
   - Must request alignment analysis

6. **UI Pages are Specified**
   - Follow the page structure from section 7 (`/ai-assistant-spec.md:357-472`)
   - Each page has defined components and functionality

7. **Period Logic Must Be Exact**
   - Implement period auto-detection as specified in section 9 (`/ai-assistant-spec.md:500-523`)

8. **Security First**
   - Never commit API keys
   - Store sensitive data in `.env.local`
   - Validate all user inputs

9. **Development Stages**
   - Follow the 6-stage development plan from section 10 (`/ai-assistant-spec.md:526-560`)
   - Complete each stage before moving to the next

10. **Test Against Examples**
    - Use the example data from section 11 (`/ai-assistant-spec.md:563-607`)
    - Ensure realistic data works correctly

### For AI Assistants Updating This Spec

When updating this specification:

1. **Maintain Russian Language**
   - The specification is written in Russian
   - Keep all updates in Russian to maintain consistency

2. **Update This CLAUDE.md**
   - Whenever `/ai-assistant-spec.md` is updated, update this CLAUDE.md
   - Keep section references accurate

3. **Version Control**
   - Use clear commit messages explaining what parts of the spec changed
   - Group related changes together

4. **Consistency Check**
   - Ensure database schema matches API endpoints
   - Ensure UI pages match API contracts
   - Ensure examples match the defined structure

## Repository Structure

```
/
├── README.md                 # Brief project description (Russian)
├── ai-assistant-spec.md      # Complete technical specification (Russian)
└── CLAUDE.md                 # This file - AI assistant guide (English)
```

## Key Conventions

### Language Usage
- Specification documents: Russian
- Code (when implemented): TypeScript/JavaScript
- Comments in code: English or Russian (developer preference)
- This CLAUDE.md: English (for broader AI assistant compatibility)

### File Naming
- Specification uses kebab-case: `ai-assistant-spec.md`
- Future implementation should follow Next.js conventions

### Git Workflow
- Work on feature branches starting with `claude/`
- Commit messages should be clear and descriptive
- Push to designated branch when changes are complete

## Target User Profile

The specification is designed for:
- **Role:** Company executive/manager
- **Goal:** Control effectiveness and movement toward long-term goals
- **Use Case:** Daily planning and reflection with AI-powered feedback
- **Location:** Local computer (privacy-focused)

## Critical Success Factors

1. **Alignment Feature is Core**
   - This is the most important differentiator
   - Must clearly show if daily work contributes to long-term dreams

2. **Harsh Feedback**
   - Claude should provide constructive criticism "without sugar"
   - Honesty over politeness

3. **Local-First**
   - All data stored locally (SQLite)
   - Only Claude API calls go to external services

4. **Simple UX**
   - Should be quick to use daily
   - Morning planning should take < 5 minutes
   - Evening reflection should take < 10 minutes

## Common Pitfalls to Avoid

1. **Don't Over-Complicate**
   - Stick to the spec
   - Don't add features not in the specification

2. **Don't Skip Alignment**
   - The alignment feature is non-negotiable
   - It's the core value proposition

3. **Don't Make It Cloud-Based**
   - Must run locally
   - Privacy is important to the user

4. **Don't Soften AI Feedback**
   - Harsh, constructive criticism is requested
   - Don't make Claude too polite

5. **Don't Ignore Period Logic**
   - Weeks start on Monday
   - Quarters and half-years have specific dates
   - Auto-detection must be accurate

## Future Considerations

The specification mentions these as optional/nice-to-have:
- Mobile responsive design (desktop-first is priority)
- Data export to JSON
- Database backup functionality
- Onboarding flow for first-time users

## Related Resources

- **Next.js Documentation:** https://nextjs.org/docs
- **Prisma Documentation:** https://www.prisma.io/docs
- **Anthropic Claude API:** https://docs.anthropic.com/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Recharts:** https://recharts.org/

## Questions & Clarifications

When implementing, if you encounter ambiguity:

1. **Check the specification first** - Most questions are answered in detail
2. **Follow the examples** - Section 11 has realistic example data
3. **Prioritize alignment** - When in doubt, optimize for the alignment feature
4. **Keep it simple** - Desktop-first, local-first, simple UX

## Maintenance Notes

**Last Updated:** 2025-11-19
**Specification Version:** Initial release
**Status:** Specification phase (not yet implemented)

---

*This CLAUDE.md file is maintained to help AI assistants understand and work with this repository effectively. Update it whenever the specification changes.*
