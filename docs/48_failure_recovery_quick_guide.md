
# 48_failure_recovery_quick_guide.md

# 🧯 FAILURE RECOVERY QUICK GUIDE (INSTALL DAY)

**Use this when something breaks. Do not guess. Identify → isolate → fix.**

---

## 🔎 FIRST RULE (ALWAYS)

☐ Read the error message fully  
☐ Identify: **type** (build / runtime / network / DB)  
☐ Identify: **file + line**  
☐ Fix ONE issue at a time  

---

# 🧱 ISSUE TYPE 1 — IMPORT ERRORS

## Symptoms

- “Cannot find module…”
- “Module not found…”
- Red screen on page load

## Fix Checklist

☐ Check file path is correct  
☐ Confirm file exists in that location  
☐ Fix relative path (`../../`)  

### Preferred fix (better long-term)

Switch to alias:

```ts
@/generated/hermes/...
```

☐ Restart dev server:

```bash
npm run dev
```

---

# ⚠️ ISSUE TYPE 2 — NEXT.JS ROUTE CRASH

## Symptoms

- Blank page
- 500 error
- “Unhandled Runtime Error”

## Fix Checklist

☐ Check browser console  
☐ Check terminal output  
☐ Confirm correct file in:

```text
app/hermes/...
```

☐ Confirm default export exists:

```ts
export default function Page() { ... }
```

☐ Confirm correct `"use client"` usage

---

# 🔥 ISSUE TYPE 3 — "use client" ERRORS

## Symptoms

- “Hooks cannot be used in server components”
- Hydration errors

## Fix

Add to top of file:

```ts
"use client";
```

Only for:
- components with state
- hooks
- browser interactions

---

# 🧩 ISSUE TYPE 4 — API NOT WORKING

## Symptoms

- fetch fails
- 404 or 500 from API
- no data returning

## Fix Checklist

☐ Check route path matches:

```ts
/api/hermes/...
```

☐ Check route file exists  
☐ Check handler method (GET / POST)  
☐ Log inside route:

```ts
console.log("API HIT");
```

☐ Restart server  

---

# 🗄️ ISSUE TYPE 5 — DATABASE ERRORS

## Symptoms

- “relation does not exist”
- query failures
- empty results

## Fix Checklist

☐ Confirm schema ran:

- 05_hermes_full_schema_production.sql  

☐ Check table names exactly match  

☐ Check DB connection string  

☐ Try simple query manually  

---

# 🧠 ISSUE TYPE 6 — SERVICE LAYER BUGS

## Symptoms

- logic fails silently  
- data not saving  
- unexpected output  

## Key Reminder

👉 `10_hermes_service_layer.ts` is **placeholder-based**

## Fix

☐ Check if using in-memory logic  
☐ Add logs inside functions  
☐ Replace with real DB calls if needed  

---

# 🧪 ISSUE TYPE 7 — UI NOT RENDERING DATA

## Symptoms

- page loads but empty  
- components show placeholders  

## Fix Checklist

☐ Check API returned data  
☐ Add console.log in component  
☐ Confirm hook is running  

Example:

```ts
console.log(data);
```

---

# 🧨 ISSUE TYPE 8 — BUILD FAILS

## Symptoms

- `npm run dev` fails  
- compile errors  

## Fix Checklist

☐ Read first error only  
☐ Ignore cascading errors  
☐ Fix syntax issues first  
☐ Restart dev server  

---

# 🔁 QUICK RESET (WHEN STUCK)

If things feel messy:

```bash
ctrl + c
npm run dev
```

Still broken?

☐ Close editor  
☐ Reopen project  
☐ Restart dev server  

---

# 🧠 DEBUG FLOW (USE THIS ORDER)

1. Read error  
2. Find file  
3. Check import  
4. Check route  
5. Check API  
6. Check DB  
7. Add logs  
8. Restart  

---

# ⚠️ COMMON TRAPS

☐ Changing too many things at once  
☐ Guessing instead of reading errors  
☐ Breaking working code to fix something else  
☐ Forgetting to restart server  

---

# 💡 GOLD RULE

👉 If it worked before, go back to the last working state.

---

# 🏁 FINAL RECOVERY CHECK

☐ Dev server runs  
☐ Pages load  
☐ No red errors  
☐ Basic flow works  

👉 Continue build

---

# 🧠 MINDSET

You are not stuck.

You are:

✔ one error away  
✔ one fix away  
✔ one restart away  

Keep moving.
