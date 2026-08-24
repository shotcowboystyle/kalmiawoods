# offline-first-pwa

An agent skill: the rules I follow for building offline-first Progressive Web Apps, in a
format Claude Code, Codex, Cursor and friends can read.

It's all in [SKILL.md](SKILL.md). Service worker caching strategy, precaching, in-app update
prompts, iOS home screen quirks, safe areas and the notch, full-height layout, moving an
installed app to another origin, and how to test any of it. Stack-neutral. Every rule is
something I got wrong first, with the measurement that proved it.

The why is in [PWAs: Personal Web Apps](https://ma.ttias.be/pwas-personal-web-apps/).

## Use it

Claude Code, for every project:

```bash
git clone https://github.com/mattiasgeniar/offline-first-pwa.git \
  ~/.claude/skills/offline-first-pwa
```

For one project only, clone it into `.claude/skills/offline-first-pwa` instead. It'll load
itself when you're working on anything PWA-shaped.

Anything else that reads `AGENTS.md`: copy `SKILL.md` into your project (frontmatter and all,
it's harmless) and point at it from your own `AGENTS.md`, or paste the sections you want.

Or just read it yourself. It's a checklist first and an agent skill second.

## Related

- [pwa-install-prompt](https://github.com/mattiasgeniar/pwa-install-prompt): the install
  banner these tools use, so I don't hand-roll install UX per app.
- [random.ma.ttias.be](https://random.ma.ttias.be): the tools these rules came out of.

Corrections welcome, especially on iOS. Open an issue.
