# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the project. Each ADR documents a significant technical decision, including the context, options considered, and rationale.

## Index

| ADR | Title | Status | Summary |
|---|---|---|---|
| [0001](0001-use-goodjob-for-background-jobs.md) | Use GoodJob for Background Job Processing | Proposed | Replace Sidekiq + Redis with GoodJob (Postgres-backed) to eliminate Redis infrastructure overhead while maintaining reliability and leveraging existing Postgres expertise. |
