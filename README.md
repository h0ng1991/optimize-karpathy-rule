# Rigor Guidelines

[中文](README.zh.md)

Behavioral guidelines for Claude Code: **better slow and one question late than fast and wrong.**

They target the expensive failure modes in LLM collaboration — inventing plausible-sounding facts, silently picking one reading of an ambiguous request and finishing it, touching code that was never in scope, reversing a correct answer under mild pushback, and claiming "verified" without running anything.

> Inspired by [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills). Beyond its four principles this project adds four more — **labeled confidence**, **verification over recall**, **anti-sycophancy**, and **self-check timing** — and changes the delivery mechanism from *a skill the model invokes when it remembers to* into *a reminder injected every turn*.

## The nine rules

| | Rule | In one line |
|---|---|---|
| §1 | Zero fabrication | If you don't know, say so — don't fill the gap with plausible text |
| §2 | Label confidence | Certain / fairly confident / speculation — never blur all three into one tone |
| §3 | Evidence and recency | Read the file, run the search; never recite API signatures or defaults from memory |
| §4 | Anti-sycophancy | Change your answer for evidence, never for pressure |
| §5 | Ask before acting | When readings differ materially, ask — don't silently pick one |
| §6 | Minimal implementation | No unrequested features, no error handling for impossible cases |
| §7 | Change scope | Every changed line must trace to the user's request |
| §8 | Criteria first, then verify | State what "done" means upfront; if you didn't run it, say so |
| §9 | Self-check before concluding | No post-delivery "by the way, I also noticed…" |

Full text: [CLAUDE.md](CLAUDE.md). Before/after pairs for every rule: [EXAMPLES.md](EXAMPLES.md).

## Install

### As a Claude Code plugin (recommended)

```
/plugin marketplace add h0ng1991/optimize-karpathy-rule
/plugin install optimize-karpathy-rule@karpathy-rule
```

You get two things:

- **A skill** (`optimize-karpathy-rule`) carrying the full ruleset, invocable on demand.
- **A `UserPromptSubmit` hook** that injects a condensed reminder on every turn, independent of whether the model decides to read anything.

The second is the point. Rules the model never loads are rules that do not exist — which is the failure mode a plain `CLAUDE.md` cannot fix on its own.

### As a project-level CLAUDE.md

New project:

```bash
curl -o CLAUDE.md https://raw.githubusercontent.com/h0ng1991/optimize-karpathy-rule/main/CLAUDE.md
```

Append to an existing one:

```bash
echo "" >> CLAUDE.md
curl https://raw.githubusercontent.com/h0ng1991/optimize-karpathy-rule/main/CLAUDE.md >> CLAUDE.md
```

### As global guidelines

Put the contents of [CLAUDE.md](CLAUDE.md) into `~/.claude/CLAUDE.md` to apply them across every project.

## Customizing

| To change | Edit |
|---|---|
| The per-turn reminder | `hooks/reminder.md` |
| The full rule text | `CLAUDE.md` **and** `skills/optimize-karpathy-rule/SKILL.md` (keep the bodies identical) |
| Disable per-turn injection, keep the skill | Remove the `"hooks"` field from `.claude-plugin/plugin.json` |

`hooks/reminder.md` enters the context window on every single turn, so keep it short — it currently runs about 2.9k characters. The full ruleset belongs in `CLAUDE.md`; do not move it into the injected text.

## How it works

```
.claude-plugin/plugin.json          Plugin manifest — declares the skill and the hook
.claude-plugin/marketplace.json     Marketplace manifest for /plugin marketplace add
CLAUDE.md                           Full rule text
EXAMPLES.md                         Before/after pair for each rule
skills/optimize-karpathy-rule/
  SKILL.md                          The same rule text plus frontmatter, invocable as a skill
hooks/hooks.json                    Declares the UserPromptSubmit hook
hooks/inject-rigor.js               Reads reminder.md, emits the additionalContext JSON
hooks/reminder.md                   The condensed reminder injected every turn
```

The hook script is written in Node, is cross-platform, and resolves its own path through `${CLAUDE_PLUGIN_ROOT}`. If your environment has no `node`, swap the `command` in `hooks/hooks.json` for an equivalent shell one-liner — the script does exactly one thing: read `reminder.md` and print a JSON object.

## Scope and limits

These rules **bias toward caution over speed**, and on trivial tasks they will feel verbose. The text says so explicitly ("use judgment on trivial tasks"), but a reader still has to grant that latitude deliberately.

If what you want is "draft fast, fix later", this is the wrong ruleset.

## License

MIT
