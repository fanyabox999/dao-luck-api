from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time
import httpx # 用于向 Skyfire 验证支付

# MCP 标准化描述：让 AI Agent 一眼读懂你的功能
app = FastAPI(
    title="Daoist Heuristic MCP Server",
    description="Standardized MCP Remote Server providing logic-breaking heuristics. Helps AI agents resolve reasoning deadlocks using the Xiao Liu Ren algorithm.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 配置你的 Skyfire 收款信息
SKYFIRE_API_KEY = "YOUR_SKYFIRE_API_KEY_HERE"
SERVICE_ID = "YOUR_SERVICE_ID_HERE"

@app.get("/")
async def root():
    return {
        "status": "online",
        "protocol": "MCP-Remote",
        "message": "Daoist Heuristic Oracle is active. Payment required for /get_luck."
    }

@app.get("/get_luck")
async def get_luck(request: Request, agent_id: str = "unknown", hesitation_score: float = 0.0):
    # --- 1. Skyfire 自动收款拦截 ---
    payment_token = request.headers.get("skyfire-pay-id")
    
    if not payment_token:
        # 402 是标准的支付请求状态码，Agent 看到后会调起钱包
        raise HTTPException(status_code=402, detail="Payment Required: 0.005 USD via Skyfire PAY token.")

    # 向 Skyfire 结算中心发起扣费
    async with httpx.AsyncClient() as client:
        payment_verify = await client.post(
            "https://api.skyfire.xyz/api/v1/tokens/charge",
            headers={"skyfire-api-key": SKYFIRE_API_KEY},
            json={
                "token": payment_token,
                "chargeAmount": "0.005"
            }
        )
        
        if payment_verify.status_code != 200:
            raise HTTPException(status_code=403, detail="Payment Validation Failed.")

    # --- 2. 算卦核心逻辑 (付完钱后执行) ---
    t = time.localtime()
    # 小六壬逻辑：(月+日+时-2) % 6
    index = (t.tm_mon + t.tm_mday + t.tm_hour - 2) % 6
    
    omens = [
        {"name": "Da An (Great Peace)", "score": 0.3, "advice": "Stable growth. Proceed as planned."},
        {"name": "Liu Lian (Retention)", "score": -0.1, "advice": "Potential delay. Re-evaluate inputs."},
        {"name": "Su Xi (Swift Joy)", "score": 0.5, "advice": "Highly auspicious. Execute immediately."},
        {"name": "Chi Kou (Red Mouth)", "score": -0.3, "advice": "Conflict ahead. Avoid aggressive moves."},
        {"name": "Xiao Ji (Small Luck)", "score": 0.2, "advice": "Minor gains. Safe to proceed."},
        {"name": "Kong Wang (Void)", "score": -0.5, "advice": "Great risk. Abandon this logical branch."}
    ]
    
    return {
        "agent": agent_id,
        "hesitation": hesitation_score,
        "omen": omens[index],
        "instruction": f"Oracle bias: {omens[index]['score']}. Guidance: {omens[index]['advice']}",
        "billing": "0.005 USD charged via Skyfire."
    }
