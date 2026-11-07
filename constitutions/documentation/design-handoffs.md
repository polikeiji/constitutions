# Design handoffs

What a design handoff is, where it lives, which rules for human-maintained documents it is
exempt from, what it still owes, and when it goes.

## Rules

### What one is

1. A design handoff is a prototype and the `HANDOFF.md` that tells the coding agent what to
   carry from it into the code. It is written for the coding agent first, which reads it
   whole, beside the prototype it describes change by change, while the work is in flight.
2. A spec, an ADR or an application document is not a handoff, even where a coding agent
   reads it. Those describe the system as it is and are kept true by the humans who return
   to them; a handoff describes a change that has not shipped yet.

### Where it lives

3. A handoff lives in `docs/design-handoffs/<handoff>/`, holding the prototype files and
   `HANDOFF.md`, with the folder named for the change it carries. One folder per handoff, so
   two handoffs never share an index or a prototype.

```text
docs/design-handoffs/
  analyst-precision/
    HANDOFF.md
    prototype.html
```

### What it is exempt from

4. `design-handoffs/` and each handoff folder carry no `README.md` index, against
   [file-organization.md](file-organization.md) rules 6 to 8. A handoff's own
   `HANDOFF.md` is the page a reader lands on, and an index over a folder that empties
   itself as work ships is one more thing to keep true for no reader.
5. `HANDOFF.md` is exempt from the word and line budget, under
   [document-sizing.md](document-sizing.md) rule 11, which carries the reason.
6. It is a plan, which [cross-referencing.md](cross-referencing.md) otherwise keeps in the
   ticket. A prototype cannot be pasted into a ticket, and the account of what changed in it
   belongs beside it.
7. Whether the docs site publishes or excludes `design-handoffs/` is the project's choice.
   An excluded tree is exempt from sizing already, under document-sizing.md rule 11.

### What it still owes

8. `HANDOFF.md` opens, under its title and one sentence, by saying that it is a design
   handoff exempt from the documentation rules, so a human who lands on it does not treat
   it as documentation.
9. It names the commit the prototype was built from, and says that today's code and specs
   win wherever the prototype disagrees with them about something the handoff does not
   list. A prototype is built from a snapshot, and only its listed changes are intended.
10. It lists each change, where that change is in the prototype, and what it touches in the
    code and the docs.
11. The prototype is committed and self-contained, so the coding agent opens it from the
    checkout. A link to a hosted prototype that needs a sign-in is a pointer for humans,
    never the only copy.

### What it does not replace

12. Each pull request that implements part of a handoff still edits the specs, ADRs and
    application documents it makes wrong. The handoff is the instruction to change them,
    not a substitute for them.
13. Each ticket cut from a handoff still carries its own share of it, self-sufficient as
    [tickets.md](../github-projects/tickets.md) requires, and links the handoff in its
    Context as the source.

### When it goes

14. The pull request that closes the last ticket cut from a handoff deletes its folder.
    Once the change ships, the code and the docs say what the handoff said, and a copy left
    behind is a second home for every fact in it that nobody keeps true. Git keeps the
    record.

## Rationale

The budget, the folder index and the one-home rule exist for a human who returns to a
document and maintains it. A handoff has a different reader and a shorter life: a coding
agent bridging a prototype and its implementation, for as long as the tickets cut from it
are open. Naming the exception keeps each such folder from being a one-off that the next
reader either copies blindly or tidies away, and the deletion rule keeps the exception from
outliving the work it serves.
