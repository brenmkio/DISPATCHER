# SETUP.md
## How to Start a New Project from This Template

This is your personal checklist for getting from 0 → 80% on a new project.

---

## Step 1: Copy the Template (2 minutes)

### Option A: Command Line
```bash
cp -r ~/TEMPLATE ~/your-project-name
cd ~/your-project-name
```

### Option B: Finder/GUI
1. Duplicate the `TEMPLATE/` folder
2. Rename it to your project name
3. Open it in Windsurf

---

## Step 2: Initialize the Project (2 minutes)

Open the terminal in Windsurf and run:

```bash
# Clean any existing corrupted dependencies (IMPORTANT)
rm -rf node_modules package-lock.json
# Install dependencies
npm install

# Initialize git (fresh repo, not inherited from template)
git init
git add .
git commit -m "Initial commit from template"

# Verify it works
npm run dev
```

**Checkpoint:** Open `localhost:5173` - you should see the template homepage.

If it doesn't work, something's wrong with the template. Fix it before proceeding.

git remote add origin https://github.com/brenmkio/your-project-name.git
git branch -M main
git push -u origin main --force

---

## Step 3: Start Cascade with the Startup Prompt (5 minutes)

Open Cascade (Cmd/Ctrl + L) and paste:

```
Read PROJECT_GUIDE.md. This is a new project.

Project description:
[Paste your full project description here - the more detail, the better]

Start Phase 1: Conceptual Alignment.
```

**What should happen:**
- Agent asks you 5-10 clarifying questions
- You answer them
- Agent creates ARCHITECTURE.md
- Agent waits for your approval

**Review ARCHITECTURE.md carefully.** This is your last chance to catch misunderstandings before code gets written.

---

## Step 4: Approve Architecture & Scaffold (5 minutes)

Once ARCHITECTURE.md looks good, tell Cascade:

```
Approved. Proceed to Phase 2: Scaffolding.
```

**What should happen:**
- Agent sets up PROGRESS.md with tasks
- Agent commits: "feat: scaffold project structure"
- Agent asks which feature to implement first

**Review the folder structure.** Does it make sense? If not, ask the agent to reorganize before implementing features.

---

## Step 5: Iterative Development (hours to days)

For each feature, follow this loop:

```
You: "Implement [feature name]"
Agent: Builds it, updates PROGRESS.md, commits
You: Test locally (npm run dev)
You: Either "Great, next task" OR "Fix this: [issue]"
```

**Key practices:**
- ✅ Test after every feature (don't let untested work pile up)
- ✅ Check PROGRESS.md regularly to see what's done
- ✅ Commit messages should be clear (agent handles this)
- ✅ If you get confused, ask: "What should we work on next?"

**When to stop Phase 5:**
When you hit 80% of your vision - the core features work, even if rough around the edges.

---

## Step 6: Connect to Hosting (10 minutes)

### Vercel Deployment

**Option A: Through Website (easier)**
1. Go to [vercel.com](https://vercel.com), log in
2. Click "Add New Project"
3. Import from GitHub (or drag/drop your project folder)
4. Vercel auto-detects SvelteKit
5. Click "Deploy"
6. Get your live URL: `your-project-name.vercel.app`

**Option B: Through CLI (faster once you know it)**
```bash
npm i -g vercel      # One-time install
vercel               # Follow prompts
```

**What this does:** Every time you `git push`, Vercel auto-redeploys your app.

---

## Step 7: Add Database (if needed, 10 minutes)

### Supabase Setup

1. Go to [supabase.com](https://supabase.com), log in
2. Create new project: "your-project-name"
3. Copy your API keys from Settings → API
4. Create `.env` file in your project root:
```bash
PUBLIC_SUPABASE_URL=https://xyz.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

5. Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

6. Install Supabase:
```bash
npm install @supabase/supabase-js
```

**Remember:** `.env` is in `.gitignore` - never commit your API keys!

---

## Step 8: Push to GitHub (optional but recommended)

### Option A: Using GitHub CLI
```bash
gh repo create your-project-name --public --source=. --remote=origin --push
```

### Option B: Using GitHub Website
1. Go to [github.com](https://github.com), create new repo
2. Follow their instructions to push your local code
3. Usually something like:
```bash
git remote add origin https://github.com/yourusername/your-project-name.git
git branch -M main
git push -u origin main
```

**Why do this:**
- Backs up your code
- Enables collaboration
- Connects to Vercel for auto-deploys on push

---

## Daily Development Workflow

Once you're past setup, your daily ritual is simple:

```bash
# Start the day
npm run dev              # Start local server

# Work with Cascade
[Build features iteratively as described in Step 5]

# End of session
git add .
git commit -m "feat: added X and Y features"
git push                 # Auto-deploys to Vercel if connected
```

---

## Common Issues & Fixes

### "npm run dev" won't start
- Check if another project is using port 5173
- Try `npm install` again
- Check for errors in the terminal

### Agent ignoring PROJECT_GUIDE.md
- Make sure you said "Read PROJECT_GUIDE.md" in your first message
- Try starting a new Cascade conversation
- Check if PROJECT_GUIDE.md exists in the project root

### Agent not updating PROGRESS.md
- Explicitly remind it: "Update PROGRESS.md"
- Check .windsurfrules includes PROGRESS.md rules
- Make sure PROGRESS.md exists

### Vercel deployment failing
- Check the build logs in Vercel dashboard
- Common issue: Missing environment variables (add in Vercel settings)
- Try deploying locally first: `vercel --prod`

---

## Quick Reference: Key Commands

```bash
# Starting a project
cp -r template-folder new-project-folder
cd new-project-folder
npm install
npm run dev

# Daily development
npm run dev              # Start local server
git add .                # Stage changes
git commit -m "message"  # Save snapshot
git push                 # Deploy (if connected)

# Deployment
vercel                   # Deploy to Vercel
gh repo create           # Push to GitHub
```

---

## Remember:

**This template is meant to save you time on scaffolding, not constrain your creativity.**

If you want to deviate from the structure, do it! The template is a starting line, not a finish line.

The goal is: **get to 80% as fast as possible so you can spend time on the interesting 20%.**

---

## After Your First Project

Once you've used this template successfully:
1. Note what worked well
2. Note what was confusing or annoying
3. Update PROJECT_GUIDE.md and .windsurfrules based on learnings
4. Your template gets better with each project

This is a **living system** - it should evolve as you learn what works for you.