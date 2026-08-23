# frozen_string_literal: true

source "https://rubygems.org"

# Built by `bundle exec jekyll build` in .github/workflows/pages.yml rather than
# by actions/jekyll-build-pages, so the plugin versions below are ours to choose
# instead of whatever the `github-pages` gem currently pins.
gem "jekyll", "~> 4.4"

# Deliberately plain: #10 hand-writes the palette on top, so the base theme
# should have as few opinions about colour as possible. minima 2.5 also ships a
# `skin: auto` that follows prefers-color-scheme, which is #10's starting point.
gem "minima", "~> 2.5"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-optional-front-matter", "~> 0.3"
  gem "jekyll-readme-index", "~> 0.3"
  gem "jekyll-relative-links", "~> 0.7"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-titles-from-headings", "~> 0.5"
end
