# 严谨性作答准则

[English](README.md)

一套给 Claude Code 用的行为准则：**宁可慢一点、多问一句，也不要快而错。**

针对的是 LLM 协作里最贵的几种失败：编造听起来合理的事实、把模糊需求猜一个答案默默做完、顺手改了没让改的代码、被轻轻一推就放弃正确结论、没跑就说「已验证」。

> 受 [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) 启发。本项目在其四条原则之外，另外处理了**确定性标注**、**核查优先于回忆**、**抗迎合**、**自检时机**四个问题，并把交付机制从「模型想起来才调用的 skill」改成「**每轮强制注入的提醒**」。

## 九条规则

| | 规则 | 一句话 |
|---|---|---|
| §1 | 零臆造 | 不知道就说不知道，不用听起来合理的内容填空 |
| §2 | 标注确定性 | 确定 / 较有把握 / 推测，三档不得混写成同一种语气 |
| §3 | 依据与时效 | 能查就查，不凭记忆背 API 签名、参数、默认值 |
| §4 | 抗迎合 | 只因证据改口，不因压力改口 |
| §5 | 先问清再动手 | 多种合理解读导向不同工作时先问一句，不默默挑一种 |
| §6 | 最小实现 | 不加没要的功能，不为不可能发生的场景写错误处理 |
| §7 | 改动范围 | 每一行改动都要能追溯到用户的请求 |
| §8 | 先定标准再验证 | 动手前说清「怎样算做完」，没跑就说没跑 |
| §9 | 自检在给结论之前 | 禁止交付后补刀「另外我注意到…」 |

规则正文见 [CLAUDE.md](CLAUDE.md)（英文），每条规则的正反对照见 [EXAMPLES.md](EXAMPLES.md)（英文）。

## 安装

### 方式一：作为 Claude Code 插件（推荐）

```
/plugin marketplace add h0ng1991/optimize-karpathy-rule
/plugin install optimize-karpathy-rule@karpathy-rule
```

装上后会得到两样东西：

- **skill**（`optimize-karpathy-rule`）：承载完整规则，模型可按需调用
- **`UserPromptSubmit` hook**：每轮自动注入精简版提醒，不依赖模型是否想起来去读

第二条才是关键。规则写得再好，模型没加载就等于没写——这是纯 `CLAUDE.md` 方案自己解决不了的问题。

### 方式二：作为项目级 CLAUDE.md

新项目：

```bash
curl -o CLAUDE.md https://raw.githubusercontent.com/h0ng1991/optimize-karpathy-rule/main/CLAUDE.md
```

追加到已有的 CLAUDE.md：

```bash
echo "" >> CLAUDE.md
curl https://raw.githubusercontent.com/h0ng1991/optimize-karpathy-rule/main/CLAUDE.md >> CLAUDE.md
```

### 方式三：作为全局准则

把 [CLAUDE.md](CLAUDE.md) 的内容放进 `~/.claude/CLAUDE.md`，对所有项目生效。

## 自定义

| 想改什么 | 改哪个文件 |
|---|---|
| 每轮注入的提醒正文 | `hooks/reminder.md` |
| 完整规则正文 | `CLAUDE.md` **和** `skills/optimize-karpathy-rule/SKILL.md`（两者正文需保持一致） |
| 关掉每轮注入，只留 skill | 删掉 `.claude-plugin/plugin.json` 里的 `"hooks"` 字段 |

`hooks/reminder.md` 每一轮都会进上下文，所以必须短——目前约 3.1k 字符。完整规则放 `CLAUDE.md`，别把长文塞进注入文本。

## 工作原理

```
.claude-plugin/plugin.json          插件清单，声明 skill 和 hook
.claude-plugin/marketplace.json     市场清单，供 /plugin marketplace add 使用
CLAUDE.md                           完整规则正文
EXAMPLES.md                         每条规则的正反对照
skills/optimize-karpathy-rule/
  SKILL.md                          同一份正文 + frontmatter，可作为 skill 调用
hooks/hooks.json                    声明 UserPromptSubmit 钩子
hooks/inject-rigor.js               读 reminder.md，输出 additionalContext JSON
hooks/reminder.md                   每轮注入的精简版提醒
```

hook 脚本用 Node 写，跨平台，路径经 `${CLAUDE_PLUGIN_ROOT}` 解析。若运行环境里没有 node，把 `hooks/hooks.json` 的 `command` 换成等价的 shell 命令即可——脚本只做一件事：读 `reminder.md`，输出一段 JSON。

## 适用边界

这套规则**偏向谨慎而非速度**，在琐碎任务上会显得啰嗦。正文里写明了「琐碎任务自行判断，不必条条硬套」，但使用者仍需有意识地放宽。

如果你要的是「快速出草稿、错了再说」，这套规则不适合你。

## License

MIT
