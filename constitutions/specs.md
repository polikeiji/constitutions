# Product specs

What a specification says about a product, and what it leaves to the code.

The readers are product managers, designers, and business stakeholders. Plain language, no
engineering vocabulary — a sentence that needs a reader who knows the stack belongs
somewhere other than a spec.

## Behaviour, not implementation

Every sentence answers *what does it do?* or *why does it do that?*, never *how is it
built?* No languages, frameworks, cloud services, databases, or infrastructure: naming them
makes the spec wrong the day the implementation moves underneath it, and wrong in a way
nobody notices until they trust it.

> Users receive an email notification when their application status changes.

not

> A Lambda function triggers an SES call when the applications table is updated.

The second is not a rougher description of the same thing. It describes something else —
something the intended reader can neither confirm nor dispute.

## Files

Specs live in `docs/specs/`. A spec running past the length budget is usually holding two
concerns rather than one long one, and the split follows the concerns.

## Shape

Edge cases are part of the behaviour, not an appendix to it, and a short spec that reads as
prose beats the same content pushed under headings. User flows, state transitions, and how
screens relate to one another are what a spec draws. The opening of one, at roughly a
quarter of the length a finished spec runs to:

```markdown
# Email verification

A new account is unverified until the person confirms the address they signed up with.

Signing up sends a verification link to that address. Following it marks the account
verified and clears the reminder banner.

An unverified account can browse and search, but cannot post, comment, or be mentioned
by another user — the restriction is what makes verification worth doing.

The link expires after 24 hours. Requesting a new one invalidates the previous link, so
a forwarded email cannot verify an account a second time.
```
