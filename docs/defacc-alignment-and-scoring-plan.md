# PRD: Def/Acc Track — Product Hub (alignment, scoring, backlog)

| Field | Value |
|-------|-------|
| **Status** | Live (documentation — product backlog items vary) |
| **Priority** | — (hub document) |
| **Owner** | Product / Engineering |
| **Version** | 1.2 |
| **Last updated** | 2026-05-17 |

**This document is the primary source of truth** for how Hack LATAM fits the hackathon **def/acc** (defensive acceleration) track, what ships today vs roadmap, and how we prioritize work for judges and operators. Satellite docs are linked from [Sub-spec registry](#12-sub-spec-registry).

**Also read:** [CONTEXT.md](../CONTEXT.md), [README.md](../README.md).

---

## 1. Executive summary (EN)

**Hack LATAM** is a **passive external-attack-surface dashboard for SMBs/PYMEs** without dedicated security staff. Users submit a domain or URL; the backend runs **non-exploitative** checks (certificate transparency footprint, DNS email-auth posture, HTTPS certificate and TLS-version signals). Results and optional **AI-generated** remediation summaries are framed for operators, emphasize **authorized use only**, and avoid claiming full coverage or perfect security. Core value is **deterministic scans**; AI is an assist layer. This is **defensive resilience tooling**, not offensive recon-as-a-product.

### Executive summary (ES)

**Hack LATAM** es un **tablero pasivo de superficie de ataque externa para PYMEs** sin equipo de seguridad dedicado. Los usuarios envían un dominio o URL; el backend ejecuta comprobaciones **no explotativas** (huella en transparencia de certificados, postura de autenticación de correo DNS, certificado HTTPS y señales de versión TLS). Los resultados y los resúmenes opcionales **generados por IA** están orientados a operadores, enfatizan **uso solo autorizado** y evitan afirmar cobertura total o “seguridad perfecta”. El núcleo del producto son los **escaneos determinísticos**; la IA es una capa de apoyo. Es **herramienta de resiliencia defensiva**, no recon ofensivo como producto.

---

## 2. Problem statement

- **SMBs** lack continuous, plain-language visibility into **public** misconfigurations that enable phishing (SPF/DMARC), certificate failures, and unnecessary hostname exposure (CT).
- **Hackathon judges** need a **concrete threat model**, defensive scope, and evidence that the product is not a generic chat wrapper or offensive tooling.
- **Trust narrative** breaks when copy overclaims (real-time SOC, complete surface) or when **deep** recon is available without **ownership proof** or rate limits.

---

## 3. Goals

| ID | Goal |
|----|------|
| G1 | **Detect weaknesses early** using passive, observable signals (CT, DNS email-auth, TLS on :443). |
| G2 | **Improve resilience** for people and small institutions via prioritized, actionable findings. |
| G3 | **Stay defensive** — no exploitation, no “hack them” positioning; authorized targets only. |
| G4 | **Human-in-the-loop AI** — structured findings first; AI explains, prioritizes verification, does not replace judgment ([AI Insights PRD](ai-chat-refinement-prd.md)). |
| G5 | **Credible def/acc story** — align demos and docs with implementation (lead with modules, not chat). |

---

## 4. Non-goals

- **Biosecurity**, **outbreak/lab** tooling — **out of scope**; do not stretch the pitch.
- **Real-time intrusion detection**, **SIEM replacement**, **full pen-test** equivalence.
- **Offensive capabilities** — bulk recon harassment, exploit chains, credential attacks.
- **Generic “social good”** without **concrete defensive mechanisms** — we anchor scan modules + [threat model](threat-model.md).
- **Anti-disinformation** as core product — **adjacent only** via email spoofing hygiene unless provenance/link safety ships later.

---

## 5. Track fit matrix (`def/acc`)

Criteria below mirror the official track framing (defensive acceleration: strengthen society’s defenses against cyber, biological, disinformation, and critical-system failures). Columns: **Fit**, **Evidence / stance**, **Scoring impact**.

| Track criterion | Fit | Evidence / stance | Scoring impact |
|-----------------|-----|-------------------|----------------|
| **Cybersecurity — protect infrastructure, detect vuln hygiene, improve patching posture** | **Strong** | CT + SPF/DMARC/DKIM + TLS cert/expiry/legacy protocol probes; plain-language remediation hints. | **High** |
| **Biosecurity** | **—** | Explicitly **out of scope**. | **Low** (neutral if not claimed) |
| **Anti-disinformation** (provenance, bots, mass persuasion) | **Partial / adjacent** | Email-auth reduces **domain spoofing** used in phishing and some disinfo; **do not oversell** without provenance/link safety. | **Medium** |
| **Human agency in AI** (supervise systems, stay in the loop) | **Good** | `/api/ai/insights` + [`insights-prompt.ts`](../src/lib/ai/insights-prompt.ts) — JSON-only defensive advisor with disclaimers; guided chat [spec](ai-chat-refinement-prd.md) is **Draft**. | **High** (when demo shows structured-first + verification) |
| **Disqualifier: generic AI app** | **Good if positioned right** | Deterministic pipeline is the product; AI is assist. | **High** |
| **Disqualifier: offensive tooling** | **Good** | Passive-only modules; threat model states boundaries. | **High** |
| **Disqualifier: vague “security” without threat model** | **Mitigated** | [threat-model.md](threat-model.md) + module registry in [run-scan.ts](../src/lib/recon/run-scan.ts). | **High** |

**Rough judge alignment:** **~8/10** when narration matches implementation. **Drops** if copy implies real-time attacker detection, full coverage, or pentest replacement.

---

## 6. Feature status matrix

Rows: product capabilities. **Status:** Implemented / Partial / Draft (spec only) / Not started. **Def/acc:** primary criterion from §5. **Scoring:** High / Med / Low for hackathon narrative.

| Feature | Status | Def/acc criterion | Scoring | Notes / links |
|---------|--------|---------------------|---------|----------------|
| **Scan pipeline** (`POST /api/scan`) | **Implemented** | Cybersecurity | **High** | [run-scan.ts](../src/lib/recon/run-scan.ts), [recon-modules.md](recon-modules.md) |
| **Six modules** (CT, DNS health, TLS, TLS versions, DNS auth details, CAA) | **Implemented** | Cybersecurity | **High** | Quick skips deep-only modules + CT; filters `low` in quick — see §7 |
| **Quick vs deep mode** | **Implemented** | Cybersecurity | **Med** | UX + API `mode` |
| **AI one-shot insights** (`POST /api/ai/insights`) | **Implemented** | Human agency / AI | **High** | [route.ts](../src/app/api/ai/insights/route.ts), [insights-prompt.ts](../src/lib/ai/insights-prompt.ts) |
| **AI guided chat (multi-turn)** | **Draft** | Human agency / AI | **High** (when built) | [ai-chat-refinement-prd.md](ai-chat-refinement-prd.md) — **P3** |
| **Domain ownership before deep scan** | **Draft** | Cybersecurity + ethics / disqualifiers | **High** | [prd-domain-ownership-verification.md](prd-domain-ownership-verification.md) — **P1** |
| **Convex scan persistence** (`createScan`, history UI) | **Partial** | Resilience / audit | **Med–High** | [schema.ts](../convex/schema.ts), sidebar absent from workspace — **P2** |
| **AI insights Convex cache** | **Partial** | Cost / demo polish | **Low–Med** | [aiInsightsCache.ts](../convex/aiInsightsCache.ts) not called from Next route |
| **Rate limits / abuse controls** | **Not started** | Ethics / disqualifiers | **High** | Open `POST /api/scan` risk — see §10 |
| **Roadmap modules** (Shodan, SSL Labs-style, HIBP, etc.) | **Not started** | Cybersecurity | **Med** | [recon-modules.md](recon-modules.md) roadmap |
| **Marketing copy ↔ passive reality** | **Partial** | Disqualifiers | **Med** | Align hero/metadata — Tier A backlog |
| **API / user docs** (6 modules, quick vs deep) | **Partial** | Credibility | **Med** | [api-reference.md](api-reference.md) reconciled with code |
| **UI / visual identity** (Trust & Authority) | **Implemented** | Credibility / disqualifiers (“generic AI look”) | **Low–Med** | Navy + sky semantic tokens ([globals.css](../src/app/globals.css)); **Plus Jakarta Sans** + **IBM Plex Mono** for data ([layout.tsx](../src/app/layout.tsx)); sharper radii (`--radius`); medium/warning affordances use sky (not violet/amber). See §13. |

---

## 7. Technical reference — canonical scan pipeline

**Orchestration:** [run-scan.ts](../src/lib/recon/run-scan.ts) runs modules **in parallel**; per-module failures are isolated.

| Module | When it runs | Role |
|--------|----------------|------|
| `subdomain_enum` | Domain + **deep** | Hostnames from certificate transparency ([subdomains.ts](../src/lib/recon/subdomains.ts)). **Skipped** in `quick`. |
| `dns_health` | Domain | SPF / DMARC / common DKIM selector probes ([dns-health.ts](../src/lib/recon/dns-health.ts)). |
| `tls_check` | Domain | Leaf cert / expiry / name match on **:443** ([tls-check.ts](../src/lib/recon/tls-check.ts)). |
| `tls_versions_check` | Domain + **deep** | Legacy TLS 1.0/1.1 probes ([tls-versions-check.ts](../src/lib/recon/tls-versions-check.ts)). |
| `dns_auth_details` | Domain + **deep** | SPF/DMARC policy strictness ([dns-auth-details.ts](../src/lib/recon/dns-auth-details.ts)). |
| `dns_caa_check` | Domain + **deep** | CAA presence ([dns-caa-check.ts](../src/lib/recon/dns-caa-check.ts)). |

**Mode:** `quick` skips CT and deep-only modules and **filters out `low`** severity findings from the response. **Single source of truth:** keep [recon-modules.md](recon-modules.md) in sync with `MODULES` in `run-scan.ts`.

**Convex note:** [ScanHistorySidebar.tsx](../src/components/scan/ScanHistorySidebar.tsx) exists but **is not mounted** in `ScanWorkspace`; `createScan` / `updateScanInsights` **not wired** from scan/insights flows. Treat “cloud history live in product” as **roadmap** until wired.

---

## 8. Roadmap (prioritized for def/acc scoring)

Order agreed for implementation narrative: **P1 Domain ownership → P2 Convex persistence → P3 AI guided chat.**

| Priority | Theme | Outcome | Spec / tracking |
|----------|-------|---------|-----------------|
| **P1** | **Domain ownership verification** | Deep scans gated; misuse narrative reduced; aligns “authorized targets” with server enforcement | [prd-domain-ownership-verification.md](prd-domain-ownership-verification.md) |
| **P2** | **Convex scan persistence** | After successful `/api/scan`, authenticated client calls `createScan`; mount `ScanHistorySidebar` in [`ScanWorkspace.tsx`](../src/components/scan/ScanWorkspace.tsx); optionally `updateScanInsights` | [architecture.md](architecture.md), [convex/scans.ts](../convex/scans.ts) |
| **P3** | **AI Insights guided chat** | Multi-turn refinement grounded in scan snapshot; structured-first UI | [ai-chat-refinement-prd.md](ai-chat-refinement-prd.md) |

### Tier A — High impact, low cost (backlog)

- [ ] Align **marketing copy** with passive snapshot reality (`LandingHero.tsx`, root `layout.tsx`, CTAs).
- [ ] Harmonize **README / api-reference / user-guide** — six modules, quick vs deep.
- [ ] **Authorized targets** checkbox + link to [threat-model.md](threat-model.md) near submit (`ScanFormPanel.tsx`).
- [ ] **Judging deck:** reuse §5–§6 tables for Q&A.
- [ ] **Presentation / visual trust:** keep operator/SMB tooling tone (not generic “AI SaaS” violet stacks) — baseline in §13.

### Tier B — High impact, medium cost

- [ ] **`POST /api/scan` rate limiting** — middleware or token bucket (IP / user).
- [ ] **Export** — Markdown/PDF of findings + top actions.
- [ ] **`AiInsightsColumn` `servedFromCache`** when Convex cache is wired.

### Tier C — Larger scope (differentiation)

- [ ] **Flagship passive signal** — HIBP (ToS-compliant), Shodan/Censys summary, or SSL Labs–style analogue ([recon-modules.md](recon-modules.md)).

---

## 9. Demo narrative (~2 minutes)

### English

1. **Audience:** SMB owner — “Are we obviously exposing something?”
2. **Input:** **Your own** or organizer-approved demo domain; **deep**; signed in if the UI requires it.
3. **Show:** Modules table first → SPF/DMARC gaps, TLS expiry or legacy TLS, CT hostname footprint.
4. **AI tab:** Generate insights → **verification steps** and **disclaimers**, not autonomy. (Guided follow-ups: [PRD](ai-chat-refinement-prd.md) when shipped.)
5. **Close:** Passive, with permission — not a pentest; next: **ownership-gated deep**, persistent history, more defensive signals.

### Español

1. **Audiencia:** dueño de PYME — “¿estamos exponiendo algo obvio?”
2. **Entrada:** dominio **propio** o aprobado para demo; **deep**; sesión iniciada si la UI lo pide.
3. **Mostrar:** tabla de módulos primero → huecos SPF/DMARC, caducidad TLS o TLS legado, huella de hostnames vía CT.
4. **Pestaña IA:** generar insights — **pasos de verificación** y **descargos**, no autonomía.
5. **Cierre:** “Pasivo, con permiso — no pentest; próximo: **deep con verificación de dominio**, historial persistente, más señales defensivas.”

**Avoid claiming:** real-time attacker detection, complete attack surface, SOC replacement, full compliance.

**Prefer claiming:** visible public footprint, phishing-related email controls, HTTPS hygiene, prioritized fix list, human-in-the-loop AI.

---

## 10. Risks and mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Copy **overclaims** (real-time threats, “target infrastructure”) | Credibility | Use “snapshot after submit”, **observed public surface** |
| **Docs lag** (3 vs 6 modules) | Reviewer confusion | Keep [api-reference.md](api-reference.md) and README aligned with §7 |
| **Abuse:** open `POST /api/scan` | Offensive misuse narrative | Rate limits, auth, CAPTCHA; P1 ownership gate for deep |
| **Convex “history”** not wired | Trust / demo gap | Mount sidebar + `createScan` or soften copy |
| **AI insights** uncached | Cost / no cache demo | Wire `aiInsightsCache` or document omission |

---

## 11. Agent handoff checklist

When picking up def/acc or scoring work:

- [ ] Read [convex/_generated/ai/guidelines.md](../convex/_generated/ai/guidelines.md) before Convex changes (repo rule).
- [ ] Add new optional keys only via [.env.example](../.env.example) — never commit real `.env`.
- [ ] **Single source for modules:** [recon-modules.md](recon-modules.md) ↔ `MODULES` in [run-scan.ts](../src/lib/recon/run-scan.ts).
- [ ] After wiring Convex clients, grep `ScanHistorySidebar`, `createScan`, `updateScanInsights`, `aiInsightsCache` and verify E2E.
- [ ] Rehearse demos with **domains you control**.

---

## 12. Sub-spec registry

| Document | Status | Role |
|----------|--------|------|
| [defacc-alignment-and-scoring-plan.md](defacc-alignment-and-scoring-plan.md) | **Live** | **This hub** |
| [prd-domain-ownership-verification.md](prd-domain-ownership-verification.md) | Draft | P1 — deep scan gate |
| [ai-chat-refinement-prd.md](ai-chat-refinement-prd.md) | Draft | P3 — guided chat |
| [overview.md](overview.md) | Live | Product overview |
| [threat-model.md](threat-model.md) | Live | Trust boundaries, abuse |
| [recon-modules.md](recon-modules.md) | Live | Module catalog + roadmap |
| [architecture.md](architecture.md) | Live | Stack and request flow |
| [api-reference.md](api-reference.md) | Live (reconcile ongoing) | HTTP API |
| [severity-system.md](severity-system.md) | Live | Finding severity rules |
| [privacy-and-data-sources.md](privacy-and-data-sources.md) | Live | Data egress minimization |
| [developer-setup.md](developer-setup.md) | Live | Local dev |
| [user-guide.md](user-guide.md) | Live | End-user instructions |
| [troubleshooting.md](troubleshooting.md) | Live | Common failures |

---

## 13. Presentation & UI (trust signals)

Hackathon reviewers infer product seriousness partly from visuals. Hack LATAM intentionally uses a **Trust & Authority** direction (professional B2B / defensive tooling), not playful “generic AI startup” palettes.

| Area | Decision | Where it lives |
|------|-----------|----------------|
| **Color** | Deep navy surfaces (`slate`-950-scale) + **precise sky** primaries/accent rings; destructive stays red/emerald for pass/fail; **medium** severity and “warn” states use sky tints instead of violet/amber-heavy defaults | [`src/app/globals.css`](../src/app/globals.css), dashboard badges |
| **Typography** | **Plus Jakarta Sans** for UI copy; **IBM Plex Mono** for domains, payloads, monospace fields | [`src/app/layout.tsx`](../src/app/layout.tsx) |
| **Shape** | Tighter `--radius` (0.5rem) and cards/tabs aligned to `rounded-lg` for a more technical feel | `globals.css`, [`card.tsx`](../src/components/ui/card.tsx) |

**When extending UI:** keep semantic Tailwind/CSS variables (`primary`, `accent`, `muted`) instead of ad-hoc hex in components unless mapping a new token in `globals.css`.

---

## 14. Revision log

| Date | Change |
|------|--------|
| 2026-05-17 | Initial alignment memo. |
| 2026-05-17 | Linked AI Insights guided chat PRD. |
| 2026-05-17 | **Rewritten as PRD hub:** metadata, bilingual summary, track/feature matrices, P1–P3 roadmap, sub-spec registry. |
| 2026-05-17 | **§13 Presentation & UI** + feature row for Trust & Authority theme (v1.2). |
