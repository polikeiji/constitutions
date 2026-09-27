# Running costs

What the company spends to run for five years — people, cloud, AI and everything else — and
the driver each figure scales with.

## Shape

The first 24 months are monthly, because that is the period the raise funds and runway is
counted in months; Y3 to Y5 are annual. Each line is a driver times a unit cost, and names
the driver: headcount, active customers, requests, a flat contract.

Every line is either **cost of revenue** or **operating expense**. Cost of revenue is what
serving customers costs — production cloud, production inference, per-use third-party
services, payment fees, customer support — and it sets the gross margin. Development,
staging, experiments and internal tools are operating expense. Production inference filed
under R&D flatters the gross margin, and it is the first reclassification a diligence
review makes.

Today's monthly spend is the Y1 baseline. Where the project documents its cloud estate and
paid services in `docs/cloud/` and `docs/saas/`, the baseline links those pages rather than
restating them.

## People

People cost is the headcount plan in [team](team.md), with a salary band applied to each
role; this file keeps no headcount of its own.

- A band is sourced — a salary survey or a set of job postings, with its date and location —
  because the same role costs very differently in two cities.
- Salary is loaded for employer taxes, benefits and insurance, by a factor stated per
  country with its source. In the US that factor commonly runs 1.25–1.4; elsewhere it
  differs, and a factor carried over from another country is wrong in a way nobody notices.
  Contractors are costed at their rate, without the factor.
- Founders are costed at the salary they will draw. A founder drawing nothing is shown at
  zero with the date that ends; a founder salary left out silently is a cost the plan meets
  later with no money assigned to it.
- Cost starts in the month of hire. Recruiting fees, equipment and an annual raise are
  lines of their own.

## Cloud

Cloud splits into a fixed part — environments, CI, monitoring, backups — and a variable part
that scales with a named usage driver. The variable unit cost is measured from production
where production exists, and otherwise estimated from the provider's pricing calculator
with the inputs written down.

Credits and committed-use discounts are a separate negative line with an end date. The
month the credits expire is when the real cost arrives, and a plan that nets them into the
unit price shows a margin that disappears on schedule.

## AI

AI cost is built per model in use, from the same usage figure the revenue charges for:

```text
active users × actions per user per month × model calls per action
  × (input tokens × input price + output tokens × output price)
```

Input and output tokens are priced separately, from the provider's price page, linked and
dated. Model calls per action is measured, not assumed to be one — retries, tool calls and
agent loops multiply it.

The lines beyond production inference are costed too: embeddings and retrieval,
evaluation runs and CI, development and experimentation, fine-tuning, and any reserved
capacity or self-hosted models. Production inference is cost of revenue; the rest is
operating expense.

Today's price is the base case. A falling price is a separate, stated assumption with its
reason, and the downside scenario holds prices flat — a decline baked silently into the
unit price is margin the plan has not earned yet.

Usage is a distribution, not an average. Under a flat price, a small tail of heavy users can
consume the margin of everyone else, so the cost is shown for the reference customer from
[market](market.md) and for a heavy one — the 90th percentile of usage where it has been
measured, and a stated guess where it has not.

The model and its provider are named, along with the fallback the product would move to if
that price or that provider changed.

## Other operating costs

The lines a first plan most often forgets: software subscriptions, legal and accounting,
insurance, company formation and annual filings, security and compliance audits, office or
coworking, travel, marketing spend, recruiting, and payment-processing fees. Marketing spend
ties to the acquisition cost in `business-model.md`.

## Scenarios

A base case and a downside — slower revenue, heavier usage, flat AI prices — at the least.
The section names which costs fall when revenue falls and which do not: salaries and fixed
contracts are what make the downside expensive.
