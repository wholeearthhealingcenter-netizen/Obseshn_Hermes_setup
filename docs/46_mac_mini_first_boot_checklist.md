
# 46_mac_mini_first_boot_checklist.md

# Mac Mini First Boot Checklist (30–60 Minutes)
**Purpose:** Quick, printable checklist for initial setup before Hermes install.

---

## ✅ SUCCESS TARGET (END OF FIRST HOUR)

- Mac mini powered on and updated  
- Machine named  
- Drives connected and labeled  
- Basic dev tools installed  
- Workspace folder created  

---

# 🔌 STEP 1 — POWER + BASIC SETUP (10–15 min)

☐ Plug in Mac mini (power, monitor, keyboard, mouse)  
☐ Power on  
☐ Connect to internet  
☐ Complete Apple setup (skip non-essential extras)  
☐ Sign in to Apple ID (only if needed today)  

---

# 🔄 STEP 2 — UPDATE MACOS (10–20 min)

☐ Open **System Settings**  
☐ Go to **General → Software Update**  
☐ Install all updates  
☐ Restart if required  

---

# 🏷️ STEP 3 — NAME THE MACHINE (2 min)

☐ Go to **System Settings → General → About**  
☐ Set name:

Example:
- `OpenClaw-MacMini`
- `Obseshn-MacMini-01`

---

# 💾 STEP 4 — CONNECT & LABEL DRIVES (10 min)

☐ Plug in external SSDs  
☐ Open **Disk Utility**  
☐ Rename drives clearly:

Examples:
- `OPENCLAW_WORK`
- `OPENCLAW_BACKUP`
- `RAW_DATA_BACKUP`

☐ Decide which drive is your **main workspace**

---

# 🛠️ STEP 5 — INSTALL CORE TOOLS (10–15 min)

Open Terminal:

### Install Homebrew
☐ Install Homebrew  
☐ Verify:
```bash
brew --version
```

### Install Git
☐ Install Git  
☐ Verify:
```bash
git --version
```

### Install Node.js
☐ Install Node  
☐ Verify:
```bash
node -v
npm -v
```

---

# 📁 STEP 6 — CREATE WORKSPACE (5 min)

On your main workspace drive:

☐ Create folder:

```text
/OPENCLAW_WORK/OpenClaw_Build/
```

☐ Inside create:

```text
01_Hermes
08_Docs
09_Repo
```

---

# 📦 STEP 7 — MOVE HERMES FILES (5–10 min)

☐ Copy Hermes package files into:

```text
/OpenClaw_Build/01_Hermes/
```

☐ Do NOT rename numbered files  
☐ Keep sequence intact  

---

# 🚀 DONE (FIRST BOOT COMPLETE)

If you reached this point, you are ready for:

👉 **Full Hermes install sequence (README 45)**

---

# ⚠️ DO NOT DO YET

Avoid these during first boot:

☐ Full network configuration  
☐ Ubiquiti setup  
☐ Deep security configuration  
☐ Model installs (Ollama, etc.)  
☐ Complex repo wiring  

Keep first boot clean and fast.

---

# 🧠 REMEMBER

This phase is about:

✔ Clean foundation  
✔ Correct structure  
✔ No clutter  

Not perfection.

---

# ✔️ FINAL CHECK

☐ Mac updated  
☐ Machine named  
☐ Drives labeled  
☐ Tools installed  
☐ Workspace created  
☐ Hermes files copied  

👉 You are ready to begin Hermes install.
