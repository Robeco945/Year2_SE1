# Sprint 8 (Final Sprint) - Repository Audit Report

**Project:** Messaging Application  
**Audit Scope:** Repository Structure, Documentation, Testing, Code Quality, Individual Contributions

---

## Executive Summary - UPDATED

Repository **significantly improved** since initial audit. Sprint 6 now includes:
- ✅ Code Quality Report (statistical analysis with 5 tools: Pylint, Radon, Lizard, JSCPD, Vulture)
- ✅ SonarQube Dashboard screenshot
- ✅ Acceptance Test Plan (functional, usability, performance test cases)
- ✅ Database Localization Implementation docs  
- ✅ Sprint 6 Review Report (with team contribution tracking)

**Remaining Gaps:**
- Missing Sprint 4, 7, 8 reports
- No Final Project Report (critical for submission)
- No UAT Test Execution Results (planning exists, execution results missing)
- No Heuristic Evaluation (usability testing - planning exists)

**Action Required:** Create Sprint 8 report, Final Summary, and execute/document UAT and Heuristic Evaluation before deadline.

---

## 1. Repository & File Structure Audit

### ✅ Exists & Complete

- **README.md** - Professional structure with features, tech stack, architecture, API endpoints
- **docs/** folder - Organized with `/diagrams` and `/sprint_report` subdirectories
- **Diagrams** - 4 UML diagrams present (ER, Use Case, Class, Activity)
- **Backend/Frontend/Database** - Individual README files for setup/configuration
- **CI/CD** - Jenkinsfile, docker-compose.yml, Dockerfile configured
- **Testing Infrastructure** - pytest setup, coverage reports (htmlcov), TESTING.md for frontend

### ✅ Now Complete (Updated Post-Initial Audit)

| Item                              | Status         | Details                                                                |
| --------------------------------- | -------------- | ---------------------------------------------------------------------- |
| **Sprint 6 Review Report**        | ✅ COMPLETE    | `sprint_6_review_report.md` with implementation summary & contributions |
| **Code Quality Report**           | ✅ COMPLETE    | `statistical_code_review_report.md` with 5-tool analysis (Pylint 7.33) |
| **SonarQube Analysis**            | ✅ COMPLETE    | `MetroMessengerSonarQubeAnalysis.png` dashboard screenshot             |
| **Static Analysis Tools Output**  | ✅ COMPLETE    | 5 reports: pylint, radon, lizard, jscpd, vulture backend analysis     |
| **Acceptance Test Plan**          | ✅ COMPLETE    | `Acceptance_Test_Planning.md` - functional, usability, perf test cases |
| **Database Localization Docs**    | ✅ COMPLETE    | `sprint_6_db_localization_implementation.md` with schema & UTF-8 config|
| **Team Contributions (Sprint 6)** | ✅ COMPLETE    | Iida 5h, Roberto 8h, Vadim 4h - documented in sprint 6 review         |

### ❌ Still Missing

| Item                            | Status  | Impact                             |
| ------------------------------- | ------- | ---------------------------------- |
| **Final Project Report**        | MISSING | Critical for course submission     |
| **Sprint 4 Planning**           | MISSING | Incomplete sprint cycle            |
| **Sprint 4 Review**             | MISSING | Incomplete sprint cycle            |
| **Sprint 7 Planning**           | MISSING | Incomplete sprint cycle            |
| **Sprint 7 Review**             | MISSING | Incomplete sprint cycle            |
| **Sprint 8 Planning**           | MISSING | Current sprint not documented      |
| **Sprint 8 Review**             | MISSING | Final sprint missing               |
| **UAT Test Results (Executed)**  | MISSING | Acceptance plan exists, results missing |
| **Heuristic Evaluation Report**  | MISSING | No user experience testing documented |

---

## UPDATED FINDINGS: Product Vision & Project Plan Analysis

### ✅ Product Vision Document (PDF - Extracted)

Located: `docs/sprint_report/Product Vision-Group 4 (1).pdf`

**Content Found:**

- ✅ Problem Statement - users struggle with complex messaging platforms
- ✅ Target Audience - students, young adults preferring simple web-based solution
- ✅ Value Proposition - lightweight, user-friendly, reliable web messaging
- ✅ Key Features:
    - User registration/secure login
    - 1:1 text messaging
    - Group chat
    - Message history viewing
    - Web-based interface (no installation)
    - Cloud sync/backup
    - Conversation search
- ✅ Goals & Objectives:
    - 30% user adoption within 3 months
    - 4.0/5 user satisfaction
    - Scalable architecture for SEP2 expansion
- ✅ Vision Statement - simple, reliable, accessible messaging with clean web interface

**Status:** ✅ COMPLETE - All SEP1/SEP2 customer requirements documented

### ✅ Project Plan Document (PDF - Extracted)

Located: `docs/sprint_report/Project Plan-Group 4 (1).pdf`

**Content Found:**

- ✅ Project Overview & Problem Summary
- ✅ Intended Audience definition
- ✅ Main Features/Components listed
- ✅ Project Objectives (6 key objectives)
- ✅ Scope definition (in-scope/out-of-scope)
- ✅ Deliverables (Frontend, Backend, Database, Repo, Docs, Artifacts)
- ✅ Project Timeline:
    - Sprint 1 (Weeks 1-2): Planning & Setup
    - Sprint 2 (Weeks 3-4): Core features & initial testing
    - Sprint 3 (Weeks 5-6): Feature expansion & testing
    - Sprint 4 (Weeks 7-8): Final testing, debugging, deployment prep
    - **Note:** Plan only covers 4 sprints; actual project executed 8 sprints (expansion beyond original scope)
- ✅ Resource Allocation:
    - Chin Pei Wen - Scrum Master (Sprint 1)
    - Iida Saarinen - Product Owner
    - Roberto Caretto - Developer
    - **Note:** Plan lists 3 members; actual team has 5-6 contributors
- ✅ Technology Stack:
    - Frontend: Next.js (actual: React)
    - Backend: Python ✅ (actual: FastAPI ✅)
    - Database: MySQL (actual: MariaDB ✅)
    - Tools: Figma, VS Code, Trello, GitHub
- ✅ Risk Management (4 risks identified with mitigation)
- ✅ Testing Strategy (unit, integration, system, UAT)
- ✅ Documentation plan
- ✅ Progress reporting plan

**Status:** ✅ LARGELY COMPLETE - All core planning documented (some tech stack deviations)

**Deviations Found:**
| Item | Plan | Actual | Impact |
|------|------|--------|--------|
| Frontend Framework | Next.js | React | Low - both modern JS frameworks |
| Database | MySQL | MariaDB | None - MariaDB is MySQL-compatible |
| Sprint Count | 4 sprints | 8 sprints | Project scope expanded significantly |
| Team Size | 3 members | 5-6 members | Team grew beyond original plan |

---

## 2. Documentation Content Checklist

### README.md - Quality Assessment

**Sections Present:**

- ✅ Overview (clear problem statement)
- ✅ Features (list of functionality)
- ✅ System Architecture (layered architecture explained)
- ✅ Technologies Used (complete tech stack table)
- ✅ Project Structure (directory layout)
- ✅ Installation Instructions (Docker setup)
- ✅ API Endpoints (documented)
- ✅ UML Diagrams (mentioned but need detail)

**Missing/Incomplete:**

- ⚠️ No Customer Requirements section - **Product Vision exists in docs/** but not integrated into README
    - Vision PDF defines: Problem statement, target audience, value proposition, key features, goals
    - Should be summarized in README for context
- ⚠️ Development Methods section exists in sprints, not in README
    - Project Plan PDF shows Agile/Scrum methodology but not in README
    - Testing strategy documented in Project Plan (unit, integration, system, UAT) - needs linking
- ⚠️ No Implementation Details (module breakdown, specific tech choices rationale)
    - Project Plan specifies FastAPI/Next.js/MySQL but actual stack uses React/MariaDB (deviation not documented)
- ⚠️ No Testing Strategy section
- ⚠️ No Summary/Lessons Learned
- ⚠️ No References & Tools section (Trello, GitHub links not listed)

### Sprint Reports - Coverage Analysis

**Sprint 1:**

- ✅ Planning Report (complete)
- ✅ Review Report (complete)

**Sprint 2:**

- ⚠️ Planning file exists (text format, not .md)
- ⚠️ Review file exists (text format, not .md)
- ⚠️ Contains screenshots (CRUD1.PNG, CRUD2.PNG) but no narrative

**Sprint 3:**

- ✅ Review Report exists
- ❌ Planning Report MISSING

**Sprint 4:**

- ❌ COMPLETELY MISSING (both planning and review)

**Sprint 5:**

- ✅ Planning (complete)
- ✅ Review (complete with time tracking per team member)

**Sprint 6:**

- ✅ Planning only (needs review report)
- ❌ Review Report MISSING

**Sprint 7:**

- ❌ COMPLETELY MISSING

**Sprint 8 (Current/Final):**

- ❌ COMPLETELY MISSING

### Testing & Code Quality Documentation (UPDATED)

**Testing Documentation Found:**

- ✅ `/frontend/TESTING.md` - Jest testing framework setup
- ✅ `/backend/README.md` - pytest documentation
- ✅ Coverage reports - htmlcov/ folder with detailed HTML reports
- ✅ `.coverage` file - Code coverage data
- ✅ **Acceptance Test Plan (NEW)** - Sprint 6: `Acceptance_Test_Planning.md` with functional, usability, performance test cases

**Code Quality Documentation (NOW COMPLETE!):**

- ✅ **Static Code Analysis Report (NEW)** - `statistical_code_review_report.md` in Sprint 6
- ✅ **Code Metrics (NEW)** - Cyclomatic complexity (Radon: avg A=1.95), LOC hotspots, duplication %
- ✅ **SonarQube Dashboard (NEW)** - `MetroMessengerSonarQubeAnalysis.png` 
- ✅ **5-Tool Analysis Suite (NEW)** - pylint, radon, lizard, jscpd, vulture detailed outputs
- ✅ **Code Quality Baseline** - Pylint score: 7.33/10, complexity A rating, 8.25% duplication

**Testing Documentation Still Missing:**

- ❌ **Heuristic Evaluation Report** - No formal user experience testing conducted
- ❌ **UAT Test Execution Results** - Plan exists, actual test results/pass rate missing
- ❌ **Unit Test Summary** - Coverage data exists, no consolidated narrative report
- ❌ **Integration Test Results** - No formal integration test documentation
- ❌ **Functional Testing Report** - No functional test coverage summary

---

## 3. System Design & Architecture Documentation

### ✅ Present

- **Architecture Diagram** - Class diagram showing system structure
- **ER Diagram** - Database schema representation
- **API Documentation** - Swagger/ReDoc available at `/docs`
- **Technology Stack** - Documented in README
- **Docker Setup** - Containerization documented with compose file

### ⚠️ Incomplete/Missing

- **Design Rationale** - Why specific technologies chosen (not explained)
- **Module Interactions** - How components communicate (need detailed documentation)
- **Database Design Rationale** - Why specific schema structure chosen
- **Scalability Considerations** - Not documented

---

## 4. Development Methods Documentation

### ✅ Present

- **Agile/Scrum Framework** - Sprints documented in sprint reports
- **CI/CD Pipeline** - Jenkinsfile configured with:
    - Build stage
    - Test stage (pytest with coverage)
    - Coverage collection stage
    - Docker integration
- **Docker/Containerization** - docker-compose.yml, Dockerfile
- **Version Control** - Git/GitHub with branching strategy (frontend branch visible)

### ⚠️ Missing/Incomplete

- **Definition of Done** - Not formally documented in recent sprints
- **Sprint Ceremonies** - Not explicitly documented (planning, review, retro, standup)
- **Risk Management** - Only Sprint 6 has documented risks
- **Quality Gates** - Not documented

---

## Gap Analysis Report: Action Items

### 🔴 CRITICAL - Must Complete Before Final Submission

1. **Execute & Document UAT Test Results** (2-3 days)
   - Test Plan exists (`Acceptance_Test_Planning.md`)
   - Need to: Execute test cases, document results, create pass/fail summary
   - Reference: 4 acceptance criteria in test plan (localization, UI continuity, refactoring regression, performance)
   - Document results per TC-F01, TC-F02 (functional), TC-U01 (usability), TC-P01, TC-R01 (performance/reliability)

2. **Create Final Project Report** (1-2 days)
    - **Introduction:** Project objectives, scope, background
        - Reference existing Project Plan and Product Vision documents
        - Note scope expansion (4 → 8 sprints)
    - **Customer Requirements:** Integration of Product Vision from SEP1/SEP2
        - Include extracted problem statement, target audience, key features from Vision PDF
        - Map actual implementation against Vision requirements
        - Document deviations (tech stack: Next.js→React, project duration)
    - **Development Methods:** Agile/Scrum framework, tools used
        - Team structure (actual 5-6 members vs planned 3)
        - Trello for task management
        - GitHub for version control (branching strategy)
        - Jenkins for CI/CD (documented in Jenkinsfile)
        - Docker for deployment
    - **System Design:** Architecture decisions, module interactions
        - Include class diagram, ER diagram, use case diagram, activity diagram
        - Database schema rationale (why MariaDB over MySQL)
        - API design decisions
    - **Implementation:** Tech stack breakdown, component descriptions
        - Backend: FastAPI + Python + SQLAlchemy
        - Frontend: React + localization (English, Arabic, Japanese)
        - Database: MariaDB with MariaDB schema
        - Docker containerization
    - **Testing Strategy:** Unit, integration, system, functional testing
        - Reference Project Plan's testing strategy (Section 7)
        - Include coverage reports from htmlcov/ and .coverage file
        - Document UAT approach (if any user testing was done)
    - **Results:** Summary of all 8 sprints outcomes
        - Link to sprint reports (1-6 available, 4/7/8 need creation)
        - Feature completion status
        - Test coverage metrics
    - **Lessons Learned:** Team reflections on what worked/challenges
        - Pull from "What Went Well" / "What Could Be Improved" sections of sprint reports
    - **References:** All tools/links documented
        - GitHub repo link
        - Trello board link (if accessible)
        - Project Plan and Product Vision PDFs
        - Sprint reports locations

2. **Create Sprint 8 (Final Sprint) Report** (4-8 hours)
    - Sprint planning document
    - Sprint review/completion report
    - Time tracking per team member
    - Individual contributions documented

3. **Create Consolidated Testing Results Document** (4-8 hours)
    - **Unit Test Results** summary (with coverage %)
        - Use .coverage file and htmlcov/ reports
        - Report coverage by module (backend routes, models, database)
        - Reference pytest results
    - **Integration Test Results**
        - Frontend-Backend API integration
        - Database persistence testing
        - WebSocket real-time messaging validation
    - **System Testing**
        - Messaging workflow validation (per Project Plan criteria):
            - Users can register, log in, log out successfully
            - 1:1 and group messages sent/received correctly
            - Message history stored and displayed accurately
            - Search functionality retrieves correct conversations
    - **UAT Results** (if user testing conducted)
        - User acceptance criteria met?
        - Reference Project Plan Section 7.2 "Criteria for Success"
    - **Heuristic Evaluation** (if expert review conducted)
        - Usability assessment against localization features
        - Interface clarity and accessibility
    - **Coverage Reports**
        - Link to htmlcov/ directory with detailed HTML coverage report
        - Summary of line coverage, branch coverage by component
        - Identified gaps in testing

4. ✅ **Code Quality Report** - COMPLETE
    - Statistical code review: ✅ Complete (Sprint 6)
    - Code metrics: ✅ Complete (Pylint 7.33/10, complexity A, 8.25% duplication)
    - SonarQube dashboard: ✅ Complete
    - 5-tool analysis: ✅ Complete (pylint, radon, lizard, jscpd, vulture)

### 🟡 IMPORTANT - Should Complete

5. **Complete Sprint Documentation** (6-12 hours)
    - Sprint 4 Planning + Review (missing entirely)
    - Sprint 4 Review + Summary
    - Sprint 7 Planning (even if retrospective)
    - Sprint 7 Review (even if retrospective)
    - ✅ Sprint 6 Review Report (NOW COMPLETE)
    - Convert Sprint 2 text files to .md format

6. **Update README.md** (2-3 hours)
    - Add Customer Requirements section
    - Add Development Methods details
    - Add References section with links
    - Add Lessons Learned
    - Add Testing Strategy explanation

7. **Create Individual Contribution Summary** (2-3 hours)
    - Document each team member's role for Sprints 4-8
    - Create contribution matrix (who did what)
    - Link to commits where possible

### 🟢 NICE TO HAVE (Lower Priority)

8. Create Architecture Design Document (if not already done)
9. Create Database Design Rationale Document
10. Add static code analysis (SonarQube/pylint results)

---

## Current Repository Strengths

✅ **Professional README** with clear setup instructions  
✅ **Complete UML Diagrams** (ER, Use Case, Class, Activity)  
✅ **Working CI/CD Pipeline** with Jenkins and Docker  
✅ **Testing Infrastructure** with code coverage  
✅ **Modular Architecture** (backend/frontend/database separation)  
✅ **Docker Containerization** fully configured  
✅ **API Documentation** via Swagger  
✅ **Good Early Sprint Documentation** (S1-S3 fairly complete)

---

## Important: Project Scope & Deviations from Original Plan

### Scope Expansion: 4 Sprints → 8 Sprints

**Original Plan** (Project Plan PDF):

- 4 sprints covering 8 weeks
- Sprint 4 was planned as "Final testing, debugging, deployment prep"

**Actual Execution:**

- 8 sprints executed (April-current)
- Additional sprints (5-8) added features beyond original scope:
    - **Sprint 5:** UI Localization (Arabic, Japanese added - not in original Plan)
    - **Sprint 6:** Database Localization (expansion feature)
    - **Sprints 7-8:** Further development (not documented)

**Reason for Expansion:**

- Not explicitly documented in current sprint reports
- Appears to be driven by team decision to implement localization (good decision for product value)
- Should be documented in Final Report as "scope evolution" / "change management"

### Technology Stack Deviations (Minor)

| Original Plan      | Actual Implementation | Impact                                                    |
| ------------------ | --------------------- | --------------------------------------------------------- |
| Next.js (Frontend) | React (Frontend)      | No impact - React equally modern, better for localization |
| MySQL              | MariaDB               | No impact - MariaDB is MySQL-compatible fork              |

**Action:** Final Report should document these as "implementation decisions" and rationale.

## Summary Table: File Completeness (Updated 2026-04-28)

| Category              | Status  | Details                                                    |
| --------------------- | ------- | ---------------------------------------------------------- |
| README.md             | ⚠️ 70%  | Good structure, missing some sections                      |
| UML Diagrams          | ✅ 100% | All 4 diagrams present                                     |
| ER Diagram            | ✅ 100% | Present                                                    |
| Sprint Reports (1-3)  | ✅ 80%  | Mostly complete, S2 needs format fix                       |
| Sprint Reports (4-8)  | ⚠️ 37%  | S5 complete, S6 NOW COMPLETE, S4/7/8 missing              |
| Testing Documentation | ⚠️ 60%  | Framework docs exist, UAT plan exists, results missing     |
| Code Quality          | ✅ 100% | NOW COMPLETE - Statistical review + SonarQube + 5 tools    |
| Final Report          | ❌ 0%   | MISSING - CRITICAL                                         |
| Acceptance Testing    | ⚠️ 50%  | Plan exists, execution results missing                     |
| Overall Completeness  | ⚠️ 67%  | From 47% to 67% - Significant progress (Sprint 6 work)     |
| CI/CD Documentation   | ✅ 80%  | Jenkinsfile present, explanation needed |
| Architecture          | ⚠️ 60%  | Diagrams present, rationale missing     |
| API Documentation     | ✅ 100% | Swagger available                       |

---

## Recommended Timeline for Completion

**This Week (before presentation):**

- Create Sprint 8 Report (2-3 days)
- Create Final Project Report (3-4 days)
- Create Testing Results Consolidation (1-2 days)

**Before Final Submission Deadline:**

- Create Code Quality Report (1-2 days)
- Complete missing sprint reports (2-3 days)
- Update README with missing sections (1 day)

---

## Notes for Team

1. **Commit history is solid** - All team members have visible contributions
2. **Architecture is sound** - Layered structure with clear separation of concerns
3. **Testing infrastructure exists** - Just needs results documentation
4. **Documentation is inconsistent** - Early sprints well-documented, later ones need catch-up
5. **Focus on Final Report** - This is likely the most critical missing piece for grading

---

## Appendix: Product Vision & Project Plan Summary

### Product Vision PDF

**File:** `docs/sprint_report/Product Vision-Group 4 (1).pdf` (47 lines extracted)

**Key Content:**

- Problem: Users struggle with overly complex messaging platforms
- Target: Students, young adults wanting simple web-based chat
- Value Prop: Lightweight, user-friendly, reliable messaging
- Features: Registration, 1:1/group messaging, history, search, cloud sync
- Goals: 30% adoption, 4.0/5 satisfaction, scalable architecture
- Vision: Simple, reliable, accessible messaging with clean web interface

**Relevance:** ALL customer requirements documented here - MUST be integrated into Final Report

### Project Plan PDF

**File:** `docs/sprint_report/Project Plan-Group 4 (1).pdf` (307 lines extracted)

**Key Content:**

- Timeline: 4 sprints (8 weeks) - EXCEEDED (8 sprints actual)
- Deliverables: Frontend, Backend, Database, Repo, Docs, Artifacts
- Resources: 3 team members + roles (EXPANDED to 5-6)
- Technology: FastAPI ✅, Next.js (React actual), MySQL (MariaDB actual)
- Testing Strategy: Unit, Integration, System, UAT (good alignment)
- Risk Management: 4 risks documented with mitigations
- Scope: Core messaging features, excludes encryption/multimedia/third-party integrations

**Relevance:** Original project scope document - use as baseline, document deviations in Final Report

**Action Items from PDFs:**

1. ⚠️ Project Plan shows only 4 sprints but 8 were executed → document in Final Report
2. ⚠️ Team grew from 3 to 5-6 members → update roles documentation
3. ⚠️ Tech stack deviations (minor) → document rationale
4. ✅ Localization feature added → not in original plan, should be documented as value-add
5. ✅ Product Vision provides all customer requirements → reference in Final Report
