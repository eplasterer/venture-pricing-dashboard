window.M3_DATA = {
  "assignment": "Mission 3 — Interactive Pricing & Cost Laboratory",
  "checked": "2026-10-30",
  "venture": {
    "name": "Movie and Show Recommendation Website",
    "brandName": null,
    "description": "A proposed website asks people about genre, mood, available viewing time and streaming subscriptions, then returns three to five movie or show recommendations. A shared-preference mode is intended to help couples, friends or roommates agree on a title.",
    "valueProposition": "Spend less time choosing and more time enjoying.",
    "targetMarket": "Proposed initial audience: U.S. college students and young adults ages 18–34 who regularly stream, including individual viewers and groups choosing together.",
    "market": "United States",
    "currency": "USD",
    "status": "Concept and audience are proposals; actual demand, willingness to pay and cost-to-serve have not been validated.",
    "revenueHypothesis": "Free core discovery; optional premium features may be tested around $1.99–$2.99/month or $19–$29/year. This is a Mission 1 hypothesis, not a confirmed decision.",
    "originalWebsiteUrl": "http://eplasterer.github.io/venture-pricing-dashboard/#landscape",
    "repositoryUrl": "https://github.com/eplasterer/venture-pricing-dashboard.git",
    "workspacePath": "/Users/eplasterer/Downloads/Competitive Pricing"
  },
  "mission1": {
    "as_of": "2026-10-27",
    "market": "United States",
    "currency": "USD",
    "competitors": [
      {
        "id": "justwatch",
        "name": "JustWatch",
        "relationship": "Direct",
        "positioning": "Streaming guide and discovery product that shows where titles are available and supports filtering, recommendations and watchlists.",
        "customer_overlap": "High: viewers comparing movies/shows across streaming services.",
        "pricing_summary": "Free guide; Plus $3.99/month in the US. Plus is the current bundle that includes Pro discovery features, ad-free JustWatch TV Plus titles and rental savings.",
        "strengths": [
          "Strong multi-service availability discovery",
          "Genre and provider filters",
          "Established free entry point"
        ],
        "gaps_or_limitations": [
          "Plus bundles streaming/rental benefits with discovery, so it is not a pure recommendation-only price comparison.",
          "Not positioned around finding a shared choice for a group."
        ],
        "source_ids": [
          "JW1",
          "JW2",
          "JW3",
          "JW4"
        ]
      },
      {
        "id": "reelgood",
        "name": "Reelgood",
        "relationship": "Direct",
        "positioning": "Multi-service streaming discovery app with search, browse, recommendations, watchlists, availability alerts and roulette.",
        "customer_overlap": "High: viewers who want one place to search subscribed services and decide what to watch.",
        "pricing_summary": "US App Store listing is Free ($0). No separate paid tier was identified in the reviewed listing.",
        "strengths": [
          "Broad catalog search and service filters",
          "Recommendation and roulette features",
          "Free mobile listing"
        ],
        "gaps_or_limitations": [
          "Latest visible iOS listing update is 2024-09-02, so current product freshness is uncertain.",
          "The listing alone cannot rule out a paid web tier."
        ],
        "source_ids": [
          "RG1"
        ]
      },
      {
        "id": "letterboxd",
        "name": "Letterboxd",
        "relationship": "Indirect",
        "positioning": "Film diary and community with discovery, reviews, lists and streaming availability filters; movie-focused rather than an all-in-one movie-and-TV chooser.",
        "customer_overlap": "Moderate: film-oriented users who value curated discovery and streaming filters.",
        "pricing_summary": "Free; Pro reported at $19/year; Patron reported at $49/year. Annual billing is documented, but public checkout prices did not render while logged out.",
        "strengths": [
          "Strong film-centered community and curation",
          "Streaming filters and watchlist availability alerts on Pro",
          "Simple annual membership tiers"
        ],
        "gaps_or_limitations": [
          "Movie-first scope is narrower than the venture’s movies-and-shows scope.",
          "No explicit group-consensus decision flow was identified.",
          "Price status is partially verified from recent secondary reporting."
        ],
        "source_ids": [
          "LB1",
          "LB2",
          "LB3"
        ]
      },
      {
        "id": "trakt",
        "name": "Trakt",
        "relationship": "Direct / adjacent",
        "positioning": "Movie and TV discovery, viewing-history tracking, recommendations, lists and community sharing.",
        "customer_overlap": "High: viewers organizing and discovering movies and TV across services.",
        "pricing_summary": "Free access; VIP reported at $6/month or $60/year ($5/month equivalent on annual billing). Price is partially verified from a Trakt-hosted community response.",
        "strengths": [
          "Supports movies and television",
          "Combines discovery with tracking and community",
          "Free cross-platform entry point"
        ],
        "gaps_or_limitations": [
          "Product emphasizes tracking and fan activity as well as discovery.",
          "Current checkout page did not expose VIP price during research.",
          "No explicit short-list group agreement flow was identified."
        ],
        "source_ids": [
          "TR1",
          "TR2",
          "TR3"
        ]
      }
    ],
    "pricing_offers": [
      {
        "competitor_id": "justwatch",
        "competitor": "JustWatch",
        "tier": "Streaming Guide",
        "offer_type": "Core free access",
        "price_usd": 0,
        "billing_period": "Free",
        "price_display": "$0",
        "monthly_equivalent_usd": 0,
        "annual_equivalent_usd": 0,
        "scope": "Streaming availability guide, search, filters and watchlist.",
        "verification": "Verified",
        "source_ids": [
          "JW1"
        ],
        "notes": "App Store lists the app as Free with in-app purchases."
      },
      {
        "competitor_id": "justwatch",
        "competitor": "JustWatch",
        "tier": "Plus (includes Pro discovery features)",
        "offer_type": "Paid bundle",
        "price_usd": 3.99,
        "billing_period": "Monthly",
        "price_display": "$3.99/month",
        "monthly_equivalent_usd": 3.99,
        "annual_equivalent_usd": 47.88,
        "scope": "Monthly subscription; includes Pro discovery features, ad-free JustWatch TV Plus titles and 10% off rentals. 7-day trial is advertised on the US page.",
        "verification": "Verified for US advertised monthly price; bundle caveat",
        "source_ids": [
          "JW2",
          "JW3",
          "JW4"
        ],
        "notes": "Annual equivalent is simple multiplication for comparison only; no annual billing plan is claimed. The $49.99 lifetime offer is promotional and excluded."
      },
      {
        "competitor_id": "reelgood",
        "competitor": "Reelgood",
        "tier": "Streaming Guide",
        "offer_type": "Core free access",
        "price_usd": 0,
        "billing_period": "Free",
        "price_display": "$0",
        "monthly_equivalent_usd": 0,
        "annual_equivalent_usd": 0,
        "scope": "US App Store mobile listing with search, recommendations, watchlists, alerts and roulette.",
        "verification": "Verified for listing",
        "source_ids": [
          "RG1"
        ],
        "notes": "No paid offer was identified in the reviewed listing. This does not prove that no other paid offer exists."
      },
      {
        "competitor_id": "letterboxd",
        "competitor": "Letterboxd",
        "tier": "Free",
        "offer_type": "Core free access",
        "price_usd": 0,
        "billing_period": "Free",
        "price_display": "$0",
        "monthly_equivalent_usd": 0,
        "annual_equivalent_usd": 0,
        "scope": "Free account tier.",
        "verification": "Verified",
        "source_ids": [
          "LB1",
          "LB2"
        ],
        "notes": "Free tier remains available according to official documentation."
      },
      {
        "competitor_id": "letterboxd",
        "competitor": "Letterboxd",
        "tier": "Pro",
        "offer_type": "Annual membership",
        "price_usd": 19,
        "billing_period": "Annual",
        "price_display": "$19/year",
        "monthly_equivalent_usd": 1.5833333333333333,
        "annual_equivalent_usd": 19,
        "scope": "Ad removal, annual/all-time stats, favorite-service filters, watchlist arrival alerts and other film-tracking features.",
        "verification": "Partially verified",
        "source_ids": [
          "LB1",
          "LB2",
          "LB3"
        ],
        "notes": "Official page lists benefits and annual billing but did not show the price while logged out; $19/year is reported by a current 2026 secondary source."
      },
      {
        "competitor_id": "letterboxd",
        "competitor": "Letterboxd",
        "tier": "Patron",
        "offer_type": "Annual membership",
        "price_usd": 49,
        "billing_period": "Annual",
        "price_display": "$49/year",
        "monthly_equivalent_usd": 4.083333333333333,
        "annual_equivalent_usd": 49,
        "scope": "All Pro benefits plus poster/backdrop selection, patron directory listing and early access to selected features.",
        "verification": "Partially verified",
        "source_ids": [
          "LB1",
          "LB2",
          "LB3"
        ],
        "notes": "Official page lists benefits and annual billing but did not show the price while logged out; $49/year is reported by a current 2026 secondary source."
      },
      {
        "competitor_id": "trakt",
        "competitor": "Trakt",
        "tier": "Free",
        "offer_type": "Core free access",
        "price_usd": 0,
        "billing_period": "Free",
        "price_display": "$0",
        "monthly_equivalent_usd": 0,
        "annual_equivalent_usd": 0,
        "scope": "Free access on web, iOS and Android; discovery, tracking and community features.",
        "verification": "Verified",
        "source_ids": [
          "TR1",
          "TR3"
        ],
        "notes": "Streaming-service subscription charges are separate and excluded."
      },
      {
        "competitor_id": "trakt",
        "competitor": "Trakt",
        "tier": "VIP monthly",
        "offer_type": "Monthly membership",
        "price_usd": 6,
        "billing_period": "Monthly",
        "price_display": "$6/month",
        "monthly_equivalent_usd": 6,
        "annual_equivalent_usd": 72,
        "scope": "VIP subscription; current feature details and regional offer may vary.",
        "verification": "Partially verified",
        "source_ids": [
          "TR2",
          "TR3"
        ],
        "notes": "$6/month reported in Trakt-hosted forum reply dated 2025-06-09; checkout price was not directly visible."
      },
      {
        "competitor_id": "trakt",
        "competitor": "Trakt",
        "tier": "VIP annual",
        "offer_type": "Annual membership",
        "price_usd": 60,
        "billing_period": "Annual",
        "price_display": "$60/year",
        "monthly_equivalent_usd": 5,
        "annual_equivalent_usd": 60,
        "scope": "VIP annual subscription.",
        "verification": "Partially verified",
        "source_ids": [
          "TR2",
          "TR3"
        ],
        "notes": "$60/year reported in Trakt-hosted forum reply dated 2025-06-09; $5/month is the arithmetic annual equivalent, not monthly billing."
      }
    ],
    "sources": [
      {
        "id": "JW1",
        "competitor": "JustWatch",
        "title": "JustWatch - Movies & TV Shows (US App Store listing)",
        "source_type": "Official app listing",
        "url": "https://apps.apple.com/us/app/justwatch-movies-tv-shows/id979227482",
        "accessed": "2026-10-27",
        "key_evidence": "Free app; streaming guide, search, filters, watchlist, recommendations and current app version history.",
        "verification": "Verified for US app listing and discovery features; the listing does not publish the Plus checkout price.",
        "number": 1
      },
      {
        "id": "JW2",
        "competitor": "JustWatch",
        "title": "What is JustWatch Pro & JustWatch Plus?",
        "source_type": "Official support article",
        "url": "https://support.justwatch.com/article/what-is-justwatch-pro",
        "accessed": "2026-10-27",
        "key_evidence": "Pro is a monthly subscription with ad removal and advanced search filters; in selected regions it is renamed Plus with the same benefits and price.",
        "verification": "Verified for billing model, feature scope and naming; price is displayed in product checkout.",
        "number": 2
      },
      {
        "id": "JW3",
        "competitor": "JustWatch",
        "title": "What is JustWatch Plus?",
        "source_type": "Official support article",
        "url": "https://support.justwatch.com/article/what-is-justwatch-plus",
        "accessed": "2026-10-27",
        "key_evidence": "Plus is monthly; includes JustWatch Pro features, ad-free JustWatch TV Plus titles and 10% off rentals.",
        "verification": "Verified; shows that the current Plus plan bundles discovery features with viewing and rental benefits.",
        "number": 3
      },
      {
        "id": "JW4",
        "competitor": "JustWatch",
        "title": "JustWatch TV Plus (US)",
        "source_type": "Official US product page",
        "url": "https://www.justwatch.com/us/provider/justwatch-tv-plus",
        "accessed": "2026-10-27",
        "key_evidence": "$3.99/month, 7-day trial, a limited-time $49.99 lifetime offer, ad-free streaming library and 10% off rentals.",
        "verification": "Verified for the advertised US monthly and lifetime offer on the page; lifetime is promotional and excluded from recurring-price comparisons.",
        "number": 4
      },
      {
        "id": "RG1",
        "competitor": "Reelgood",
        "title": "Reelgood - Streaming Guide (US App Store listing)",
        "source_type": "Official app listing",
        "url": "https://apps.apple.com/us/app/reelgood-streaming-guide/id1031391869",
        "accessed": "2026-10-27",
        "key_evidence": "Free app; search, browse, recommendations, curated collections, ratings, watchlists, alerts and roulette. Latest visible iOS version 4.8.3 dated 2024-09-02.",
        "verification": "Verified for listing price/features; the listing does not establish whether a paid web tier exists. Product freshness is uncertain.",
        "number": 5
      },
      {
        "id": "LB1",
        "competitor": "Letterboxd",
        "title": "Upgrade to Letterboxd Pro",
        "source_type": "Official pricing page",
        "url": "https://letterboxd.com/pro/",
        "accessed": "2026-10-27",
        "key_evidence": "Free, Pro and Patron tiers; page presents tier benefits and purchase controls. Price values did not render while logged out.",
        "verification": "Verified for tier structure and benefits; price not displayed in public view.",
        "number": 6
      },
      {
        "id": "LB2",
        "competitor": "Letterboxd",
        "title": "Paid subscriptions",
        "source_type": "Official product documentation",
        "url": "https://letterboxd.com/about/pro/",
        "accessed": "2026-10-27",
        "key_evidence": "Pro and Patron benefits; subscriptions through the website and apps are payable annually.",
        "verification": "Verified for annual billing and feature scope; this page does not state the current price.",
        "number": 7
      },
      {
        "id": "LB3",
        "competitor": "Letterboxd",
        "title": "A24 and The New York Times Are Circling Letterboxd in a Sale Worth Over $300 Million",
        "source_type": "Secondary news article",
        "url": "https://www.fanbolt.com/182195/a24-and-the-new-york-times-are-circling-letterboxd-in-a-sale-worth-over-300-million/",
        "accessed": "2026-10-27",
        "key_evidence": "Published 2026-09-25; reports Pro at $19/year and Patron at $49/year.",
        "verification": "Partially verified: recent secondary source agrees with known rate; Letterboxd public checkout did not expose prices while logged out.",
        "number": 8
      },
      {
        "id": "TR1",
        "competitor": "Trakt",
        "title": "Trakt home page",
        "source_type": "Official product page",
        "url": "https://trakt.tv/",
        "accessed": "2026-10-27",
        "key_evidence": "Free on web, iOS and Android; discovery, tracking, recommendations and community sharing.",
        "verification": "Verified for free access and core product positioning.",
        "number": 9
      },
      {
        "id": "TR2",
        "competitor": "Trakt",
        "title": "How do I know how many lists I have?",
        "source_type": "Official community forum",
        "url": "https://forums.trakt.tv/t/how-do-i-know-how-many-list-i-have/60703",
        "accessed": "2026-10-27",
        "key_evidence": "A forum response dated 2025-06-09 states new US VIP subscriptions are $60/year or $6/month.",
        "verification": "Partially verified: price appears in a Trakt-hosted community response; the current VIP checkout page did not expose the amount.",
        "number": 10
      },
      {
        "id": "TR3",
        "competitor": "Trakt",
        "title": "Upcoming VIP renewal pricing changes effective June 12, 2025",
        "source_type": "Official community announcement",
        "url": "https://forums.trakt.tv/t/upcoming-vip-renewal-pricing-changes-effective-june-12-2025/56649",
        "accessed": "2026-10-27",
        "key_evidence": "Confirms standardized VIP renewal pricing effective 2025-06-12 and that a free plan remains available.",
        "verification": "Verified for the 2025 change and free plan; use TR2 for the reported current US rate.",
        "number": 11
      }
    ],
    "limitations": [
      "Prices and features were checked for the United States on 2026-10-27. Storefront, tax, promotion and regional differences may change the final amount.",
      "JustWatch Plus is a bundle that includes discovery, a selected ad-free streaming catalog and rental savings; its $3.99/month price is not a pure recommendation-only price.",
      "Reelgood’s US App Store page says Free and lists features, but it does not prove that no paid website offer exists. The latest visible iOS update is dated 2024-09-02.",
      "Letterboxd’s public pages show tiers, features and annual billing, but prices did not render while logged out. Current 2026 secondary reporting supports $19/year Pro and $49/year Patron; status remains partially verified.",
      "Trakt’s current VIP checkout page did not expose price during this run. A Trakt-hosted forum response from June 2025 reports $6/month or $60/year; rates should be rechecked at checkout.",
      "A free app or plan price covers discovery/product access only. It excludes separate subscriptions, rentals or purchases from streaming providers.",
      "The venture’s target audience and value proposition are proposals from prior project materials, not validated market evidence. No actual demand, cost-to-serve or willingness-to-pay data was available.",
      "A synthetic focus-group exercise is not representative consumer research and is not used as evidence for price or demand."
    ]
  },
  "sources": [
    {
      "id": "GH1",
      "title": "What is GitHub Pages?",
      "organization": "GitHub Docs",
      "url": "https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages",
      "checked": "2026-10-30",
      "evidence": "GitHub Pages serves static HTML, CSS and JavaScript; a public repository can use GitHub Free. This is a static-hosting benchmark and excludes backend, data, licensing and custom-domain costs."
    },
    {
      "id": "SUP1",
      "title": "Supabase pricing",
      "organization": "Supabase",
      "url": "https://supabase.com/pricing",
      "checked": "2026-10-30",
      "evidence": "Free plan is $0/month; Pro starts at $25/month. Used as an optional backend capacity reference, not a requirement for the static prototype."
    },
    {
      "id": "STR1",
      "title": "Stripe pricing and fees",
      "organization": "Stripe",
      "url": "https://stripe.com/pricing",
      "checked": "2026-10-30",
      "evidence": "Standard U.S. online domestic card benchmark: 2.9% plus $0.30 per successful transaction. Payment-processing fee benchmark; check actual payment-method and contract rates before launch."
    },
    {
      "id": "STR2",
      "title": "Stripe Billing pricing",
      "organization": "Stripe",
      "url": "https://stripe.com/pricing",
      "checked": "2026-10-30",
      "evidence": "Pay-as-you-go Billing is 0.7% of Billing volume, with no recurring fee. Modelled as a separate variable fee on subscription revenue."
    },
    {
      "id": "BLSD",
      "title": "Software Developers, Quality Assurance Analysts, and Testers — Occupational Outlook Handbook",
      "organization": "U.S. Bureau of Labor Statistics",
      "url": "https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm",
      "checked": "2026-10-30",
      "evidence": "2025 median annual software developer wage is $135,980. Dividing by 2,080 hours gives a $65.38/hour wage-equivalent planning benchmark; it is not a contractor quote or fully loaded labor cost."
    },
    {
      "id": "BLSS",
      "title": "Customer Service Representatives — Occupational Outlook Handbook",
      "organization": "U.S. Bureau of Labor Statistics",
      "url": "https://www.bls.gov/ooh/office-and-administrative-support/customer-service-representatives.htm",
      "checked": "2026-10-30",
      "evidence": "2025 median pay is $44,770/year ($21.53/hour). Used only as a wage-equivalent planning benchmark; it excludes employer burden and contractor markup."
    },
    {
      "id": "TMDB1",
      "title": "API Terms of Use",
      "organization": "The Movie Database (TMDB)",
      "url": "https://www.themoviedb.org/api-terms-of-use",
      "checked": "2026-10-30",
      "evidence": "The terms state that commercial use requires a separate written agreement and may be subject to fees. No public commercial price is listed. The model leaves the essential catalog-rights cost unpriced; $0 is an excluded placeholder, not evidence of free commercial rights."
    },
    {
      "id": "CF1",
      "title": "Cloudflare Registrar",
      "organization": "Cloudflare",
      "url": "https://www.cloudflare.com/domains/",
      "checked": "2026-10-30",
      "evidence": "Cloudflare says domain registrations are offered at registry/ICANN cost; exact cost depends on the selected TLD and current quote. A custom domain is optional because the GitHub Pages subdomain can be used."
    },
    {
      "id": "M1DATA",
      "title": "Mission 1 competitor research package",
      "organization": "Student project files",
      "url": "",
      "checked": "2026-10-27",
      "evidence": "The app embeds the prior competitor dataset as a dated snapshot. Competitor prices are not live feeds and should be rechecked before a commercial decision."
    }
  ]
};
