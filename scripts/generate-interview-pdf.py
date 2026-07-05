#!/usr/bin/env python3
"""Generate mobile-friendly Sitewire interview notes PDF."""

from pathlib import Path
from fpdf import FPDF

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "Sitewire-Interview-Notes.pdf"


class NotesPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "I", 8)
            self.set_text_color(120, 120, 120)
            self.cell(0, 8, "Sitewire Interview Notes", align="R", new_x="LMARGIN", new_y="NEXT")
            self.ln(2)

    def footer(self):
        self.set_y(-12)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

    def section_title(self, title: str):
        self.ln(4)
        self.set_font("Helvetica", "B", 13)
        self.set_text_color(20, 20, 20)
        self.multi_cell(0, 7, title, new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(30, 30, 30)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(4)

    def sub_title(self, title: str):
        self.ln(2)
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 6, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def body_text(self, text: str):
        self.set_font("Helvetica", "", 10.5)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5.5, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def bullet(self, text: str):
        self.set_font("Helvetica", "", 10.5)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5.5, f"  - {text}", new_x="LMARGIN", new_y="NEXT")
        self.ln(0.5)

    def numbered(self, num: int, text: str):
        self.set_font("Helvetica", "", 10.5)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5.5, f"{num}. {text}", new_x="LMARGIN", new_y="NEXT")
        self.ln(0.5)

    def qa(self, question: str, answer: str):
        self.set_font("Helvetica", "B", 10.5)
        self.set_text_color(20, 20, 20)
        self.multi_cell(0, 5.5, question, new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 10.5)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 5.5, answer, new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def callout(self, text: str):
        self.set_fill_color(240, 247, 255)
        self.set_font("Helvetica", "", 10.5)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5.5, text, fill=True, new_x="LMARGIN", new_y="NEXT")
        self.ln(3)


def build_pdf() -> None:
    pdf = NotesPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_margins(14, 14, 14)
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(10, 10, 10)
    pdf.multi_cell(0, 9, "Sitewire Users Dashboard", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(80, 80, 80)
    pdf.multi_cell(
        0,
        6,
        "Interview walkthrough notes - Take-home coding challenge",
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(3)

    pdf.callout(
        "Interview format: Screen share, demo the app, walk through your code, and defend "
        "your technical choices. They expect you to understand everything - even if you used AI tools."
    )

    pdf.section_title("1. Demo script (~5 minutes)")
    pdf.body_text("Say this while clicking through the app:")
    for i, item in enumerate(
        [
            "Dashboard tab - Table appears first; login columns show 'Loading...'",
            "Watch rows fill in batch by batch (15 users at a time)",
            "Point to the status banner: total user count + 'Loading login data... (X/Y)'",
            "Show any failed row - per-row error; other rows still work (partial success)",
            "Load log tab - Walk through the event timeline with timestamps",
            "Core task + Bonus -> Dashboard - humanized dates, country column, inactive highlighting",
            "If asked about code: open hooks/useEnrichedUsers.ts first",
        ],
        1,
    ):
        pdf.numbered(i, item)

    pdf.section_title("2. Challenge recap")
    for item in [
        "API: https://fake-users-api.vercel.app",
        "~25% random 500 errors; latency ranges from ~10ms to 3s",
        "GET /users -> array of users",
        "GET /users/:id/relationships/logins -> login history per user",
        "Login arrays are UNSORTED - you must find the most recent login yourself",
        "Display: user ID, full name, email, last login time, last login IP, total user count",
        "They care about loading / error / partial-success states, not visual polish",
    ]:
        pdf.bullet(item)

    pdf.sub_title("Bonus tasks (you implemented all three)")
    for item in [
        "Country from last login IP",
        "Humanized login time ('3 months ago')",
        "Highlight users inactive for >= 1 month",
    ]:
        pdf.bullet(item)

    pdf.section_title("3. Tech stack")
    for item in [
        "React 19 + TypeScript + Vite",
        "date-fns - humanized dates + inactive-month check",
        "ipwho.is - free IP to country lookup",
        "Custom hooks only - no Redux / React Query (logic stays visible)",
    ]:
        pdf.bullet(item)

    pdf.section_title("4. File map - where to click in code")
    files = [
        ("hooks/useEnrichedUsers.ts", "START HERE. Main orchestration: users -> batched logins -> enrich rows"),
        ("api/client.ts", "fetchWithRetry - 3 retries, 500ms delay on 500/network errors"),
        ("api/users.ts", "getUsers() and getUserLogins(id)"),
        ("api/geo.ts", "getCountryForIp() with in-memory IP cache"),
        ("utils/login.ts", "Most recent login, date formatting, inactive check"),
        ("hooks/useEventLog.ts", "Records load events for the Load log demo tab"),
        ("components/UserRow.tsx", "Per-row loading / success / error UI"),
        ("components/StatusBanner.tsx", "User count, login progress, global error + Retry"),
        ("components/UserTable.tsx", "Table layout; core vs bonus column toggle"),
        ("types.ts", "User, EnrichedUser, LoginStatus"),
        ("App.tsx", "Tabs: Core / Bonus modes; Explain / Dashboard / Load log / Interview prep"),
    ]
    for path, desc in files:
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(30, 30, 30)
        pdf.multi_cell(0, 5.5, path, new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(60, 60, 60)
        pdf.multi_cell(0, 5.5, f"  {desc}", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(1)

    pdf.add_page()
    pdf.section_title("5. Data flow - explain this out loud")
    flow = [
        "App mounts -> useEnrichedUsers.load() runs automatically",
        "GET /users with retry. If all retries fail -> global error banner + Retry button. Table hidden.",
        "Users succeed -> table renders immediately. Every row has loginStatus: 'loading'.",
        "Batch loop - 15 users at a time. Each batch runs Promise.all on 15 parallel login requests.",
        "Per user in batch: fetch logins -> getMostRecentLogin() -> (bonus) geo lookup -> update row.",
        "After each batch: loginsLoaded increments -> progress bar and status banner update.",
        "Login failure for one user -> that row shows 'Failed to load'. Other rows unaffected.",
    ]
    for i, step in enumerate(flow, 1):
        pdf.numbered(i, step)

    pdf.section_title("6. Key technical decisions")

    pdf.sub_title("Retry logic (api/client.ts)")
    for item in [
        "Up to 3 retries (4 total attempts) per request",
        "500ms delay between attempts",
        "Retries on HTTP 500 and network errors",
        "Non-500 errors (e.g. 404) fail immediately - no pointless retries",
    ]:
        pdf.bullet(item)

    pdf.sub_title("Batching (size = 15)")
    for item in [
        "Limits concurrent requests so the flaky API isn't overwhelmed",
        "Enables progressive UI - rows fill in visibly, not all at once",
        "Balance: enough parallelism for speed, small enough for incremental feedback",
    ]:
        pdf.bullet(item)

    pdf.sub_title("Per-row error handling")
    for item in [
        "/users failure = global error (can't show the table)",
        "Single login failure = row-level error only ('Failed to load')",
        "This is partial success - exactly what the challenge asks for",
    ]:
        pdf.bullet(item)

    pdf.sub_title("Stale-load guard (fetchIdRef)")
    for item in [
        "Each load() increments a counter",
        "Async callbacks check the counter before updating state",
        "If user hits Retry mid-load, old in-flight responses are ignored",
    ]:
        pdf.bullet(item)

    pdf.sub_title("EnrichedUser type")
    for item in [
        "Extends User with login fields + loginStatus",
        "State machine: loading -> success | error",
        "Keeps row state co-located with user data - easy to render",
    ]:
        pdf.bullet(item)

    pdf.sub_title("Country IP cache (api/geo.ts)")
    for item in [
        "Many users may share the same IP",
        "Map<ip, country> avoids duplicate geo API calls",
        "Cache cleared on each full reload",
        "Geo failure is silent - row shows '-', doesn't break the load",
    ]:
        pdf.bullet(item)

    pdf.add_page()
    pdf.section_title("7. Bonus features - how they work")

    pdf.sub_title("Humanized login time")
    for item in [
        "formatDistanceToNow() from date-fns -> '3 months ago'",
        "title attribute on cell -> exact timestamp on hover/tap",
        "Core tab shows raw timestamps; Bonus tab shows humanized",
    ]:
        pdf.bullet(item)

    pdf.sub_title("Country from IP")
    for item in [
        "After login IP is fetched, call https://ipwho.is/{ip}",
        "Result cached in memory per IP",
        "Extra column in bonus mode only",
    ]:
        pdf.bullet(item)

    pdf.sub_title("Inactive users (>= 1 month)")
    for item in [
        "differenceInCalendarMonths(now, loginTime) >= 1",
        "Only when login loaded successfully and has a timestamp",
        "Red-tinted row + 'Inactive' badge in UserRow.tsx",
    ]:
        pdf.bullet(item)

    pdf.section_title("8. State types (know these)")
    for item in [
        "UsersLoadStatus: loading | error | success - overall /users fetch",
        "LoginStatus: loading | success | error - each row's login fetch",
        "EnrichedUser: User + login fields + loginStatus - table row data",
    ]:
        pdf.bullet(item)

    pdf.section_title("9. Questions they might ask")
    qa_pairs = [
        (
            "Why batch size 15?",
            "Balance between speed and not hammering a flaky API. Small enough for progressive UI, "
            "large enough for parallelism. In production I'd tune with real metrics.",
        ),
        (
            "Why not Promise.all for all users at once?",
            "100+ concurrent requests on a 25%-failure API creates a thundering herd and long wait "
            "with zero feedback. Batching gives incremental progress.",
        ),
        (
            "Why not React Query / SWR?",
            "Small challenge - I wanted to show I understand retry, batching, and state without hiding "
            "logic in a library. In production I'd use React Query with per-key retry.",
        ),
        (
            "What if /users fails vs one login fails?",
            "/users failure = global error, table hidden, Retry button. Single login failure = only "
            "that row shows 'Failed to load'.",
        ),
        (
            "How do you find the most recent login?",
            "reduce() comparing new Date(login_time). The API does not sort the array.",
        ),
        (
            "What happens if the user clicks Retry mid-load?",
            "fetchIdRef increments. Any in-flight response from the old load checks the ref and bails "
            "out before updating state.",
        ),
        (
            "What would you improve with more time?",
            "Exponential backoff, request deduplication, virtualized table, unit tests for retry/batch "
            "logic, error boundaries, accessibility audit.",
        ),
    ]
    for q, a in qa_pairs:
        pdf.qa(q, a)

    pdf.section_title("10. API endpoints used")
    for item in [
        "GET https://fake-users-api.vercel.app/users",
        "GET https://fake-users-api.vercel.app/users/:id/relationships/logins",
        "GET https://ipwho.is/:ip (bonus only)",
    ]:
        pdf.bullet(item)

    pdf.section_title("11. App tabs (your built-in notes)")
    for item in [
        "Core task / Core + Bonus - toggle which features are shown",
        "Explain - quick summary + live stats",
        "Dashboard - the actual app to demo",
        "Load log - event timeline; use 'Copy notes' during demo",
        "Interview prep - full notes in the app (same content as this PDF)",
    ]:
        pdf.bullet(item)

    pdf.ln(6)
    pdf.set_font("Helvetica", "I", 10)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 6, "Good luck tomorrow!", align="C")

    pdf.output(str(OUTPUT))
    print(f"PDF written to {OUTPUT}")


if __name__ == "__main__":
    build_pdf()
