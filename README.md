# Competitive Pricing Intelligence Dashboard

A static, interactive dashboard for the Movie and Show Recommendation Website venture. It turns the Mission 1 U.S. competitor research into a market snapshot, offer comparison, price-position explorer, opportunity view, and source register.

## Run locally

No backend, API key, or third-party runtime dependency is required.

    npm run build
    cd dist
    python3 -m http.server 4173

Then open http://localhost:4173.

## Data and methodology

The app reads competitor_data.json as the source of truth, kept separate from the interface code. The research snapshot is dated October 27, 2026, covers the United States, and reports U.S. dollars. Prices are snapshots, not live checkout feeds.

The offer-level comparison uses all nine Mission 1 pricing records. Annual plans are divided by 12 to display a monthly equivalent; this is only arithmetic normalization and does not claim monthly billing. Optional promotional lifetime pricing is excluded from recurring-price statistics. No separately priced add-on is counted as a product.

The one-per-competitor chart uses the paid entry plan where one was identified and otherwise the free core offer. That produces JustWatch Plus ($3.99/month, a bundle), Reelgood's free app listing ($0), Letterboxd Pro ($19/year, $1.58/month equivalent), and Trakt VIP annual ($60/year, $5/month equivalent). Since the plans have different scope, this is a directional positioning benchmark, not an apples-to-apples product-value ranking.

The price explorer's midpoint is the median of those four representative monthly-equivalent values. Its price labels use the sample's first quartile, third quartile, and minimum/maximum; nearby offers are labeled when within 10% of the selected price. These are transparent display rules, not demand or willingness-to-pay estimates. The preliminary $1.99-$2.99 monthly range remains a Mission 1 hypothesis.

Competitor, offer, verification, source, and limitation details are kept in the JSON and rendered by app.js. See the dashboard's Sources & Methodology section for the full source register and research caveats.

## GitHub Pages

The repository is prepared for https://github.com/eplasterer/venture-pricing-dashboard. The workflow at .github/workflows/deploy.yml builds the static dist folder and publishes it through GitHub Pages when changes reach the main branch. The production files use relative paths and support the repository subpath.

To publish, enable GitHub Actions as the repository's Pages source if prompted, then allow the workflow to complete. A successful build alone does not mean the public page is deployed.
