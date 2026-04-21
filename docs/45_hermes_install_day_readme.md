# 45_hermes_install_day_readme.md

# Hermes Install Day README
**Step-by-step setup guide for Mac mini install day**
**Context:** Ubiquiti Dream Machine Pro Max arrives Saturday and will be installed next week.  
**This README is for the first Hermes / OpenClaw setup day on the Mac mini before or alongside full network hardening.**

---

## Purpose

This file is the human-readable install-day guide for standing up the first working Hermes environment on the Mac mini.

The goal of this install day is **not** to finish the entire final production system.

The goal is to:

1. power on and prepare the Mac mini correctly  
2. organize storage and folders cleanly  
3. move the Hermes package sequence into the machine in order  
4. create the first working repo shell  
5. stand up the first Hermes workspace  
6. verify the install is healthy enough to continue building

---

## What success looks like by the end of install day

Install day is a success if all of the following are true:

- the Mac mini is updated and named
- external drives are labeled and mounted intentionally
- the Hermes package files are copied into an organized build folder
- the repo opens locally
- the database schema is available
- the Hermes routes load in the browser
- the system can be extended the following day without confusion

That is enough.

You do **not** need to complete:
- final router/network security setup
- all provider integrations
- all auth wiring
- full production deployment

---

# PART 1 — BEFORE YOU TOUCH THE MAC MINI

## 1. Gather hardware

Have these ready:

- Mac mini
- power cable
- monitor
- keyboard
- mouse or trackpad
- internet access
- your external SSDs
- your Hermes package zip files / extracted folders
- any passwords you need for Apple ID, GitHub, OpenAI, Anthropic, etc.

---

## 2. Keep this install order in mind

Today’s order should be:

1. boot Mac mini
2. update macOS
3. name machine
4. mount and name drives
5. install basic tools
6. create folder structure
7. copy Hermes package files
8. create repo
9. add schema + source files
10. run local app
11. smoke test Hermes routes

Do **not** start by randomly copying files everywhere.

---

# PART 2 — FIRST BOOT OF THE MAC MINI

## 3. Power on the Mac mini

When the Mac mini starts:

- complete first-time Apple setup
- connect to internet
- sign in only to the accounts you need today
- skip optional extras that do not matter for development setup

---

## 4. Update macOS immediately

Before installing development tools:

- open **System Settings**
- go to **General**
- go to **Software Update**
- install all updates
- reboot if required

Do this first so you are not debugging toolchain issues caused by outdated macOS.

---

## 5. Rename the Mac mini

Set a clear machine name.

Suggested:
- `OpenClaw-MacMini`
- or `Obseshn-MacMini-01`

Path:
- **System Settings**
- **General**
- **About**
- **Name**

---

# PART 3 — EXTERNAL DRIVE SETUP

## 6. Connect your external drives

Plug in the drives you want to use for this first phase.

Your storage strategy should stay intentional.

Suggested high-level use:

- one main external SSD for project workspace / repos / models if needed later
- one backup-oriented SSD for raw backups or system backup
- keep internal storage from getting cluttered early

---

## 7. Rename drives clearly

Open **Disk Utility** and rename drives with purpose-based names.

Example naming:

- `OPENCLAW_WORK`
- `OPENCLAW_BACKUP`
- `RAW_DATA_BACKUP`
- `SYSTEM_RECOVERY`

Avoid generic names like:
- Untitled
- ExternalSSD
- NewDrive

You want future-you to instantly know what each drive is for.

---

## 8. Choose your active workspace drive

Decide now where the Hermes/OpenClaw repo will live.

Recommended:
- keep active project workspace on your main external working SSD
- keep backups elsewhere
- avoid scattering project files across desktop, downloads, documents, and multiple drives

---

# PART 4 — BASIC DEVELOPMENT TOOL INSTALL

## 9. Install Homebrew

Open Terminal and install Homebrew.

After install, verify with:

```bash
brew --version
```

---

## 10. Install Git

If Git is not already available:

```bash
brew install git
git --version
```

---

## 11. Install Node.js

Recommended:
- install an LTS version

Example with Homebrew:

```bash
brew install node
node -v
npm -v
```

---

## 12. Install a code editor

Recommended:
- VS Code if you want fast setup

Verify it opens correctly and can access your project folders.

---

## 13. Optional but useful on install day

Install these if you want them on day one:

```bash
brew install tree
brew install wget
brew install jq
```

These are not mandatory, but they help.

---

# PART 5 — CREATE THE MASTER FOLDER STRUCTURE

## 14. Create your top-level workspace folder

On the chosen workspace drive, create a clean master folder.

Suggested:

```text
/OPENCLAW_WORK/OpenClaw_Build/
```

Inside that, create:

```text
/OpenClaw_Build/
  /01_Hermes/
  /02_Ozzy/
  /03_OpenClaw/
  /04_Visual_Office/
  /05_Inventory/
  /06_Security/
  /07_Backups/
  /08_Docs/
  /09_Repo/
```

For today, the most important folders are:

- `01_Hermes`
- `08_Docs`
- `09_Repo`

---

## 15. Copy the Hermes numbered packages into the build folder

Move all your downloaded Hermes package zip files and/or extracted files into:

```text
/OpenClaw_Build/01_Hermes/
```

Keep the numbered order intact.

Do not rename the numbered package files.

---

# PART 6 — UNPACK AND ORGANIZE HERMES FILES

## 16. Extract the Hermes package zips

Inside `01_Hermes`, extract the downloaded Hermes packages.

You should now have the numbered files available in sequence.

Examples include:

- `01_hermes_ui_spec.md`
- `05_hermes_full_schema_production.sql`
- `09_hermes_api_route_handlers.ts`
- `19_hermes_session_workspace.tsx`
- `30_hermes_layout.tsx`
- `40_hermes_layout_wrapper.tsx`

---

## 17. Verify the sequence before moving on

Make sure the package set is present in order.

At minimum you want access to:

- docs/spec files
- schema SQL
- service/API files
- UI component files
- wrapper/layout files
- merge plan and checklist

If something is missing, stop and correct that before continuing.

---

# PART 7 — CREATE THE REPO

## 18. Create the initial repo folder

Inside:

```text
/OpenClaw_Build/09_Repo/
```

create the repo folder.

Suggested:

```text
/openclaw-hermes/
```

Then initialize:

```bash
cd /path/to/OpenClaw_Build/09_Repo/openclaw-hermes
git init
```

---

## 19. Create the app skeleton

If starting fresh with Next.js, initialize the app.

Use your preferred method, but the goal is:

- TypeScript
- App Router
- Tailwind if possible

After creation, verify the app runs once before adding Hermes files.

Example:

```bash
npm install
npm run dev
```

Open local browser and confirm the base app loads.

---

# PART 8 — BUILD THE TARGET REPO STRUCTURE

## 20. Create the repo target folders

Inside the repo, create:

```text
app/
  hermes/
    approvals/
    conflicts/
    memory/
    sessions/
      [id]/

src/
  generated/
    hermes/

db/
  migrations/

docs/
  hermes/
```

---

## 21. Copy Hermes files into the correct target folders

### Copy docs into:

```text
docs/hermes/
```

### Copy SQL into:

```text
db/migrations/
```

### Copy TS/TSX generated code into:

```text
src/generated/hermes/
```

This is where your numbered files should live initially.

---

# PART 9 — DATABASE SETUP

## 22. Prepare PostgreSQL

If PostgreSQL is already available, use your development database.

If not, install or stand up a local development database before continuing.

You only need a development DB on install day.

---

## 23. Run the Hermes schema

Run:

- `05_hermes_full_schema_production.sql`

Optional:
- `08_hermes_sample_records.sql`

Confirm the key tables exist:

- `hermes_sessions`
- `hermes_questions`
- `hermes_answers`
- `hermes_extractions`
- `hermes_rules`
- `hermes_memory_packets`
- `agent_memory_bindings`

---

# PART 10 — APP ROUTER MOUNTING

## 24. Mount the Hermes layout

Create:

```text
app/hermes/layout.tsx
```

Use the generated wrapper:

- `40_hermes_layout_wrapper.tsx`

---

## 25. Mount the Hermes dashboard

Create:

```text
app/hermes/page.tsx
```

Use:
- `41_hermes_dashboard_page_wrapper.tsx`

---

## 26. Mount the approvals page

Create:

```text
app/hermes/approvals/page.tsx
```

Use:
- `36_hermes_approvals_page_wrapper.tsx`

---

## 27. Mount the conflicts page

Create:

```text
app/hermes/conflicts/page.tsx
```

Use:
- `37_hermes_conflicts_page_wrapper.tsx`

---

## 28. Mount the memory page

Create:

```text
app/hermes/memory/page.tsx
```

Use:
- `38_hermes_memory_page_wrapper.tsx`

---

## 29. Mount the session page

Create:

```text
app/hermes/sessions/[id]/page.tsx
```

Use:
- `35_hermes_session_page.tsx`

---

# PART 11 — IMPORT CLEANUP

## 30. Fix import paths

Because the files were generated in numbered packages, you will likely need to fix import paths.

Best practice:
switch to repo alias imports once the files are copied.

Example:

```tsx
import HermesDashboardPage from "@/generated/hermes/32_hermes_dashboard_page";
```

Do this instead of living forever with fragile relative paths.

---

## 31. Check client/server boundaries

Confirm that files using hooks or browser behavior include:

```tsx
"use client";
```

Examples likely needing that:
- UI components
- hook files
- interactive pages

Route wrappers often do not need it unless they directly use client behavior.

---

# PART 12 — FIRST RUN

## 32. Start the app

Run:

```bash
npm run dev
```

Open the local browser.

---

## 33. Visit these routes in order

1. `/hermes`
2. `/hermes/approvals`
3. `/hermes/conflicts`
4. `/hermes/memory`
5. `/hermes/sessions/test-session`

This is your first real smoke test.

---

## 34. What you are checking

At this stage, check for:

- no import crashes
- pages render
- sidebar navigation loads
- layout wraps pages correctly
- session workspace appears
- approval queue appears
- conflict page appears
- memory page appears

It is okay if not every endpoint is fully wired yet.

The main goal is structural success.

---

# PART 13 — FIRST FUNCTIONAL TEST

## 35. Test a session answer submission

In the session workspace:

- type an answer
- submit it
- confirm the extraction preview appears
- confirm follow-up prompts appear

If this fails:
- inspect API route imports
- inspect service layer wiring
- inspect client fetch path

---

## 36. Test the approval flow

Open approvals page.

Confirm:
- approval cards render
- action buttons respond
- no fatal route errors occur

---

## 37. Test the memory page

Open memory page.

Confirm:
- the page loads
- packet cards render or fail cleanly
- no layout breaks happen

---

# PART 14 — KNOWN LIMITATIONS ON INSTALL DAY

## 38. Remember what is still placeholder

Your current Hermes build still includes early-stage pieces that must later be upgraded.

Especially:

- `10_hermes_service_layer.ts` uses placeholder in-memory persistence
- some GET endpoints may still need completion
- approval identity is not fully production-auth wired
- conflict resolution may still need backend endpoints if not yet implemented

This is okay for install day.

Do not confuse “working scaffold” with “finished production system.”

---

# PART 15 — END OF DAY WRAP-UP

## 39. Save your progress in three places

Before ending the day:

1. save repo changes locally
2. copy repo folder to backup drive
3. keep the original numbered Hermes package folder intact

Do not rely on only one copy.

---

## 40. Write a short install-day note

At the end of setup, write a short note with:

- what worked
- what broke
- what import paths you changed
- which routes loaded
- what the next blocking issue is

Save this note in:

```text
/OpenClaw_Build/08_Docs/
```

Name suggestion:

```text
hermes_install_day_notes_YYYY-MM-DD.md
```

---

# PART 16 — NEXT WEEK WHEN THE UBIQUITI ARRIVES

## 41. Keep the network phase separate

When the Ubiquiti Dream Machine Pro Max arrives and you install it next week, treat that as a separate phase.

That phase should cover:

- network segmentation
- secure routing
- device naming
- firewall posture
- Wi‑Fi structure
- future remote access rules
- security hardening for the Mac mini environment

Do not overload first Hermes install day with full network architecture work.

---

# FINAL INSTALL DAY SUMMARY

## Your install day order in one glance

1. update Mac mini  
2. name machine  
3. label drives  
4. install Homebrew / Git / Node / editor  
5. create `OpenClaw_Build` structure  
6. move Hermes numbered files into `01_Hermes`  
7. create repo in `09_Repo`  
8. create repo folders  
9. copy docs / SQL / code into proper targets  
10. run schema  
11. mount Hermes routes  
12. fix imports  
13. run dev server  
14. test Hermes routes  
15. save notes and backups  

---

## Bottom line

Once you initiate the Hermes install, your job is not to perfect everything.

Your job is to create a **clean first working Hermes workspace** on the Mac mini with the least confusion possible.

That is the right win for install day.
