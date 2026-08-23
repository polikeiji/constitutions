# frozen_string_literal: true

source "https://rubygems.org"

# Built by `bundle exec jekyll build` in .github/workflows/pages.yml rather than
# by actions/jekyll-build-pages, so the plugin versions below are ours to choose
# instead of whatever the `github-pages` gem currently pins.
#
# Pinned to the patch level rather than the minor, because no Gemfile.lock is
# committed: setup-ruby resolves this file on every run, so anything wider means
# an upstream minor release deploys itself. jekyll-readme-index 0.4.0 rewriting
# README discovery three weeks ago is the example to avoid repeating. Committing
# a lockfile is the real fix and needs a machine with Ruby >= 3.0.
gem "jekyll", "~> 4.4.1"

# No theme gem on purpose — see _layouts/default.html. minima 2.5.2 (the current
# release) has no skins and no custom-styles seam, so it would contribute dated
# Sass and nothing #10 could build a palette on.

group :jekyll_plugins do
  gem "jekyll-optional-front-matter", "~> 0.3.3"
  gem "jekyll-readme-index", "~> 0.4.0"
  gem "jekyll-relative-links", "~> 0.8.0"
  gem "jekyll-seo-tag", "~> 2.9.0"
  gem "jekyll-titles-from-headings", "~> 0.5.4"
end
