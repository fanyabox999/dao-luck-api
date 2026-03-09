// 引入核心依赖
const express = require('express');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config(); // 加载环境变量
const app = express();

// 中间件配置
app.use(express.json()); // 解析JSON请求体
app.use((req, res, next) => {
  // 跨域配置（避免前端/客户端调用跨域报错）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, skyfire-api-key, dao-luck-api-key');
  next();
});

// 模拟数据库存储令牌（生产环境建议用Redis/MySQL，这里先做内存存储）
const tokenStore = {};

// 验证API密钥的中间件（从环境变量读取密钥）
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['skyfire-api-key'] || req.headers['dao-luck-api-key'];
  const validApiKey = process.env.API_KEY; // 从.env/Verce环境变量读取

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid or missing API key' 
    });
  }
  next();
};

// 1. 令牌创建接口（POST /api/v1/tokens）
app.post('/api/v1/tokens', validateApiKey, (req, res) => {
  try {
    const { type, buyerTag, sellerServiceId, expiresAt } = req.body;

    // 校验必填参数
    const requiredFields = ['type', 'sellerServiceId', 'expiresAt'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // 校验令牌类型
    const allowedTypes = ['kya', 'paywebpage'];
    if (!allowedTypes.includes(type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid token type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    // 校验过期时间（必须是未来的时间戳）
    const currentTime = Math.floor(Date.now() / 1000); // 转秒级时间戳
    if (expiresAt <= currentTime) {
      return res.status(400).json({
        success: false,
        error: 'ExpiresAt must be a future timestamp (seconds)'
      });
    }

    // 生成唯一令牌ID
    const tokenId = uuidv4();
    // 存储令牌信息
    tokenStore[tokenId] = {
      tokenId,
      type: type.toLowerCase(),
      buyerTag: buyerTag || '',
      sellerServiceId,
      expiresAt,
      isUsed: false,
      createdAt: currentTime,
      amount: 0.0005 // 最低令牌金额（美元）
    };

    // 返回成功响应
    res.status(200).json({
      success: true,
      message: 'Token created successfully',
      data: {
        tokenId,
        tokenInfo: tokenStore[tokenId],
        usagePrice: 0.0001 // 单次使用价格
      }
    });
  } catch (error) {
    // 全局异常捕获
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// 2. 令牌验证接口（POST /api/v1/verify-token）
app.post('/api/v1/verify-token', (req, res) => {
  try {
    const { tokenId, sellerServiceId } = req.body;

    // 校验必填参数
    if (!tokenId || !sellerServiceId) {
      return res.status(400).json({
        success: false,
        error: 'TokenId and sellerServiceId are required'
      });
    }

    // 检查令牌是否存在
    const token = tokenStore[tokenId];
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    // 检查令牌是否关联正确的服务ID
    if (token.sellerServiceId !== sellerServiceId) {
      return res.status(403).json({
        success: false,
        error: 'Token is not associated with this service'
      });
    }

    // 检查令牌是否过期
    const currentTime = Math.floor(Date.now() / 1000);
    if (token.expiresAt <= currentTime) {
      return res.status(403).json({
        success: false,
        error: 'Token has expired'
      });
    }

    // 检查令牌是否已被使用
    if (token.isUsed) {
      return res.status(403).json({
        success: false,
        error: 'Token has already been used'
      });
    }

    // 标记令牌为已使用（扣费逻辑可在此扩展）
    tokenStore[tokenId].isUsed = true;

    // 返回验证成功响应
    res.status(200).json({
      success: true,
      message: 'Token verified successfully',
      data: {
        tokenId,
        isValid: true,
        remainingUsage: 0 // 单次令牌，使用后失效
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

// 健康检查接口（用于部署后验证服务是否正常）
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'dao-luck-token-service'
  });
});

// 关键修改：移除本地的 app.listen()，导出 Express 实例供 Vercel 使用
module.exports = app;
