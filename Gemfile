# frozen_string_literal: true

source "https://rubygems.org"

# Built by `bundle exec jekyll build` in .github/workflows/pages.yml rather than
# by actions/jekyll-build-pages, so the plugin versions below are ours to choose
# instead of whatever the `github-pages` gem currently pins.
gem "jekyll", "~> 4.4"

# No theme gem on purpose — see _layouts/default.html. minima 2.5.2 (the current
# release) has no skins and no custom-styles seam, so it would contribute dated
# Sass and nothing #10 could build a palette on.

group :jekyll_plugins do
  gem "jekyll-optional-front-matter", "~> 0.3"
  gem "jekyll-readme-index", "~> 0.3"
  gem "jekyll-relative-links", "~> 0.7"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-titles-from-headings", "~> 0.5"
end
