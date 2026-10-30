# Mission 3 — Interactive Pricing & Cost Laboratory

This offline-capable, browser-based pricing and cost model is tailored to the Mission 1 venture: a proposed Movie and Show Recommendation Website with a free core and optional premium monthly or annual plans.

## Open the lab

Open index.html in a modern browser, or serve this folder as static files. No account, backend, API key, network request, paid service or build step is required to use the calculator. The DOCX library is included locally so report creation works offline after the student confirms a pricing decision.

The public lab is published separately from the Mission 2 homepage at:

https://eplasterer.github.io/venture-pricing-dashboard/mission-3-pricing-laboratory/

Mission 2 remains at the repository root:

https://eplasterer.github.io/venture-pricing-dashboard/

## Model behavior

- Lean, Typical and Expansion presets edit the audience, conversion, operating budgets and plan prices. Save a named custom scenario locally.
- The plan model supports free, monthly, annual and one-time offers. Subscription plan shares are normalized across paying subscribers; one-time sales are modeled separately.
- Fixed recurring expenses, one-time startup investment and variable fees have separate classifications and controls. Each cost can be enabled, edited, assigned a frequency, or deleted when it is custom.
- Break-even uses the weighted plan mix, monthly-equivalent annual revenue, variable percent fees, payment transaction counts and current monthly fixed costs. The $0.30 annual-plan transaction fee is prorated across 12 months.
- Price sensitivity holds the number of customers constant. It is an arithmetic comparison, not an estimate of demand response.
- Audience, conversion and plan volumes are editable scenarios. Mission 1 did not provide measured demand, conversion, retention or willingness-to-pay evidence.
- Source dates and evidence labels distinguish published prices, wage-equivalent estimates and student assumptions.
- Browser storage keeps the editable scenario on this device. Export/import stores a model backup. Model files are not transmitted.
- The app runs a deterministic rules-based risk review. Changes to model inputs invalidate the review and any confirmation.
- A student must run the review, acknowledge the findings, write a rationale of at least 50 characters and click Confirm my decision. Only then are a genuine DOCX and structured decision JSON unlocked. This app never confirms a decision automatically.

## Cost benchmarks and limits

- GitHub Pages is modeled as $0 for static hosting on the public repository. It does not include API hosting, content rights, custom-domain charges or commercial data access.
- Supabase Free is $0/month; Pro starts at $25/month in the checked pricing snapshot. A backend is optional and not needed for this static application.
- Stripe's checked U.S. online domestic card benchmark is 2.9% + $0.30 per successful charge. Stripe Billing's pay-as-you-go fee is modeled separately at 0.7% of billing volume. Rates and terms may change.
- Developer and customer support values are planning equivalents derived from U.S. Bureau of Labor Statistics 2025 wage medians. They are not contractor quotes or fully loaded labor costs.
- TMDB's API terms state that commercial use requires a separate written agreement and may be subject to fees. No public commercial price was listed. The default $0 catalog-rights row is explicitly excluded and is not evidence of a free commercial license.
- Cloudflare's registrar page states it charges registry/ICANN cost; actual domain prices depend on the TLD. A custom domain is optional for this GitHub Pages deployment.
- Mission 1 competitor prices are embedded as a dated 2026-10-27 snapshot. Recheck current checkout prices and feature terms before making a business decision.

## Project files

- index.html — accessible application shell and forms
- styles.css — responsive visual design
- app.js — calculator, charts, decision review, local persistence and exports
- data.js — venture brief, competitor dataset and source register
- docx-library.js — bundled offline DOCX generator
- DOCX-LICENSE.txt — license for the DOCX library

All forecast figures should be read as changeable planning assumptions. The app preserves the Mission 2 website at the root and places Mission 3 in its own repository subpath.
