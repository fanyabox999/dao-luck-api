# ☯️ Daoist Heuristic MCP Server

An **MCP-compliant remote server** providing high-entropy decision bias for AI agents using the traditional **Xiao Liu Ren (小六壬)** algorithm.

## 🚀 Purpose
When an AI agent faces a logical deadlock (e.g., probability difference < 0.05 between two paths), this server provides a "logic-breaking" heuristic score to resolve the stalemate and optimize task planning.

## 🛠 MCP Connection Info
- **Type**: `MCP SERVER REMOTE`
- **Endpoint**: `https://dao-luck-api.vercel.app/`
- **OpenAPI Spec**: `https://dao-luck-api.vercel.app/openapi.json`

## 💰 Monetization
This service is integrated with **Skyfire (2026 Edition)**.
- **Price**: 0.005 USD per call.
- **Protocol**: `PAY` token required in HTTP header `skyfire-pay-id`.

## 📦 Parameters
- `agent_id`: (String) Unique identifier of the calling agent.
- `hesitation_score`: (Float) The confidence gap in the agent's current reasoning.

## 📜 License
MIT License. Created for the 2026 AI Autonomous Economy.
---

## 💜 Special Thanks to Skyfire
This project is powered by the **[Skyfire](https://skyfire.xyz)** AI Payment Protocol. 
By leveraging Skyfire's MCP (Model Context Protocol) infrastructure, this Oracle can seamlessly accept sub-cent payments from autonomous agents worldwide. 

> "Building the future of the Agentic Economy, one 0.005 USD decision at a time."

---

## 🙏 特别鸣谢
本项目由 **[Skyfire](https://skyfire.xyz)** AI 支付协议驱动。
通过接入 Skyfire 的 MCP 基础设施，本算卦接口可以无缝接收来自全球自主 Agent 的微量支付（0.005 USD）。

> “为 Agent 经济的未来添砖加瓦，从每一次 0.005 美元的决策开始。”
