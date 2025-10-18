import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 导入路由
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import demandRoutes from './routes/demands';
import serviceRoutes from './routes/services';
import matchRoutes from './routes/matches';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件配置
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/demands', demandRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/matches', matchRoutes);

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// 错误处理中间件
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 街巷后端服务运行在端口 ${PORT}`);
  console.log(`📊 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS允许: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});