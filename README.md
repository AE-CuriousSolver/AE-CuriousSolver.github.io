# Anna-Marie Edeleanu: portfolio

Personal site with two separate entry points, built from one repo so the facts are only kept in one place. Built with Jekyll and published by GitHub Pages, which builds the site automatically whenever `main` is pushed.

## Entry points

| Address | For | Header and footer |
|---|---|---|
| `/profile/` (Home, `/profile/about`, `/profile/employment`) | Jobs, recruiters, mentors: the detail behind my CV | Menu: About, Experience, CV. Footer: email, LinkedIn, GitHub |
| `/services/` | Founders and startups: the selling page | My name and "Let's talk" only. Footer: email and LinkedIn |
| `/` | Anyone who trims the address back: "How can I help?" with a door to each side | None. Hidden from search engines and not in the sitemap |

The two sides never link to each other; the root page is the only place they meet. Shells: `_layouts/default.html` (Profile), `_layouts/services-shell.html` (Services) and `_layouts/landing.html` (root), all built on `_layouts/base.html`.

Old addresses redirect: `/profile/profile` and `/profile/experience` → About, `/profile/projects` → Experience, `/profile/cv` → the CV PDF, `/profile/services` → `/services/`.

## Where the words live

```
_data/
  shared/        copy that appears, in some form, on both sides: every version side by side
    about_me.yml     who I am / what I do: Profile home intro, About page, Services intro
    how_i_work.yml   the three "How I work" versions: diagram (Profile home), cards (About), lines (Services)
    skills.yml       Skills, sketched
    toolkit.yml      Toolkit
    outside.yml      Outside of tech
    projects.yml     "Things I'm building" section words
  profile/       Profile-only: home.yml (metrics, highlights, contact), about.yml (applied experience), experience.yml
  services/      Services-only: page.yml (hero, how I can help, offers, flow chart, selected work, contact)
  landing.yml    the root page
_employment/     roles (shared facts)
_projects/       projects (shared facts)
```

Each shared section is a block in `_includes/sections/` that takes the version to show, so any page can place it, or swap its style. For example, to show the Services "How I work" as cards instead of lines, change `how-i-work-lines.html` to `how-i-work-cards.html` in `_layouts/services.html`. Both styles read `title` + `text`, so any version works in either.

## Editing content

Words live in data files, separate from the layout, so content changes never touch HTML.

- **A role:** each role is one file in `_employment/`.
  - Technical roles: `type: "technical"` and `featured: true`. They appear on the timeline; the Markdown under the front matter is the "Read more" detail.
  - Other roles: `featured: false` and a `type` of `customer-service`, `entertainer` or `childcare`. They appear under "Beyond tech".
  - Every role needs a `sort_key` in `"YYYY-MM"` form (its start date). Roles are listed newest first by this key.
- **A project:** one file in `_projects/`, with `title`, `order` (position on the page), `what`, `purpose`, and optionally `github_link`, `key_stack` (the short line under the title), `stack` (the full list), `how_it_works`, `learnings` and `futures`. `what` and `purpose` can use **bold** for the key points. Keep `futures` as a general direction, not a task list, so it doesn't go stale. Leave out `github_link` for private repos.
- **Services page:** words only used there are in `_data/services/page.yml`. The hero bubbles are listed under `hero.bubbles`: the first four are scattered on the first screen and the rest appear as you scroll. Their positions and links are in `assets/js/services-hero.js` (with a no-JavaScript fallback in `_includes/services-hero.html`), so keep it to eight bubbles or update both. The "Not sure where to start?" flow chart is `start.flow` (the two main paths) and `start.alt` (the "Or" box); each links to an offer `id` or `contact`.
- **Project pop-ups:** "What I'm gaining" on each project opens a pop-up with the full detail; there's nothing to edit beyond the project file.
- **Name, email, links and CV:** `_config.yml`. The CV lives at `profile/assets/files/` so its old address keeps working; if the PDF is renamed, also update the path in `profile/cv.md`.

Never add phone numbers, working rights, visa or time-zone details: the site and this repository are public.

## Design

Three layers, all in `assets/css/site.css`:

- **Paper:** clean text sections that carry the proof (experience, facts).
- **Whiteboard:** dot-grid panels with hand-drawn diagrams (how I work, skills, projects).
- **Ink:** coral and teal accents, a highlighter mark and handwritten notes for personality.

Fonts are Fraunces (headings), Figtree (body) and Caveat (handwriting), loaded from Google Fonts. Colours are defined once as variables at the top of `site.css`.

`assets/js/site.js` makes the whiteboard sketches draw themselves and the headline numbers count up as they scroll into view. Without JavaScript, or with reduced motion turned on, everything shows in its finished state.

## Running it locally

Needs Ruby and Bundler.

```bash
bundle install
LC_ALL=en_US.UTF-8 bundle exec jekyll serve --livereload
```

Then open http://localhost:4000/profile/. Changes to `_config.yml` need a restart; everything else reloads automatically.

## Publishing

Push to `main`. GitHub Pages rebuilds the site within a few minutes.

GitHub Pages only runs [its supported plugins](https://pages.github.com/versions/), so the site doesn't rely on custom Ruby plugins. `theme: minima` stays in `_config.yml` even though every layout is overridden: without it, GitHub Pages falls back to its default theme and the build breaks.
