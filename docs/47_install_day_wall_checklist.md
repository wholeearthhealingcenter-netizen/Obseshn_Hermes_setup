
# 47_install_day_wall_checklist.md

# 🚀 OPENCLAW + HERMES INSTALL DAY (WALL CHECKLIST)

**Use this as your single-sheet guide. Do not overthink. Follow top → bottom.**

---

## 🎯 END GOAL (TODAY)

☐ Mac mini fully prepped  
☐ Workspace clean + organized  
☐ Hermes files in repo  
☐ App runs locally  
☐ /hermes routes load  

👉 That’s a win. Not perfection.

---

# ⚡ PHASE 1 — FIRST BOOT (0–60 MIN)

☐ Power on Mac mini  
☐ Connect internet  
☐ Complete Apple setup (skip extras)  

☐ Update macOS (**System Settings → Software Update**)  
☐ Restart if needed  

☐ Rename machine  
→ `OpenClaw-MacMini`  

☐ Plug in SSDs  
☐ Rename drives:
- OPENCLAW_WORK
- OPENCLAW_BACKUP

☐ Choose **main workspace drive**

---

# ⚡ PHASE 2 — CORE TOOLS (60–90 MIN)

Open Terminal:

☐ Install Homebrew  
☐ Install Git  
☐ Install Node.js  

Verify:

```bash
brew --version
git --version
node -v
npm -v
```

☐ Install VS Code (or editor)

---

# ⚡ PHASE 3 — FOLDER STRUCTURE (90–120 MIN)

On workspace drive:

```text
/OpenClaw_Build/
```

Create:

```text
01_Hermes
08_Docs
09_Repo
```

---

# ⚡ PHASE 4 — HERMES FILES (120–150 MIN)

☐ Copy ALL Hermes packages → `01_Hermes/`  
☐ Extract files  
☐ KEEP NUMBER ORDER  

✔ Do NOT rename anything yet  

---

# ⚡ PHASE 5 — CREATE REPO (150–180 MIN)

```bash
cd /OpenClaw_Build/09_Repo
mkdir openclaw-hermes
cd openclaw-hermes
git init
```

☐ Create Next.js app  
☐ Run:

```bash
npm install
npm run dev
```

☐ Confirm base app loads  

---

# ⚡ PHASE 6 — REPO STRUCTURE

Create inside repo:

```text
app/hermes/
src/generated/hermes/
db/migrations/
docs/hermes/
```

---

# ⚡ PHASE 7 — COPY FILES INTO REPO

☐ Docs → `docs/hermes/`  
☐ SQL → `db/migrations/`  
☐ TS/TSX → `src/generated/hermes/`  

---

# ⚡ PHASE 8 — DATABASE

☐ Run:

- 05_hermes_full_schema_production.sql  
- (optional) sample data  

☐ Confirm tables exist  

---

# ⚡ PHASE 9 — ROUTE MOUNT

Create:

```text
app/hermes/layout.tsx
app/hermes/page.tsx
app/hermes/approvals/page.tsx
app/hermes/conflicts/page.tsx
app/hermes/memory/page.tsx
app/hermes/sessions/[id]/page.tsx
```

Use wrapper files:

- 40 (layout)
- 41 (dashboard)
- 36 (approvals)
- 37 (conflicts)
- 38 (memory)
- 35 (session)

---

# ⚡ PHASE 10 — FIX IMPORTS

☐ Fix broken imports  
☐ Prefer alias:

```tsx
@/generated/hermes/...
```

☐ Add `"use client"` where needed  

---

# ⚡ PHASE 11 — FIRST RUN

```bash
npm run dev
```

Open:

- /hermes  
- /hermes/approvals  
- /hermes/conflicts  
- /hermes/memory  
- /hermes/sessions/test-session  

---

# ⚡ PHASE 12 — TEST CORE FLOW

☐ Submit answer in session  
☐ See extraction preview  
☐ Open approvals page  
☐ Open memory page  

---

# ⚠️ IGNORE TODAY

☐ Ubiquiti setup  
☐ Security hardening  
☐ Local AI models  
☐ Full integrations  
☐ Perfect architecture  

---

# 💾 END OF DAY

☐ Save repo  
☐ Backup to second drive  
☐ Write notes:

```text
/OpenClaw_Build/08_Docs/
hermes_install_day_notes.md
```

---

# 🧠 RULE FOR THE DAY

👉 **Clarity > completeness**

If it runs, you win.

---

# 🔥 FINAL CHECK

☐ Mac ready  
☐ Files organized  
☐ Repo running  
☐ Hermes UI visible  

👉 DONE
