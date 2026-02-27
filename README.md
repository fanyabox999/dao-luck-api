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
