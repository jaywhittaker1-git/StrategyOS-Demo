# Anthropic API Usage & Cost Optimization Analysis

## 1. Where Claude/Anthropic API Calls are Made

The codebase has a well-structured and centralized approach to interacting with Anthropic's Claude:

*   **Core Client & Utilities:**
    *   **[src/ai/client.ts](file:///Users/jay/Documents/StrategyOS/src/ai/client.ts)**: The main entry point. Exports the [getClient()](file:///Users/jay/Documents/StrategyOS/src/ai/client.ts#28-36) instance and a [complete()](file:///Users/jay/Documents/StrategyOS/src/ai/client.ts#37-66) wrapper. It defines two main models: `DEFAULT_MODEL = 'claude-sonnet-4-6'` and `INFERENCE_MODEL = 'claude-haiku-4-5-20251001'`.
    *   **[src/ai/structured-output.ts](file:///Users/jay/Documents/StrategyOS/src/ai/structured-output.ts)**: Contains [completeStructured()](file:///Users/jay/Documents/StrategyOS/src/ai/structured-output.ts#15-59), which wraps [complete()](file:///Users/jay/Documents/StrategyOS/src/ai/client.ts#37-66) to enforce JSON output against a Zod schema.
*   **Vision Capabilities (Image Parsers):**
    *   **[src/ai/capabilities/ingestion/wardley-image-parser.ts](file:///Users/jay/Documents/StrategyOS/src/ai/capabilities/ingestion/wardley-image-parser.ts)** & **[systems-image-parser.ts](file:///Users/jay/Documents/StrategyOS/src/ai/capabilities/ingestion/systems-image-parser.ts)**: Send base64-encoded images to the Claude Vision API. Both currently use the `DEFAULT_MODEL` (Sonnet).
*   **Workflows and Downstream Capabilities:**
    *   The `src/ai/capabilities/strategy/*` and `src/ai/capabilities/assets/*` directories contain numerous specific inference tasks (e.g., [bets-to-okr-inference.ts](file:///Users/jay/Documents/StrategyOS/src/ai/capabilities/strategy/bets-to-okr-inference.ts), [misaligned-objective-detector.ts](file:///Users/jay/Documents/StrategyOS/src/ai/capabilities/strategy/misaligned-objective-detector.ts)).
    *   Notably, almost all of these inference tasks and batch operations properly import and use `INFERENCE_MODEL` (Haiku), which is an excellent architectural choice for keeping costs down.
*   **Orchestrator:**
    *   **[src/ai/orchestrator.ts](file:///Users/jay/Documents/StrategyOS/src/ai/orchestrator.ts)**: The central dispatcher for AI capabilities, managing retries, queues, and event dispatching. This runs capabilities asynchronously.

---

## 2. Opportunities to Optimize API Cost

While the application already does a good job of routing routine text inferences to Haiku (`INFERENCE_MODEL`), there are several significant opportunities to further reduce costs:

### A. Implement Anthropic Prompt Caching
Prompt Caching allows you to cache large systemic instructions and background knowledge dynamically, reducing input token costs by **up to 90%** for repetitive prompts.
*   **Where to apply:** In files like [wardley-image-parser.ts](file:///Users/jay/Documents/StrategyOS/src/ai/capabilities/ingestion/wardley-image-parser.ts) and [systems-image-parser.ts](file:///Users/jay/Documents/StrategyOS/src/ai/capabilities/ingestion/systems-image-parser.ts), there are large, static `SYSTEM_PROMPT` strings.
*   **How:** Modify [complete()](file:///Users/jay/Documents/StrategyOS/src/ai/client.ts#37-66) and the vision payload builders to include a `cache_control: { type: "ephemeral" }` block on the system prompts or large context arrays. If you frequently analyze Strategy Contexts across many requests, caching the context block will save substantial tokens.

### B. Downgrade Vision Models to Haiku (Right-sizing)
Claude 3.5 Haiku has excellent vision capabilities and is approximately **10x cheaper** than Sonnet.
*   **Where to apply:** [wardley-image-parser.ts](file:///Users/jay/Documents/StrategyOS/src/ai/capabilities/ingestion/wardley-image-parser.ts) and [systems-image-parser.ts](file:///Users/jay/Documents/StrategyOS/src/ai/capabilities/ingestion/systems-image-parser.ts) both hardcode the `DEFAULT_MODEL` (Sonnet).
*   **Recommendation:** Try switching these vision tasks to `INFERENCE_MODEL` (Haiku). If the data extraction accuracy remains acceptable, this will yield an immediate and massive cost reduction for image uploads.

### C. Image Payload Optimization (Downsampling)
Vision tokens scale linearly with the physical dimensions of the image being provided.
*   **Where to apply:** [wardley-image-parser.ts](file:///Users/jay/Documents/StrategyOS/src/ai/capabilities/ingestion/wardley-image-parser.ts) and [systems-image-parser.ts](file:///Users/jay/Documents/StrategyOS/src/ai/capabilities/ingestion/systems-image-parser.ts) accept the raw `imageBase64` from the client upload.
*   **Recommendation:** Implement image downsampling/resampling (e.g., via Canvas on the frontend or a sharp/Jimp utility on the backend) before feeding the Base64 to Claude. Shrinking a 4K image down to a 1080p or 720p equivalent is often perfectly sufficient for text/structure extraction and will dramatically slash input token usage.

### D. Tighten Output Token Limits (`max_tokens`)
While you only pay for generated context, overly permissive token limits can allow runaway generation (hallucinations) that spike costs.
*   **Where to apply:** [wardley-image-parser.ts](file:///Users/jay/Documents/StrategyOS/src/ai/capabilities/ingestion/wardley-image-parser.ts) requests a massive `max_tokens: 8192`. [complete()](file:///Users/jay/Documents/StrategyOS/src/ai/client.ts#37-66) defaults to `4096`.
*   **Recommendation:** If a Wardley map extraction typically realistically returns only 500-1000 tokens of JSON, restrict `max_tokens` to `1500` or `2048`. This limits worst-case cost exposure. 

### E. Leverage the Message Batch API
The Anthropic Message Batch API is **50% cheaper** than standard requests but returns asynchronously (within 24 hours, often much faster).
*   **Where to apply:** In [src/ai/orchestrator.ts](file:///Users/jay/Documents/StrategyOS/src/ai/orchestrator.ts), capabilities like `insight-extraction`, `structural-tension-detector`, and batch dataset generations trigger offline indexing/analysis.
*   **Recommendation:** For background or non-time-critical intelligence tasks (like deep strategy index sweeps or periodic batch analysis on large sets of assets), transition from real-time API routes to the Batch API.
