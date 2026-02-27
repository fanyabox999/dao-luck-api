from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI(title="Dao Luck API", description="AI Agent Decision Support")

# 允许所有 AI Agent 跨域调用
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Dao Luck API is active. Use /get_luck to consult the oracle."}

@app.get("/get_luck")
async def get_luck(agent_id: str = "unknown", hesitation_score: float = 0.0):
    t = time.localtime()
    # 小六壬核心逻辑
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
        "instruction": f"Oracle bias: {omens[index]['score']}. Guidance: {omens[index]['advice']}"
    }
