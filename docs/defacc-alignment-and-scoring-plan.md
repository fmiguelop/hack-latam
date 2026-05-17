# Def/Acc Track — Alignment Memo & Scoring Roadmap

**Purpose.** Single reference for humans and AI agents: how this project fits the hackathon **`def/acc`** (defensive accelerationism) track, what is **implemented vs roadmap**, gaps that hurt demos or judges, and a **prioritized improvement backlog** oriented toward scoring.

**Related docs.** [CONTEXT.md](../CONTEXT.md), [README.md](../README.md), [threat-model.md](threat-model.md), [recon-modules.md](recon-modules.md), [overview.md](overview.md).

---

## 1. Executive positioning (one paragraph)

Hack LATAM is a **passive external-attack-surface dashboard for SMBs/PYMEs** without dedicated security staff. Users submit a domain or URL; the backend runs **non-exploitative** checks (certificate transparency footprint, DNS email-auth posture, HTTPS certificate and TLS-version signals). Results and optional **AI-generated** remediation summaries are framed for operators, emphasize **authorized use only**, and avoid claiming full coverage or “perfect security.” This is **defensive resilience tooling**, not offensive recon-as-a-product.

---

## 2. Track fit assessment (`def/acc`)

| Track theme (conceptual) | Fit | Notes |
|--------------------------|:---:|-------|
| **Cybersecurity — protect / detect early / resilient** | **Strong** | CT + SPF/DMARC/DKIM + TLS align with early weakness detection for phishing, cert hygiene, and attack-surface visibility. |
| **Biosecurity** | — | Out of scope — do not stretch the pitch here. |
| **Anti-disinformation** | **Partial / adjacent** | **Email-auth** reduces domain spoofing used in phishing and some disinfo; do not oversell unless you add provenance/link safety later. |
| **Human agency & AI** | **Good** | Findings stay structured; `/api/ai/insights` + [insights-prompt.ts](../src/lib/ai/insights-prompt.ts) constrains outputs to defensive remediation and verification, with completeness disclaimers. |
| **Not purely “generic AI app”** | **Good if positioned correctly** | Core value is **deterministic scans**; AI is an assist layer. Judges who only see “chat” risk misclassification — demos should **lead with scan modules**. |

**Rough alignment score for judges:** **~8/10** when narration matches implementation (passive, SMB resilience, concrete threat framing). Drops if copy implies real-time intrusion detection or full pen-test equivalence.

---

## 3. Scoring matrix (features → judge criteria)

| What judges often reward | Mapped product evidence |
|--------------------------|-------------------------|
| **Concrete threat model** | [threat-model.md](threat-model.md) — trust boundaries, crt.sh/DNS/target :443, abuse/misinterpretation mitigations stated. |
| **Defensive, not offensive** | [CONTEXT.md](../CONTEXT.md), [ScanFormPanel.tsx](../src/components/scan/ScanFormPanel.tsx) — passive recon wording; `/api/scan` orchestration in [run-scan.ts](../src/lib/recon/run-scan.ts). |
|**Resilience for institutions / SMBs**| Plain-language `ScanFinding` explanations ([scan.ts](../src/types/scan.ts)); dashboard UX under `src/components/dashboard/`. |
| **Responsible scope / ethics** | “Authorized targets”; deep scan tied to auth in UI (Clerk); document gaps (no enforced rate limits in API route today). |
| **Thoughtful AI use** | [insights-prompt.ts](../src/lib/ai/insights-prompt.ts) — JSON-only defensive advisor; OPENROUTER config in [.env.example](../.env.example) only (no secrets in repo). |

---

## 4. Evidence: what ships today vs roadmap

### 4.1 Implemented scan pipeline (`POST /api/scan`)

**Orchestration:** [run-scan.ts](../src/lib/recon/run-scan.ts) runs modules **in parallel**; per-module failures are isolated.

**Module registry (canonical):**

| Module | When it runs | Role |
|--------|----------------|------|
| `subdomain_enum` | Domain + **deep** mode | Hostnames from certificate transparency ([subdomains.ts](../src/lib/recon/subdomains.ts)). **Skipped** in `quick`. |
| `dns_health` | Domain | SPF / DMARC / common DKIM selector probes ([dns-health.ts](../src/lib/recon/dns-health.ts)). |
| `tls_check` | Domain | Leaf cert / expiry / name match on **:443** ([tls-check.ts](../src/lib/recon/tls-check.ts)). |
| `tls_versions_check` | Domain + **deep** | Legacy TLS 1.0/1.1 negotiation probes ([tls-versions-check.ts](../src/lib/recon/tls-versions-check.ts)). |
| `dns_auth_details` | Domain + **deep** | SPF/DMARC policy strictness ([dns-auth-details.ts](../src/lib/recon/dns-auth-details.ts)). |
| `dns_caa_check` | Domain + **deep** | CAA presence ([dns-caa-check.ts](../src/lib/recon/dns-caa-check.ts)). |

**Mode behavior:** `quick` skips CT enumeration and **filters out `low`** severity findings (see `runScanModules`). See [api-reference.md](api-reference.md) — parts of that doc still describe **three** modules only; reconcile with §4.1 when editing docs.

**AI insights:** Client calls `POST /api/ai/insights` ([route.ts](../src/app/api/ai/insights/route.ts)); system rules in [insights-prompt.ts](../src/lib/ai/insights-prompt.ts).

### 4.2 Convex / persistence (partial)

**Schema:** `scans`, `aiInsightsCache` ([schema.ts](../convex/schema.ts)).

**Backend:** Mutations/queries in [scans.ts](../convex/scans.ts), cache in [aiInsightsCache.ts](../convex/aiInsightsCache.ts) (writes require **INSIGHTS_CACHE_WRITE_SECRET** in Convex Dashboard per file comment).

**UI gap:** [ScanHistorySidebar.tsx](../src/components/scan/ScanHistorySidebar.tsx) exists and reads `getUserScans`, but **`ScanHistorySidebar` is not imported in `ScanWorkspace` or elsewhere** — history UX is effectively **disconnected**. `createScan` / `updateScanInsights` mutations are **not wired** from the scan or insights flows in the traced client code paths. Convex AI cache `getCached` / `setCached` are **not called** from the Next.js insights route (insights are session-only unless extended).

**Agents:** Treat “persisted scan history live in product” as **roadmap/until wired**, not demo truth unless implemented.

### 4.3 Roadmap (from docs / product backlog)

Examples: Shodan/ports, SSL Labs-style grading, WHOIS/HIBP, richer inputs — see [CONTEXT.md](../CONTEXT.md), [recon-modules.md](recon-modules.md), [features.ts](../src/data/features.ts) (`soon` entries).

---

## 5. Gaps & risks (scoring / trust)

| Risk | Impact | Mitigation direction |
|------|--------|----------------------|
| **Copy overclaims** (“detección de amenazas en tiempo real”, “infraestructura objetivo”) | Judges expect SOC/SIEM realism; credibility hit | Prefer “instantáneo tras enviar dominio”, “instantáneo / en un solo POST”, **superficie pública observada**. |
| **Docs/API reference lag** vs six modules | Confuses reviewers comparing code to README | Update [README.md](../README.md), [api-reference.md](api-reference.md), [user-guide.md](user-guide.md) checklist lines. |
| **Abuse:** open `POST /api/scan` | Free scanning of arbitrary hosts possible | Rate limit, CAPTCHA, auth for all scans, or IP quotas; reaffirm authorized-use in UI checkbox. |
| **Convex story weak** vs “cloud historial” | Sidebar copy implies live cloud history that is not mounted | Mount `ScanHistorySidebar` **or** call `createScan` after scan **or** remove misleading marketing until wired. |
| **AI insights** without cache | Higher cost/no “smart caching” demo | Optionally wire Convex `aiInsightsCache` + secret; or document omission. |

---

## 6. Recommended demo narrative (2 minutes)

1. **Audience:** SMB owner asked “¿estamos exponiendo algo obvio?”
2. **Input:** Their **own** or organizer-approved demo domain (**deep**, signed in).
3. **Show:** Modules table → highlights: SPF/DMARC gaps, TLS expiry or legacy TLS, hostname footprint from CT.
4. **AI tab:** Generate insights — emphasize **verification steps** and **disclaimers**, not autonomy.
5. **Close:** “Pasivo, con permiso — no pentest; próximo: historial persistente / más señales defensivas.”

**Claims to avoid in voiceover:** “We detect attackers in real time,” “complete attack surface,” “replaces SOC,” “full compliance.”

**Claims to use:** Visible public footprint, phishing-related email controls, HTTPS hygiene, prioritized fix list, human-in-the-loop AI.

---

## 7. Improvement roadmap (prioritized for scoring)

### Tier A — High impact, low cost

- [ ] **Align marketing copy** with passive snapshot reality: `LandingHero.tsx`, root `layout.tsx` metadata, CTA/footer lines under `src/components/ui/`.
- [ ] **Harmonize documentation** — module count, quick vs deep, list all six modules in README / api-reference / user-guide.
- [ ] **UI “authorized targets only”** — short checkbox + link to [threat-model.md](threat-model.md) near submit (`ScanFormPanel.tsx`).
- [ ] **Track matrix in slide/deck** — reuse §3 table for judging Q&A.

### Tier B — High impact, medium cost

- [ ] **Wire Convex scan persistence:** after successful `/api/scan`, authenticated client calls `createScan`; restore from `ScanHistorySidebar` mounted in [`ScanWorkspace.tsx`](../src/components/scan/ScanWorkspace.tsx).
- [ ] **Wire `updateScanInsights`** when user generates AI output (optional: store simplified payload only).
- [ ] **`POST /api/scan` rate limiting** — middleware or Upstash/redis token bucket keyed by IP or user ID.
- [ ] **Export** — downloadable Markdown/PDF of findings + top actions for “leave-behind.”
- [ ] **`AiInsightsColumn` `servedFromCache`** — if Convex cache wired from API, pass prop from ScanWorkspace.

### Tier C — High impact, larger scope (differentiation)

- [ ] **One flagship defensive signal** with clear SMB story — e.g. **HIBP domain breach** (with API ToS respected), **Censys/Shodan** passive host summary (keys in `.env.example` only), or **SSL Labs–style grading** analogue as documented in recon-modules roadmap.
- [ ] **Ownership friction** — TXT verification token or Clerk org tenancy before deep scan (reduces misuse narrative for judges).

---

## 8. Agent handoff checklist

When picking up scoring or alignment work:

- [ ] Read [convex/_generated/ai/guidelines.md](../convex/_generated/ai/guidelines.md) before Convex changes per repo rules.
- [ ] Prefer updating [.env.example](../.env.example) for **new optional keys** (`INSIGHTS_CACHE_WRITE_SECRET`, third-party APIs) — never commit real `.env`.
- [ ] **Single source for modules:** synchronize [recon-modules.md](recon-modules.md) ↔ `MODULES` in [run-scan.ts](../src/lib/recon/run-scan.ts).
- [ ] After wiring Convex client paths, grep for `ScanHistorySidebar`, `createScan`, `updateScanInsights`, `aiInsightsCache` usage and verify E2E.
- [ ] Demo script: rehears with **domains you control**.

---

## 9. Revision log

| Date | Change |
|------|--------|
| 2026-05-17 | Initial memo from plan track-alignment-doc. |
