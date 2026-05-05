  
**StrategyOS**

**Conversational Surface**

Design Specification & Implementation Plan

MCP \+ Prefab UI Integration

Version 1.0  |  April 2026

Status: Design Specification

# **Contents**

1\. Strategic Rationale

2\. Architecture Overview

3\. The Two-Surface Model

4\. Interaction Patterns & Handoffs

5\. Enrichment Loop

6\. Question-Driven Rendering (Response Composer)

7\. MCP Server Specification

8\. Tool Registry

9\. Embedded Panel Specification (440px Side Panel)

10\. Dedicated Intelligence Screen (Full Page)

11\. Panel / Screen Handoff Model

12\. Web App Simplification Plan

13\. Implementation Phases

14\. Sequencing Decision: Build Before or After New Assets?

15\. Design Constraints & Principles

16\. Risk Register

17\. Appendix: Prefab Component Mapping

# **1\. Strategic Rationale**

StrategyOS currently operates through a single interaction surface: a Next.js web application built around spatial canvases (Wardley Maps, Systems Maps, Asset Graph), structured asset viewers (Decision Stack, OKR Cascade), and an AI-powered intelligence layer (Briefings, Signals, Insights, Coherence Checks).

This specification introduces a second interaction surface: a conversational interface powered by MCP (Model Context Protocol) and rendered via Prefab UI. The two surfaces are complementary, not competing. Each is optimised for a different cognitive mode.

### **The core distinction**

| Dimension | Web App (Workspace) | Conversational Surface (Dialogue) |
| :---- | :---- | :---- |
| Cognitive mode | Spatial reasoning, persistent structure | Inquiry, reasoning, decision-making |
| Optimised for | Seeing relationships, editing structure | Asking questions, exploring meaning |
| Data presentation | Canvases, graphs, structured views | Cards, charts, interactive widgets |
| AI role | Background evaluator, insight feed | Active coaching partner in dialogue |
| Interaction pattern | Click, drag, edit fields | Ask, read, decide, capture |
| Best at | Showing what things ARE | Explaining what things MEAN |

### **Why this matters for StrategyOS**

The core product principle is that AI creates the illusion human judgement is not needed, and the real design challenge is making the irreplaceable parts of human judgement visible. The web app surfaces structure. The conversational surface surfaces meaning and provokes the decisions that only humans can make. Together, they complete the coaching loop.

| Design principle: The web app shows what things ARE and how they connect. The conversational surface explains what things MEAN and what to do about them. Both share the same data layer. Each makes the other better. |
| :---- |

# **2\. Architecture Overview**

### **2.1 System topology**

The conversational surface introduces a Python-based MCP server that sits alongside the existing Next.js application. Both surfaces connect to the same Supabase/Postgres data layer. The MCP server is the single backend for both the embedded panel and external MCP host access.

| Layer | Technology | Role |
| :---- | :---- | :---- |
| Data layer | Supabase / Postgres | Assets, insights, signals, briefings, asset\_links. Single source of truth for both surfaces. |
| Intelligence layer | Existing pipeline (ContextAssembler, InsightExtraction, AssetIntelligence, CoherenceCheck, SynthesisAggregator) | Runs identically regardless of which surface triggered it. Haiku for routing, Sonnet for evaluation. |
| Web app | Next.js / React / React Flow / Zustand / Tailwind | Spatial canvases, structured asset viewers, navigation, strategy management. Primary workspace. |
| MCP server | Python / FastMCP / Prefab UI | Conversational tools that query the data layer and return Prefab component trees. Handles tool calls, state, and rendering protocol. |
| Embedded panel | Prefab renderer (static bundle) hosted inside Next.js app | Right-side panel in Strategy Workspace. Renders Prefab JSON from MCP server. Reads Zustand store for contextual awareness. |
| External MCP access | Claude Desktop / ChatGPT / any MCP-compatible host | Secondary access point. Same MCP server, same tools. No contextual awareness of web app state. |

### **2.2 Data flow**

Both surfaces read from and write to the same database tables. The intelligence pipeline is invoked identically by either surface. The key difference is presentation: the web app renders spatial views; the MCP server returns Prefab component trees.

Read path: User asks question in conversation \> MCP tool queries Supabase \> ContextAssembler pulls relevant assets \> Response Composer selects rendering strategy \> Prefab component tree returned \> Renderer displays interactive cards/charts.

Write path: User makes decision in conversation \> CallTool action writes to Supabase (assets, asset\_links, insights tables) \> Web app sees updated data on next render \> Asset graph reflects new connections.

Intelligence trigger path: Either surface can trigger the intelligence pipeline \> Pipeline runs against current asset state \> Results written to signals/insights/briefings tables \> Both surfaces reflect the updated intelligence.

# **3\. The Two-Surface Model**

### **3.1 What stays in the web app**

The web app retains all components where spatial reasoning or persistent visual structure is genuinely required. The following stay unchanged:

* **Strategy List screen.** Entry point to all strategic work. Spatial, persistent, comparison-oriented. No simplification needed.

* **Spatial canvases.** Wardley Map, Systems Map, Asset Graph Explorer. These are core spatial reasoning surfaces. They stay in the web app. NOTE: Do not remove text overlays or commentary panels from canvases until the conversational surface has proven it can carry the analytical weight. Defer canvas simplification to a later phase.

* **Asset renderers.** Decision Stack, OKR Cascade, Stakeholder Architecture, and all other structured asset viewers remain in the web app. These show the asset itself (what it IS), not analytical commentary. Even though they are text-heavy, they are the canonical view of the user's own work.

* **Strategy creation.** Creating a new strategy, basic CRUD, strategy settings. Stays in the web app.

### **3.2 What the conversational surface handles**

The conversational surface handles interactions that are fundamentally temporal, inquiry-driven, or coaching-oriented:

* **Intelligence engagement.** Reading, exploring, and acting on briefings, signals, insights, and coherence check results. The web app retains notification indicators; the conversation handles the depth.

* **Analytical questioning.** Any question about what the strategy means, where the risks are, what is missing, or how layers relate to each other.

* **Gap-filling and enrichment.** Conversational collection of missing data: assumptions, falsification conditions, confidence calibration, narrative context.

* **Flow execution (future).** Creation flows (Orient, Gather, Confirm, Lock) can move to conversation. The web app keeps flow status indicators and the assets the flows produce.

* **Cross-reference discovery.** Surfacing connections between layers that structured editing would not reveal.

* **Strategy timeline / history.** Chronological review of what happened and when. Naturally temporal, well-suited to scrollable cards.

### **3.3 Empty states**

With the conversational surface available, empty states in the web app become invitations rather than problems. An empty asset viewer offers three paths:

1. **Upload a document.** File-based creation. Stays in web app. Quick-start for users who have existing materials.

2. **Generate with AI.** One-click creation. Stays in web app. Quick-start for users who know what they want.

3. **Build in conversation.** Opens the conversational surface with the relevant flow pre-loaded. Guided path for users who want to think it through.

All three produce the same structured asset in the same data layer. The entry point differs; the output converges.

# **4\. Interaction Patterns & Handoffs**

Movement between surfaces is bidirectional but asymmetric. Each surface has different strengths for initiating and receiving.

### **4.1 Chat to Web App (inquiry produces structure)**

The user is in conversation, exploring a question. The conversational surface renders interactive intelligence. At some point the conversation produces something worth persisting: a new assumption surfaced, a decision reached, a confidence score adjusted, a contradiction resolved.

**Handoff mechanism:** A CallTool action writes the result to Supabase (the same tables the web app reads). The tool can optionally push a deep link via SendMessage: "Decision captured — open in workspace to see how it connects to the rest of the graph." The web app does not need to know the decision came from a chat session. It sees a new record in the asset graph with provenance metadata (source: mcp\_session, timestamp, session context).

| Design principle: The chat surface proposes, the web app disposes. Anything generated conversationally lands in the asset graph with appropriate confidence markers and a "pending review" status. The web app is where the user promotes it to a committed strategic position. This prevents the chat from silently mutating the canonical strategy without deliberate spatial reasoning. |
| :---- |

### **4.2 Web App to Chat (structure provokes inquiry)**

The user is in the workspace, looking at their asset graph or a Wardley Map. They notice something and want to think about it, not restructure it.

**Handoff mechanism:** The user clicks an "Explore in conversation" affordance on any asset, insight indicator, or canvas component. If using the embedded panel, it opens with context pre-loaded (the panel reads the current route and selection state from the Zustand store). If using external MCP, a deep link opens the conversation with relevant context passed as tool arguments.

### **4.3 Web App prompts that invite conversation**

The web app can surface prompts that invite conversational exploration. An insight indicator that says "3 layers disagree on build vs. buy for Auth" could include an action that opens the conversational surface pre-loaded with the relevant coherence check results. The web app becomes a departure point for reasoning, not just a destination for results.

### **4.4 Provenance and write-back rules**

| Write source | Status on creation | Provenance metadata | User action required |
| :---- | :---- | :---- | :---- |
| Web app (direct edit) | Committed | source: web\_app | None |
| Conversational surface (CallTool) | Pending review | source: mcp\_session, session\_id, timestamp | User promotes to committed in web app |
| Intelligence pipeline | AI-generated | source: intelligence\_pipeline, run\_id | User reviews and accepts/dismisses |

# **5\. Enrichment Loop**

The conversational surface actively improves the quality of data in the web app. This is where the interaction model becomes more powerful than either surface alone.

### **5.1 Conversational gap-filling**

The intelligence pipeline detects gaps: missing assumptions, incomplete component trees, low-confidence signals. Today these surface as insight cards. In the conversational surface, the system can ask directly. The user answers conversationally; the tool parses their response into the structured format the asset schema expects; the write-back populates the field. The user never navigated to the right screen or found the right form field.

Example: "Your Decision Stack for Project X has a vision statement but no falsification conditions. What would prove this strategy wrong?" User answers in natural language. Tool extracts structured falsification conditions and writes them to the decision\_stack asset record.

### **5.2 Confidence calibration through dialogue**

Confidence scores are currently set by AI evaluators. The user's actual confidence may be different. The conversational surface renders key assumptions with their current confidence levels and asks: "Do these feel right to you?" Sliders or radio groups for each assumption, each a CallTool that updates the confidence field in the asset record. The system is coaching the user to be explicit about their uncertainty.

### **5.3 Cross-reference discovery**

The user asks a question that spans multiple layers. The system pulls from the Wardley Map, Decision Stack, Stakeholder Architecture, and Systems Map. It renders a multi-card response showing each layer's perspective. The user reads it and says: "I had not connected the stakeholder impact to the systems dependency — link those." A CallTool creates an asset\_link record in the graph. The web app now shows a cross-layer edge that did not exist before. The conversation discovered a relationship that structured editing would not have surfaced.

### **5.4 Narrative capture**

Strategic reasoning often happens in natural language: the why behind a decision, the context that makes an assumption make sense. The conversational surface captures the user's reasoning as they talk through a decision, extracts the structured components (decision, rationale, assumptions, falsification conditions), and writes both the structured data and the narrative provenance to the asset graph. The web app gets clean structured data; the system retains the reasoning trail.

# **6\. Question-Driven Rendering (Response Composer)**

The system does not need pre-built screens for every question type. It composes the right Prefab response dynamically based on what the question requires. The architecture has three steps.

### **6.1 Step 1: Question classification**

The MCP server classifies the user's question to determine a rendering strategy. Classification categories:

| Category | Trigger patterns | Rendering strategy |
| :---- | :---- | :---- |
| Status inquiry | "How is my strategy looking?", "What is the state of X?" | Briefing dashboard: signal feed, confidence overview, recent changes. Cards with severity badges, sparklines for trends. |
| Asset inspection | "Show me the decision stack", "What does our Wardley Map say about X?" | Structured card with drillable detail. Related assets sidebar. Accordion for layers of depth. |
| Analytical question | "What are the risks of X?", "What does the system know about Y?" | Multi-layer synthesis: per-layer cards, cross-reference highlights, coherence indicators. Tabbed layout if \>3 layers. |
| Comparison | "How does option A compare to option B?", "Compare these two strategies" | Side-by-side grid. Radar charts. Bar charts for confidence distribution. RadioGroup to toggle between scenarios. |
| Gap exploration | "What am I missing?", "Where are the gaps?" | Gap analysis cards grouped by layer. Each with suggested action and a CallTool button to fill the gap. |
| Decision support | "Should we build or buy X?", "What is the best approach?" | Evidence cards from each relevant layer. Pro/con layout. Confidence-weighted summary. Explicit coaching: "This is where your judgement matters." |
| Enrichment prompt | "What assumptions are we making?", "What would prove this wrong?" | Editable cards with sliders, inputs, radio groups. Each input a CallTool that writes back to the asset. |

### **6.2 Step 2: Context assembly**

The same ContextAssembler from the existing intelligence pipeline pulls the relevant assets, insights, and signals. No new backend infrastructure required. The assembler receives the classified question type and the entity references extracted from the question, and returns the relevant data payload.

### **6.3 Step 3: Prefab composition**

A rendering layer maps the classified question type and assembled context to a Prefab component tree. This is a set of Python functions that take structured data and return PrefabApp instances. Component choices are determined by data shape and density: a single asset renders as a detailed card; multiple assets render as a data table or comparison grid; trends render as charts; contradictions render as side-by-side cards with conflict badges.

| Critical constraint: Every response must make explicit what it chose to show and what it left out. A footer on every response: "Showing: Decision Stack, Wardley Map, Stakeholder Architecture. Not consulted: Systems Map (no relevant data), OKR Cascade (not yet created)." The user must know the boundaries of the analysis, not assume completeness. |
| :---- |

# **7\. MCP Server Specification**

### **7.1 Technology stack**

| Component | Technology | Notes |
| :---- | :---- | :---- |
| Framework | FastMCP (Python) | Native Prefab integration via fastmcp\[apps\] |
| UI rendering | Prefab UI | 100+ shadcn/ui-based components. JSON protocol rendered by bundled React frontend. |
| Database access | Direct Supabase/Postgres connection | Same connection string as the Next.js app. Read/write access to assets, insights, signals, briefings, asset\_links tables. |
| AI models | Claude Haiku (classification, routing) \+ Claude Sonnet (evaluation, synthesis) | Same model split as existing intelligence pipeline. |
| Transport | MCP protocol (SSE) | Served via FastMCP. Consumed by embedded panel and external MCP hosts. |
| Deployment | Standalone Python service | Runs alongside Next.js app. Can be containerised independently. |

### **7.2 Server structure**

The MCP server is organised into four layers:

4. **Tool layer.** FastMCP tool definitions. Each tool is a Python function decorated with @mcp.tool(app=True) that returns a PrefabApp. Entry-point tools are visible to the model. Helper tools use AppConfig(visibility=\["app"\]).

5. **Composer layer.** The Response Composer: question classification, context assembly, and Prefab component tree construction. Maps structured data to rendering strategies.

6. **Data access layer.** Supabase client wrapper. Provides typed queries against the asset graph, intelligence tables, and relationship tables.

7. **Intelligence bridge.** Thin adapter that invokes the existing intelligence pipeline (ContextAssembler, InsightExtraction, CoherenceCheck) from the Python MCP server. May call the Next.js API endpoints or invoke shared pipeline logic directly.

### **7.3 Conversation endpoint architecture**

The Python server exposes two interfaces that coexist in the same process:

1. **MCP interface** (stdio or HTTP transport) — serves Claude Desktop and external MCP hosts. Tools return `ToolResult` with both text summaries (for Claude to chain tool calls) and `structured_content` (Prefab UI for visual rendering). This is the external access surface.

2. **Conversation endpoint** (`POST /conversation`) — serves the embedded panel and Intelligence Screen in the Next.js app. This endpoint manages a **Claude-powered multi-turn conversation** with strategy context.

The conversation endpoint architecture:

| Component | Role |
| :---- | :---- |
| Session state | Server-managed per session. Each session holds: conversation history (turns), strategy context snapshot, active tool results, pending write actions. Sessions are keyed by a session\_id issued on first turn. |
| System prompt | Lightweight strategy summary (~1,500 tokens): strategy name, asset list (type + title + status), signal summary (counts by severity), findings summary, available tool names. Full data loaded on-demand via tool calls. See cost optimisation guide Section 2.1. |
| Claude API calls | Each user turn is sent to the Claude API as a message in the session's conversation history. Claude has access to tools (same implementations as the MCP tools) via `tool_use`. Claude calls tools as needed, sees results, and composes a response combining analytical prose and structured card data. |
| Model routing | Not every turn needs Sonnet. The server classifies each turn before calling Claude: simple turns (confirmation, acknowledgment, next-card presentation) use Haiku ($1/$5 per MTok); analytical turns (synthesis, coaching, cross-asset reasoning) use Sonnet ($3/$15 per MTok). See cost optimisation guide Section 1. |
| Prompt caching | The system prompt carries `cache_control: {"type": "ephemeral"}` for 90% cache-hit savings on turns 2–N within a session. See cost optimisation guide Section 3. |
| Conversation history management | Sliding window: last 5 turns in full, older turns compressed to a ~200-token summary via Haiku. Caps context growth for long sessions (stress-testing, conflict resolution). See cost optimisation guide Section 2.2. |
| Response format | Claude returns structured JSON via `tool_use` for card rendering, plus prose text for coaching narrative. The panel renders cards as native React components and prose as formatted text. Each response ends with a coaching prompt or suggested next action — the conversation always moves forward. |
| Write-back | Interactive card actions (buttons, text inputs, sliders) are sent back to the server as the next conversation turn. The server executes the write (Supabase), adds provenance metadata (`source: mcp_session, session_id, timestamp`), and feeds the result back to Claude for continuation. |

**Request/response contract:**

```
POST /conversation
Request:  { session_id?: string, strategy_id: string, message: string, action?: { tool: string, args: object } }
Response: { session_id: string, turns: [{ role, content, cards?, actions? }], context: { strategy_id, asset_id? } }
```

When `session_id` is omitted, the server creates a new session and loads strategy context. When `action` is provided (from a card interaction), it is executed as a tool call and the result is fed to Claude as context for the next response.

**Coexistence with MCP:** Both interfaces share the same tool implementations, data access layer, and composer functions. The MCP interface wraps tools in `@mcp.tool(app=True)` decorators returning `ToolResult` with Prefab content. The conversation endpoint calls the same underlying functions but routes through Claude's `tool_use` protocol, allowing Claude to chain tools and compose multi-tool responses within a single turn.

# **8\. Tool Registry**

Tools are divided into entry-point tools (visible to the model, invokable by the host) and helper tools (visible to the UI only, invoked via CallTool from rendered components).

| The same tool implementations serve both the MCP server (as FastMCP tools returning ToolResult with Prefab content) and the conversation endpoint (as Claude tool\_use definitions returning structured JSON). The tools are the shared backbone. Each tool has: (1) a data-fetching function that queries Supabase, (2) a composer function that builds the visual output, and (3) a text summary function that provides Claude-readable context for chaining. The MCP interface uses all three; the conversation endpoint uses (1) and (3), with Claude composing the visual response via structured output. |
| :---- |

### **8.1 Entry-point tools (app=True)**

| Tool name | Purpose | Returns |
| :---- | :---- | :---- |
| strategy\_briefing | Renders the current intelligence state for a strategy: latest briefings, active signals, recent insights, coherence status. | Dashboard layout: metric cards (signal count, coherence score, confidence avg), signal feed as scrollable cards with severity badges, briefing headline with drill-into action. |
| inspect\_asset | Renders a single strategy asset with its analytical context, cross-references, and related intelligence. | Tabbed card: Tab 1 \= asset position across layers. Tab 2 \= related signals/insights sorted by severity. Tab 3 \= coherence check results for this asset. |
| ask\_strategy | The general-purpose analytical tool. Receives a natural-language question, classifies it, assembles context, and returns the appropriate rendering. | Variable: depends on question classification (see Section 6). Could be a single card, a multi-layer comparison, a gap analysis, or a decision support layout. |
| strategy\_overview | High-level strategy health: which assets exist, which are missing, overall coherence score, recommended next actions. | Grid of asset status cards (exists/missing/stale) with confidence indicators. Recommended actions as CallTool buttons. |

### **8.2 Helper tools (visibility=\["app"\])**

| Tool name | Purpose | Triggered by |
| :---- | :---- | :---- |
| get\_asset\_detail | Returns full detail for a single asset. Populates drill-down slots. | CallTool from asset cards in any entry-point tool response. |
| get\_signal\_detail | Returns full signal narrative with source references. | CallTool from signal cards in the briefing dashboard. |
| update\_confidence | Writes a confidence score update to an asset field. | Slider or radio group interaction in confidence calibration cards. |
| capture\_assumption | Writes a new assumption to an asset's assumption array. | Text input submission in gap-filling cards. |
| create\_asset\_link | Creates an asset\_link record between two assets. | "Link these" action in cross-reference discovery. |
| run\_coherence\_check | Triggers the coherence pipeline for a specific strategy or asset pair. | "Check coherence" button in strategy overview or after enrichment. |
| search\_assets | Searches assets by type, keyword, or relationship. Used for filtering and lookup. | Combobox or search input in various views. |

# **9\. Embedded Panel Specification (440px Side Panel)**

### **9.1 Placement and behaviour**

The conversational panel occupies the right side of the Strategy Workspace, replacing the current right-panel insight feed (ContextDrawer). It hosts a **Claude-powered conversation**, not a static renderer consuming MCP tools. The panel sends user messages to the conversation endpoint (Section 7.3), receives structured responses (prose + cards), and renders them as native React components styled with StrategyOS design tokens. Interactive card actions (buttons, text inputs, sliders) feed back into the conversation as the next turn.

| Property | Specification |
| :---- | :---- |
| Position | Right side of Strategy Workspace, adjacent to the centre canvas. Replaces the current 300px ContextDrawer. |
| Width | 440px when open. Collapsible to a thin strip (\~48px) with a chat icon. |
| Default state | Collapsed. Expands on click, or when user triggers an "Explore in conversation" action from any asset or indicator. |
| Layout when open | Top: "current context" indicator (e.g. "Viewing: Wardley Map — Project X") \+ expand-to-full-screen icon \+ close button. Middle: scrollable conversation area (coaching prose \+ interactive cards). Bottom: text input for questions \+ send button. |
| Rendering | Native React components using `styles/tokens.ts` — not Prefab. Cards, badges, accordions, and interactive elements use existing StrategyOS UI patterns. Charts use recharts (same library shadcn/ui uses). This ensures the panel looks like part of the app, not an embedded third-party widget. |
| Interaction model | Every Claude response ends with a coaching prompt or suggested next action. The panel always moves the conversation forward. Card actions (confirm, dismiss, adjust) send structured actions back to the conversation endpoint, which executes the write and feeds the result to Claude for continuation. |
| Responsive | On narrow viewports (\<1200px), panel becomes a full-screen overlay rather than a side panel. |
| Centre canvas | Expands to full width when panel is collapsed. Contracts when panel opens. Same pattern as Linear detail panels. |
| Expand affordance | Persistent icon in panel header that opens the current conversation session in the dedicated Intelligence Screen (Section 10). Conversation state carries over. |

### **9.2 Contextual pre-loading**

When the panel opens, it automatically loads context based on what the user is currently viewing in the web app. The panel reads the current route and selection state from the Zustand store.

| User is viewing... | Panel pre-loads... | Tool invoked |
| :---- | :---- | :---- |
| Strategy Workspace (no selection) | strategy\_briefing for the current strategy | strategy\_briefing(strategy\_id) |
| Asset Graph with a node selected | inspect\_asset for the selected asset | inspect\_asset(asset\_id) |
| Wardley Map with a component selected | inspect\_asset scoped to the component | inspect\_asset(asset\_id, component\_id) |
| Insight notification clicked | The specific insight with full context | get\_signal\_detail(signal\_id) |
| Decision Stack viewer | inspect\_asset for the decision stack | inspect\_asset(asset\_id) |
| Empty asset (no content yet) | strategy\_overview with gap analysis | strategy\_overview(strategy\_id) |

### **9.3 Communication between panel and web app**

The panel and web app communicate through two channels:

8. **Zustand store (panel reads web app state).** The panel reads the current strategy\_id, selected asset\_id, current route, and any selection state. This is read-only from the panel's perspective. The web app owns this state.

9. **Supabase (shared data layer).** When the panel writes data via CallTool (new assumptions, confidence updates, asset links), the web app sees the changes on its next render or via Supabase realtime subscriptions. No direct state coupling between panel and web app UI.

### **9.4 Panel rendering constraints**

At 440px, the panel cannot render every response type at full fidelity. The Response Composer accepts a viewport parameter (panel or full) and adapts its output:

| Response type | Panel rendering (440px) | Full screen rendering |
| :---- | :---- | :---- |
| Single asset inspection | Full card with accordion for detail layers. Works well at 440px. | Same layout, more breathing room. |
| Signal/insight drill-down | Full card. Works well at 440px. | Same layout. |
| Multi-layer synthesis (3+ layers) | Compact preview: one summary card with layer badges. Prominent "View full analysis" action. | Tabbed layout with one tab per layer. Full-width cards and charts. |
| Side-by-side comparison | Stacked vertically (not side-by-side). Limited utility. Suggests expansion. | True side-by-side grid. Radar charts, bar charts at readable scale. |
| Strategy overview dashboard | Compact metric cards, sparklines. Works at 440px. | Full grid with charts, data tables, recommended action buttons. |
| Gap analysis (many gaps) | Scrollable list of compact gap cards. | Grid layout with more detail per card. |
| Flow execution | Sequential step cards. Works at 440px. | Step cards with more input space and context. |
| Coherence conflict resolution | Summary with conflict count. Suggests expansion for full evidence. | Full evidence layout: per-layer cards, side-by-side conflict detail. |

# **10\. Dedicated Intelligence Screen (Full Page)**

### **10.1 Purpose**

The Intelligence Screen is a full-page conversational surface for deep analytical sessions. It handles interactions where 440px is insufficient: multi-layer synthesis, coherence conflict resolution, side-by-side comparisons, strategy overview dashboards, and extended flow execution. It is the place for sustained reasoning about the strategy, not quick contextual queries.

### **10.2 Navigation and placement**

| Property | Specification |
| :---- | :---- |
| Route | /strategies/:id/intelligence |
| Sidebar nav | First-class item in the left navigation sidebar, alongside Graph, Context, and the model sections. Icon: a chat or brain icon consistent with the conversational metaphor. |
| Entry points | Three ways to reach this screen: (1) Click sidebar nav item (fresh session, loads strategy\_briefing). (2) Expand from side panel (carries current conversation). (3) Deep link from web app element (pre-loaded with specific context). |
| Layout | Full page width. Left: conversation history (messages \+ rendered Prefab responses). No sidebar visible or sidebar collapses to icon-only mode to maximise content width. |
| Header | Strategy name \+ "Intelligence" label. "Return to workspace" button. Current context indicator. |

### **10.3 What the full screen enables**

The full-page width unlocks rendering strategies that are impractical in the 440px panel:

* **Multi-column layouts.** Side-by-side comparison grids (option A vs option B), two-column evidence layouts for decision support.

* **Full-width charts.** Radar charts, bar charts, and area charts at readable scale. Confidence distribution across layers. Signal trend sparklines.

* **Tabbed multi-layer views.** One tab per analytical layer, each tab containing full-width cards with detail that would be cramped in the panel.

* **Data tables.** Sortable, searchable tables for asset inventories, signal lists, or coherence check results with enough columns to be useful.

* **Extended conversation history.** Full rendering of a multi-turn analytical conversation. The user can scroll back through prior questions and responses.

### **10.4 Session behaviour**

The Intelligence Screen maintains a conversation session scoped to the current strategy. Session state includes: message history (user questions \+ tool responses), rendered Prefab component trees, and any client-side state set by Prefab Rx bindings.

* **Fresh session (from sidebar nav).** Loads strategy\_briefing as the initial view. The user sees the current intelligence state and can ask questions from there.

* **Expanded session (from panel).** Carries the panel's conversation history, scroll position, and all rendered content. The user picks up exactly where they left off, with more room.

* **Session persistence.** Sessions persist within a browser session (Zustand store). They do not persist across page reloads unless explicitly saved. This is conversational context, not permanent state. All durable outcomes (decisions, links, assumptions) are written to Supabase.

# **11\. Panel / Screen Handoff Model**

### **11.1 Handoff directions**

The user moves between three locations: the workspace canvas, the side panel, and the Intelligence Screen. Each transition preserves context and feels like zooming in or out, not switching between disconnected tools.

| From | To | Trigger | What carries over | What changes |
| :---- | :---- | :---- | :---- | :---- |
| Workspace canvas | Side panel (440px) | Click "Explore in conversation" on any asset, indicator, or canvas element. Or click the panel toggle. | Current strategy\_id, selected asset\_id, route context. | Panel opens with contextual pre-load. Canvas contracts. |
| Side panel (440px) | Intelligence Screen (full page) | Click expand icon in panel header. Or system suggests expansion for complex responses. | Full conversation history, rendered content, Prefab state, scroll position. | User leaves the workspace. Full-width rendering. Panel closes. |
| Intelligence Screen | Workspace canvas | Click "Return to workspace" in header. Or click any asset reference link in conversation. | All writes already persisted to Supabase. Web app reflects changes. | User returns to workspace. Panel can be open or closed (user's last state). Canvas shows updated data. |
| Intelligence Screen | Side panel | Click "Return to workspace" (panel auto-opens retaining session). Or navigate via sidebar to a canvas screen. | Conversation history retained in Zustand store. Panel picks up where screen left off. | Full screen closes. Workspace loads. Panel opens at 440px with same session. |
| Sidebar nav | Intelligence Screen | Click Intelligence nav item directly. | Nothing (fresh session). Loads strategy\_briefing. | Full screen opens with fresh session. |

### **11.2 System-suggested expansion**

When the Response Composer generates a response classified as complex (multi-tab, comparison grid, more than 3 cards, or any response where the viewport=panel rendering is a compact preview), the panel response includes a prominent action:

| "This analysis covers 4 layers. View full analysis for the complete picture." \[Button: Open in Intelligence Screen\] |
| :---- |

Clicking this button invokes the same expand handoff: the conversation moves to the full Intelligence Screen with the complete rendering. The compact preview in the panel is replaced by a breadcrumb-style indicator: "Analysis continued in Intelligence Screen — Return to full view."

### **11.3 Conversation session architecture**

Both the panel and the Intelligence Screen render from the same conversation session in the Zustand store. This is not two separate chat histories — it is one session displayed in two viewport modes.

| Store slice | Contents | Lifecycle |
| :---- | :---- | :---- |
| conversationSession | Array of turns: { role: user|assistant, content: string|PrefabJSON, tool\_calls: \[\], timestamp } | Created when panel opens or Intelligence Screen loads. Persists until browser session ends or user explicitly clears. |
| conversationContext | { strategy\_id, asset\_id?, component\_id?, viewport: panel|full, source\_route } | Updated on each panel open, route change, or expand/collapse. Read by the MCP server tools to scope queries. |
| prefabState | Client-side Prefab Rx state bindings (slider values, tab selections, form inputs) | Managed by Prefab renderer. Shared across panel and full screen since they render from the same session. |

### **11.4 Deep links from conversation to workspace**

Conversational responses that reference specific assets should include clickable links that navigate the user to the relevant workspace view. These are not just text references — they are navigation actions.

* **Asset reference link.** Clicking a Decision Stack card title in conversation navigates to /strategies/:id/assets/:asset\_id with the panel collapsed. The user sees the asset renderer.

* **Canvas position link.** Clicking a Wardley Map component reference navigates to the Wardley Map canvas with that component selected and highlighted.

* **Conflict source link.** Clicking a coherence conflict's "View in Decision Stack" navigates to the Decision Stack viewer scrolled to the relevant decision.

Implementation: these are Prefab OpenLink actions targeting internal routes, or SendMessage actions that include a navigation instruction the web app intercepts.

# **12\. Web App Simplification Plan**

| Important: These simplifications are phased. No web app component is removed until the conversational surface has proven it can carry the equivalent function. The principle is: prove, then simplify. |
| :---- |

### **10.1 Phase-gated simplifications**

| Component | Current state | Simplified state | Gate condition | Phase |
| :---- | :---- | :---- | :---- | :---- |
| Insight Feed (right panel) | Vertical feed of insight cards with severity, source, actions | Notification strip: badge count on sidebar item, collapsed list showing titles and severity dots only. Tapping opens conversational panel. | Conversational surface handles intelligence engagement (strategy\_briefing tool proven) | Phase 2 |
| Strategy Workspace layout | Three-panel: left nav \+ centre canvas \+ right insight feed | Two-panel: left nav \+ centre canvas (full width when panel collapsed). Right panel becomes conversational panel. | Embedded panel built and contextual pre-loading working | Phase 2 |
| Flow Runner screen | Dedicated screen with step navigation, form components, progress indicators | Flow status indicators only (which flows ran, which assets produced). Actual flow execution moves to conversation. | Conversational flow runner proven for at least one flow type | Phase 3 (future) |
| Asset Viewer AI commentary | Structured fields \+ AI-generated briefing narratives, evaluator commentary, coaching prompts | Structured fields and relationships only. No prose overlays. "Explore in conversation" link for analytical depth. | Conversational surface handles analytical questioning reliably | Phase 4 (future) |
| Canvas text overlays | Evaluator commentary, assumption narratives, coaching prompts as panels/popovers on spatial canvases | No change until conversational surface proven. Then audit each overlay for removal candidates. | Usage data shows users getting equivalent information from conversation | Phase 4 (future, deferred) |

### **10.2 What is NOT simplified**

* Strategy List screen — unchanged

* All spatial canvases (Wardley Map, Systems Map, Asset Graph) — unchanged, including current text overlays

* All asset renderers (Decision Stack, OKR Cascade, Stakeholder Architecture) — unchanged

* Strategy creation and CRUD — unchanged

* Empty state options (upload doc, generate with AI) — unchanged, with new "Build in conversation" option added alongside

# **13\. Implementation Phases**

### **Phase 1: MCP Server Foundation (test externally) — COMPLETE**

Python FastMCP server with Prefab UI, tested via Claude Desktop. No web app changes. Validates tool design, data access, and rendering.

**Delivered:**

10. Python project setup: FastMCP server with Prefab UI, Supabase client (`supabase-py` with service role key), project structure (tools/, composer/, data/).

11. Data access layer: typed Pydantic models and repository queries against strategies, strategy\_assets, insights, signals, asset\_briefings, entities, asset\_entity\_references, initiatives, coherence\_reports, coherence\_conflicts tables.

12. strategy\_briefing tool: renders intelligence dashboard with signal cards (accordion-expandable), briefing headlines, asset overview, initiative summary. Tabs: Signals / Assets / Insights / Initiatives.

13. inspect\_asset tool: renders single asset with briefing, tiered insights (urgent/cross\_layer/noted), scoped signals, related assets via entity overlap, what\_to\_watch.

14. ask\_strategy tool: 5-category question classification via Haiku (status, inspection, gap, comparison, analytical). Gap and comparison categories are data-read only (no Sonnet). Analytical path uses Sonnet via tool\_use for guaranteed structured JSON output.

15. Helper tools: get\_asset\_detail (compact PrefabApp card for drill-down), get\_signal\_detail (full signal detail with source/target assets).

16. ToolResult text summaries: all 5 tools return both text (for Claude to reason with and chain tool calls) and structured\_content (Prefab UI for visual rendering). Gap and comparison composers include coverage footers.

17. External testing: validated in Claude Desktop. HTTP transport mode available (`--http` flag, port 8765).

**Exit criteria met:** User asks "what is the state of my strategy?" via Claude Desktop → interactive Prefab dashboard with real Supabase data. Can drill into assets and signals. Claude can chain tool calls using text summaries. Gap analysis ("what am I missing?") and comparison ("how do these relate?") work without Sonnet calls.

### **Phase 2: Conversation-Powered Panel \+ Web App Integration — COMPLETE**

Build the conversation endpoint on the Python server. Implement model routing (Haiku/Sonnet per turn). Replace the ContextDrawer with a Claude-powered conversation panel. Wire contextual pre-loading. Implement the Intelligence Screen and panel/screen handoff. The MCP server continues serving Claude Desktop in parallel.

**Deliverables:**

17. Conversation endpoint (`POST /conversation`): server-managed session state, Claude API calls with tool\_use (tools = Phase 1 tool implementations), model routing (Haiku for simple turns, Sonnet for analytical), prompt caching, conversation history management with sliding window + summary. See Section 7.3.

18. Zustand conversation slice: session state (messages, context, loading), shared between panel and Intelligence Screen. Types for conversation messages (user text, assistant prose + cards, card actions).

19. Conversation panel component (440px): replaces ContextDrawer. Header with context indicator + expand + close. Scrollable conversation area rendering prose + native React cards. Text input footer. Calls conversation endpoint on message submit. Interactive card actions send structured actions back as the next conversation turn.

20. Native React intelligence card components: BriefingCard, SignalCard, InsightCard, AnalyticalResponseCard, GapCard, ComparisonCard, CoverageFooter, ActionCard (buttons, text inputs, sliders for write-back). Styled with `styles/tokens.ts`. Charts via recharts.

21. Contextual pre-loading: panel opens → creates conversation session with strategy context → Claude's first response is a coaching synthesis scoped to what the user is viewing (strategy overview, specific asset, or specific component). Reads `viewingAssetId`, `activeStrategyId` from Zustand store.

22. "Explore in conversation" affordance: added to asset cards, insight indicators, and canvas components. Clicking sets `viewingAssetId` in store and opens panel. Panel auto-starts conversation scoped to that asset.

23. Dedicated Intelligence Screen: full-page workspace view (`activeWorkspaceView: "intelligence"`). Sidebar nav item. Same conversation session from Zustand store, full-width card rendering. Entry points: sidebar nav (fresh session), expand from panel (carries session), deep link from web app element.

24. Panel/Screen handoff: expand icon in panel header navigates to Intelligence Screen preserving full conversation. "Return to workspace" navigates back, panel auto-opens retaining session. One session displayed in two viewport modes.

25. Write-back with provenance: all database writes from card actions include `source: mcp_session`, `session_id`, and timestamp. Claude sees write results and continues coaching. Conversational writes land with appropriate status and provenance metadata.

26. Cost guardrails: turn limit warning at 15 turns, context size monitoring, model usage logging. See cost optimisation guide Section 6.3.

**Exit criteria (validated against all 5 interaction scenarios):**

1. **Scenario 1 (Status inquiry):** User asks "what's the state of my strategy?" → receives coaching synthesis with suggested next action, not just a dashboard. Can follow up conversationally.

2. **Scenario 2 (Stress-testing):** User completes a multi-turn stress test of assumptions → contingencies captured with provenance, confidence updated, cross-asset tensions flagged. All in Supabase without opening an editor.

3. **Scenario 3 (Unstructured input):** User pastes meeting notes → system extracts structured items as interactive cards → user selectively writes them to assets → Claude surfaces downstream implications.

4. **Scenario 4 (Conflict resolution):** User resolves a coherence conflict through a 4-turn guided conversation → new objective created, finding resolved, dependency linked, decision journal entry recorded.

5. **Scenario 5 (Briefing preparation):** User prepares a VP briefing → refines for audience → exports as text or slide deck.

See `docs/plans/interaction-scenarios.md` for full scenario specifications.

### **Phase 2.5: MCP External Host Enrichment — COMPLETE**

Enrich the MCP tools so the external host experience (Claude.ai, Claude Desktop) supports the full coaching conversation model. Phase 2 built the embedded panel; Phase 2.5 ensures the MCP tools return enough structured data for any AI host to synthesise coaching responses, chain tool calls, and execute write-back flows without visual context from the web app.

**Full specification:** `docs/plans/strategyos-mcp-improvement-spec.md`

**Sub-phase A: Enable coaching conversations (prerequisite)**

27. Add `asset.data` payload to `inspect_asset` — return actual components, positions, assumptions, objectives alongside intelligence. Per-type serialisation (Wardley components, Decision Stack assumptions, OKR key results, etc.).

28. Add coverage footer to all tool responses — explicit list of consulted/not-consulted/missing asset types per response. Wrapper function in data access layer.

29. Add `confirm` parameter (default `false`) to all write tools — dry-run preview showing what will be written with provenance, requires `confirm=true` to commit. Enables propose-then-confirm pattern for Scenarios 2, 3, 4.

30. Verify all tools return structured text with IDs in `content` field — widgets in `structured_content` are optional enrichment, not the primary contract.

**Sub-phase B: Enrich analytical depth**

31. Implement `search_assets` tool — keyword/type/status/confidence filtering across assets. Required for Scenario 3 (matching unstructured input to existing assets).

32. Implement `get_asset_data` — lightweight data-only tool returning `asset.data` JSON without intelligence. Performance optimisation for multi-asset coaching sessions.

33. Restructure `ask_strategy` for external hosts — return assembled data (not LLM-generated prose) so the AI host composes its own coaching synthesis. Keep internal LLM path for embedded panel where response goes directly to user.

**Sub-phase C: Complete the interaction model**

34. `create_asset_link` tool — cross-reference discovery, insert into entity layer.

35. `run_coherence_check` tool — trigger intelligence pipeline from conversation, return results.

36. `strategy_timeline` tool — chronological review across tables.

37. Export tools — briefing as text, as slide deck (pptxgenjs integration from Python service).

**Exit criteria:** All five interaction scenarios work end-to-end through Claude.ai with no web app context. See `docs/plans/strategyos-mcp-improvement-spec.md` Section 6 for per-scenario validation.

### **Phase 3: Extended Coaching Patterns \+ Flow Execution**

Phase 3 extends the conversational surface beyond the core five scenarios. The authoritative design spec is `docs/superpowers/specs/2026-04-19-conversational-surface-phase3-design.md`, which replaces the original deliverable descriptions below. The design introduces three stances (Query, Challenge, Assist) and a proactive delivery model.

**Sub-phases and status:**

| Sub-phase | Scope | Status |
|---|---|---|
| **3A — Challenge Brief** | Adversarial stance. 2–3 data-grounded weaknesses. `challenge_brief` card type. Per-point "Address this" actions. | **Complete** — PR #225 |
| **3B — Assist Field-Level** | Expressive + suggestive flavours. `AssistAffordance` pill on judgement-heavy fields. `assist_proposal`/`assist_item` card types. Violet AI color system. | **Complete** — PR #226 |
| **3C — Proactive Delivery** | Four urgency tiers (badge, inline nudge, toast, interruptive card). Pure evaluator — no AI calls. Amber visual language. | **Complete** |
| **3D — Scenario Branching** | In-memory what-if analysis. Before/after comparison cards. Save as named variant. | Not started |
| **3E — Synthesis Versioning + Digest Tab** | `run_number` column, `getReportHistory()`, Digest tab in Strategy Pulse (progress over time, not current state). | Not started — design in Phase 3 spec §7 |
| **3F — Cross-Strategy + Stakeholder Views** | Post-synthesis cross-strategy detection. Persona-filtered briefing cards. | Not started |

**Original deliverable mapping (for reference):**

38. ~~Extended coaching exercises~~ → Implemented as Challenge Brief (3A). Weekly digest deferred to 3E.

39. Pending review workflow — deferred. Light-touch provenance (write-back source tagging) is sufficient for now.

40. ~~Conversational flow runner~~ → Replaced by Assist field-level hybrid model (3B).

41. ~~Scenario branching~~ → Deferred to 3D.

42. ~~Cross-strategy pattern detection~~ → Deferred to 3F.

43. ~~Stakeholder-specific views~~ → Deferred to 3F.

44. ~~Trend analysis over time~~ → Subsumed by 3E (Digest tab with synthesis versioning).

### **Phase 4: Canvas Simplification & Full Maturity (future, deferred)**

Audit canvas text overlays for removal candidates. Simplify Asset Viewer to structure-only view. Move remaining analytical commentary to conversation. This phase only proceeds after usage data confirms the conversational surface carries the analytical weight.

| Phase 4 is explicitly deferred. Do not implement canvas simplification or asset viewer prose removal until Phase 3 is complete and usage patterns confirm the conversational surface is the primary channel for analytical depth. |
| :---- |

# **14\. Sequencing Decision: Build Before or After New Assets?**

The current build plan (from the Build Guide) sequences additional strategy assets after the existing core: Stakeholder Architecture (Phase 6), Systems Map/CLD (Phase 7), Insight Layer (Phase 8), Graph Explorer (Phase 9). The question is whether the conversational surface should be built before, after, or in parallel with these new asset types.

### **12.1 The case for building the conversational surface first**

33. **It changes how every subsequent asset is experienced.** Every new asset type (Stakeholder Map, Systems Map) will need an insight feed, intelligence rendering, and analytical depth. If the conversational surface exists first, new assets get that capability for free via the Response Composer. If built after, each asset's intelligence view must be designed and built separately in the web app, then potentially removed when the conversational surface arrives.

34. **It reduces the scope of each new asset's web UI.** With the conversational surface handling analytical depth, the web UI for each new asset only needs to show structure: the spatial canvas or structured view. No insight panels, no evaluator commentary overlays, no coaching prompts. This is significantly less frontend work per asset.

35. **It proves the enrichment loop early.** The conversational surface's gap-filling and confidence calibration capabilities make existing assets more useful immediately. This demonstrates product value without building new asset types.

36. **The Insight Layer (Phase 8\) becomes redundant as a dedicated screen.** If the conversational surface handles intelligence engagement, the dedicated Insight Feed screen does not need to be built. The intelligence surfaces through conversation instead.

### **12.2 The case for building new assets first**

37. **More analytical layers \= richer conversations.** The conversational surface is most powerful when there are multiple layers to cross-reference. With only Decision Stack and Wardley Map, the cross-layer insights are limited. Adding Stakeholder Architecture and Systems Map gives the Response Composer significantly more material to work with.

38. **The MCP/Prefab ecosystem is still maturing.** Prefab is under active development. MCP Apps support varies by host. Building on a moving foundation carries integration risk. Waiting 2-3 months gives the ecosystem time to stabilise.

### **12.3 Recommendation**

| Build Phase 1 (MCP Server Foundation) immediately, in parallel with the next asset build phase. This is low-risk: it is a standalone Python service that does not touch the web app. It validates the interaction model and Prefab rendering against real data. If it works well, proceed to Phase 2 (embedded panel) before building the web UI for new asset types. If it encounters blockers (Prefab limitations, MCP host issues), the web app build continues unaffected. |
| :---- |

The sequencing becomes:

| Order | Work stream | Rationale |
| :---- | :---- | :---- |
| Now | Phase 1: MCP Server Foundation (parallel with current build) | Low risk, standalone, validates the model. Does not block or depend on web app work. |
| Next | Phase 2: Embedded Panel (after Phase 1 validated) | First web app integration. Replaces insight feed panel. Proves the two-surface model. |
| Then | New asset types (Stakeholder, Systems Map) with simplified web UIs | Each new asset builds only the spatial/structural view. Analytical depth handled by the now-proven conversational surface. |
| Later | Phase 3: Full enrichment \+ Phase 4: canvas simplification | Matures the conversational surface. Only simplifies the web app after usage confirms the conversational surface carries the weight. |

# **15\. Design Constraints & Principles**

### **13.1 Inviolable constraints**

39. **Single source of truth.** Both surfaces read from and write to the same Supabase tables. There is no separate data store for conversational interactions. The asset graph is canonical.

40. **The web app shows what things ARE. The conversation explains what things MEAN.** This boundary must not blur. The web app does not attempt coaching in prose. The conversation does not attempt spatial layout.

41. **Canvas simplification is deferred.** Do not remove text overlays, commentary panels, or evaluator output from spatial canvases until the conversational surface has proven it carries that function. This includes Wardley Map, Systems Map, and Asset Graph.

42. **Asset renderers stay.** Decision Stack, OKR Cascade, Stakeholder Architecture, and all structured asset viewers remain in the web app unchanged. They show the user's own work. The conversational surface complements them, it does not replace them.

43. **Empty states retain existing options.** Upload and AI-generate options remain. "Build in conversation" is additive, not replacing.

44. **Write provenance.** Every write from the conversational surface includes source metadata. Conversational writes land with pending review status unless the user explicitly confirms in the same interaction.

45. **Transparency about coverage.** Every conversational response states which analytical layers were consulted and which were not. The user must never assume completeness.

### **13.2 Visual design constraints**

The Prefab renderer in the embedded panel should feel like it belongs to the same product. Prefab ships with a shadcn/ui-based theme. The following customisations are required:

* Typography: Match Inter font family from the StrategyOS UI style guide.

* Colours: Override Prefab theme accent colour to match StrategyOS accent blue (\#2563EB).

* Semantic colours: Map Prefab badge variants to StrategyOS tokens (success: green-600/green-100, warning: amber-600/amber-100, destructive: red-600/red-100).

* Density: Prefab defaults are appropriate. Do not over-customise.

* Cards: White background, subtle borders. Consistent with StrategyOS restraint principle.

### **13.3 Prose quality constraints**

All AI-generated text in conversational responses must follow the StrategyOS prose style guide:

* Subject is the thing being discussed, not the system producing the analysis. Never "the asset flags" or "the system identifies."

* Headlines are active statements (subject \+ verb \+ consequence), maximum 12 words.

* Confidence language is consistent: either numeric throughout or a three-tier verbal scale. Never mixed.

* No transitional lines that narrate the system. Endings land with weight.

# **16\. Risk Register**

| Risk | Likelihood | Impact | Mitigation |
| :---- | :---- | :---- | :---- |
| Prefab UI is under active development; breaking changes possible | High | Medium | Pin prefab-ui version. Phase 1 is standalone and validates before web app integration. If Prefab proves unstable, fall back to raw JSON protocol with custom renderer. |
| MCP Apps support varies by host; embedded panel may need custom wiring | Medium | Medium | Phase 1 tests external hosts. Phase 2 embeds directly (does not depend on host support). External access is a bonus, not a requirement. |
| Intelligence pipeline invocation from Python MCP server introduces latency | Medium | Low | Intelligence pipeline already runs async. MCP server can invoke via Next.js API endpoints (HTTP bridge) or share direct DB access. Either approach avoids duplicate pipeline logic. |
| Two surfaces create maintenance overhead for intelligence rendering | Medium | Medium | The Prefab rendering is composable: a set of Python functions that take structured data and return component trees. Changes to intelligence data structures propagate to both surfaces through the shared data layer. Rendering logic is in one place (the Composer). |
| Users default to one surface and ignore the other | Medium | Low | The embedded panel with contextual pre-loading is designed to make the conversational surface feel like part of the web app, not a separate tool. Usage analytics should track panel open rate and interaction depth. |
| Conversational writes create data quality issues | Low | High | All conversational writes land with pending review status and source provenance. The web app shows review indicators. The user promotes to committed status deliberately. |

# **17\. Appendix: Prefab Component Mapping**

Mapping StrategyOS intelligence outputs to Prefab components for the Response Composer.

| StrategyOS content type | Prefab components | Interaction |
| :---- | :---- | :---- |
| Briefing headline | Card \> CardHeader \> CardTitle \+ Badge (severity variant) | Click: CallTool to get\_asset\_detail, result populates Slot |
| Signal card | Card \> CardContent \> Text (headline) \+ Muted (body) \+ Badge (severity) | Click: CallTool to get\_signal\_detail. Expandable via Accordion. |
| Insight card | Alert (variant by severity) \> AlertTitle \+ AlertDescription | Optional: CallTool action buttons for "Explore" or "Dismiss" |
| Coherence check result | Card with Badge (success/warning/destructive) \+ DataTable of layer agreements | Click conflict row: CallTool renders side-by-side comparison in Slot |
| Confidence calibration | Column of Slider components, each bound to a CallTool that writes confidence | Slider onChange: SetState \+ CallTool to update\_confidence |
| Gap analysis | Grid of Cards, each showing gap type, affected layer, and Button ("Fill this gap") | Button onClick: CallTool opens input form in Slot |
| Asset summary (multi-layer) | Tabs component with one tab per layer. Each tab contains layer-specific cards. | Tab switch: client-side (no tool call). Drill into detail: CallTool. |
| Decision support (pro/con) | Grid (2 col): left \= evidence cards for option A, right \= evidence cards for option B | RadioGroup to toggle perspective. SendMessage for "What is your call?" |
| Strategy overview | Grid of Metric cards (asset count, coherence score, confidence avg) \+ BarChart for coverage | CallTool buttons for each recommended action |
| Cross-reference discovery | Card per layer with connection indicators. Button: "Link these" | Button onClick: CallTool to create\_asset\_link. Toast confirmation. |

# **18\. Companion Documents**

This specification should be read alongside:

| Document | Path | Purpose |
| :---- | :---- | :---- |
| Interaction Scenarios | `docs/plans/interaction-scenarios.md` | Five concrete acceptance scenarios for the conversational surface. All five must work for Phase 2 to be complete. |
| Cost Optimisation Guide | `docs/plans/cost-optimisation-guide.md` | Model selection rules (Haiku/Sonnet/Opus), context window management, prompt caching, per-interaction cost targets, and cost guardrails. |
| Spec Thinking | `docs/plans/mcp-spec-thinking.md` | Extended interaction patterns and use cases: stress-testing, pre-mortem, decision journaling, unstructured input parsing, stakeholder interviews, scenario branching, cross-strategy detection, methodology coaching. |
| UI Style Guide | `docs/ui-style-guide.md` | Design tokens and visual constraints for the embedded panel's native React rendering. |
| Prose Style | `src/ai/prose-style.ts` | Prose quality rules for all AI-generated text in conversational responses. |
| Architecture Decisions | `docs/architecture-decisions.md` | ADRs governing the intelligence pipeline, capability architecture, and data flow. |

*End of specification.*
