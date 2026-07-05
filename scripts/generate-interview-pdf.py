#!/usr/bin/env python3
"""Generate simple beginner-friendly Sitewire interview notes PDF."""

from pathlib import Path
from fpdf import FPDF

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "Sitewire-Interview-Notes.pdf"


class NotesPDF(FPDF):
    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

    def h1(self, text: str):
        self.ln(3)
        self.set_font("Helvetica", "B", 16)
        self.set_text_color(10, 10, 10)
        self.multi_cell(0, 8, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def h2(self, text: str):
        self.ln(4)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(20, 20, 20)
        self.multi_cell(0, 7, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def p(self, text: str):
        self.set_font("Helvetica", "", 11)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 6, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def bullet(self, text: str):
        self.set_font("Helvetica", "", 11)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 6, f"  - {text}", new_x="LMARGIN", new_y="NEXT")

    def numbered(self, n: int, text: str):
        self.set_font("Helvetica", "", 11)
        self.multi_cell(0, 6, f"{n}. {text}", new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def qa(self, q: str, a: str):
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(20, 20, 20)
        self.multi_cell(0, 6, q, new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 11)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 6, a, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)


def build_pdf() -> None:
    pdf = NotesPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_margins(16, 16, 16)
    pdf.add_page()

    pdf.h1("Sitewire Interview Notes")
    pdf.p("Simple guide to explain every file in your app.")
    pdf.p("Read this on your phone before the interview.")

    pdf.h2("What does the app do?")
    pdf.p(
        "It shows a table of users from an API. For each user it also fetches "
        "their last login time and IP address."
    )
    pdf.p(
        "The API is unreliable - about 1 in 4 requests fail, and some are slow. "
        "The app handles loading, success, and error states clearly."
    )
    pdf.p("Core: ID, name, email, last login time, last login IP, total user count.")
    pdf.p("Bonus: friendly dates, country from IP, highlight inactive users.")

    pdf.h2("How to demo (say this on the call)")
    demo = [
        "Open Dashboard - table shows first, login info loads row by row",
        "Point at status banner - user count + login progress (45/100)",
        "Show a Failed to load row if you see one - one user failing does not break the page",
        "Open Load log - step-by-step timeline of what happened",
        "Switch to Core + Bonus tab - show friendly dates, country, inactive highlighting",
        "If they ask about code - open hooks/useEnrichedUsers.ts first",
    ]
    for i, step in enumerate(demo, 1):
        pdf.numbered(i, step)

    pdf.h2("The story of one page load")
    story = [
        "App opens. useEnrichedUsers runs automatically.",
        "Ask API for all users. If that fails - show error + Retry button.",
        "Users arrive - show table immediately. Login cells say Loading...",
        "Fetch logins for 15 users at a time (not all 100 at once).",
        "For each user: get logins, pick newest, look up country, update that row.",
        "Repeat until done.",
    ]
    for i, step in enumerate(story, 1):
        pdf.numbered(i, step)

    pdf.add_page()
    pdf.h1("Every file explained")

    files = [
        (
            "index.html",
            "The empty webpage. Has a div called root where React draws the app. "
            "Loads main.tsx as a script.",
            "Think of it as an empty picture frame.",
        ),
        (
            "src/main.tsx",
            "Entry point - first code that runs. Finds the root div and puts the App component inside it.",
            "main.tsx bootstraps the app.",
        ),
        (
            "src/App.tsx",
            "Boss component. Controls tabs (Core/Bonus, Explain/Dashboard/Load log). "
            "Calls useEnrichedUsers for data and useEventLog for the timeline.",
            "App.tsx is layout and tabs. Data logic is in the hook.",
        ),
        (
            "src/types.ts",
            "Describes data shapes. User = basic info. EnrichedUser = User + login fields + status. "
            "LoginStatus = loading, success, or error per row.",
            "EnrichedUser is what each table row uses.",
        ),
        (
            "src/types/events.ts",
            "Types for the Load log events (batch started, batch done, etc). Demo helper only.",
            "Only used for the Load log walkthrough tab.",
        ),
        (
            "src/api/client.ts",
            "fetchWithRetry - sends requests to the API. On 500 error: wait 500ms, retry up to 3 times.",
            "Handles the flaky API the challenge describes.",
        ),
        (
            "src/api/users.ts",
            "Two functions: getUsers() and getUserLogins(id). Thin wrapper around API endpoints.",
            "Just the two API calls the challenge needs.",
        ),
        (
            "src/api/geo.ts",
            "Bonus. Turns IP into country using ipwho.is. Caches results so same IP is not looked up twice.",
            "Geo failure shows dash, does not break the row.",
        ),
        (
            "src/hooks/useEnrichedUsers.ts",
            "THE BRAIN. Loads users, then logins in batches of 15. Updates each row. "
            "Uses fetchIdRef so old requests are ignored on Retry.",
            "Start here when they say walk me through the code.",
        ),
        (
            "src/hooks/useEventLog.ts",
            "Records timeline events for Load log tab. beginRecording, recordEvent, copyNotes.",
            "Helps me demo what the app is doing step by step.",
        ),
        (
            "src/utils/login.ts",
            "getMostRecentLogin - finds newest login (API does not sort). "
            "formatLoginTimeHumanized - 3 months ago. isInactiveOverOneMonth - for bonus highlighting.",
            "Small pure functions, easy to test.",
        ),
        (
            "src/components/StatusBanner.tsx",
            "Box above table. Shows Loading users, or error + Retry, or user count + login progress.",
            "Global state for the /users call.",
        ),
        (
            "src/components/UserTable.tsx",
            "Draws the table headers and one UserRow per user. Core vs bonus variant toggles columns.",
            "Just the table structure.",
        ),
        (
            "src/components/UserRow.tsx",
            "One table row. Shows Loading, Failed to load, or actual data based on loginStatus.",
            "Per-row state - this is partial success.",
        ),
        (
            "src/components/LoadLogPanel.tsx",
            "Load log tab UI - progress bar, event list, copy button.",
            "Great for explaining async flow on the call.",
        ),
        (
            "src/components/CoreTaskExplain.tsx",
            "Explain tab for core task - requirements summary and live stats.",
            "Built-in cheat sheet during demo.",
        ),
        (
            "src/components/BonusTaskExplain.tsx",
            "Explain tab for bonus features.",
            "Shows what the 3 bonuses do.",
        ),
        (
            "src/components/ExplainSectionCard.tsx",
            "Reusable titled box for explain panels. Just UI wrapper.",
            "No logic - keeps panels consistent.",
        ),
        (
            "src/App.css and src/index.css",
            "Styling - colors, tabs, table, banners. Challenge said do not focus on polish.",
            "Just makes it readable.",
        ),
    ]

    for filename, what, say in files:
        pdf.h2(filename)
        pdf.p(f"What it does: {what}")
        pdf.p(f"Say in interview: {say}")

    pdf.add_page()
    pdf.h1("If they ask...")
    qa = [
        (
            "Why batches of 15?",
            "100 requests at once would overwhelm a flaky API. Batches let rows fill in gradually so the user sees progress.",
        ),
        (
            "/users fails vs one login fails?",
            "/users fail = whole page error. One login fail = just that row shows Failed to load.",
        ),
        (
            "How find most recent login?",
            "Loop and compare dates. API sends logins in random order.",
        ),
        (
            "What is a hook?",
            "A React function that holds state and logic. useEnrichedUsers holds users and the load function.",
        ),
        (
            "What is fetchIdRef?",
            "A counter bumped on each reload. Old network responses check it and ignore themselves if stale.",
        ),
        (
            "Why not React Query?",
            "Small app - wanted retry and batch logic visible. In production I would use a library.",
        ),
    ]
    for q, a in qa:
        pdf.qa(q, a)

    pdf.ln(4)
    pdf.set_font("Helvetica", "I", 11)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 6, "Good luck tomorrow!", align="C")

    pdf.output(str(OUTPUT))
    print(f"PDF written to {OUTPUT}")


if __name__ == "__main__":
    build_pdf()
