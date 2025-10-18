import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '后端服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// 导入路由
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import demandRoutes from './routes/demands';
import serviceRoutes from './routes/services';
import matchRoutes from './routes/matches';
import specializationRoutes from './routes/specializations';
import trustScoreRoutes from './routes/trust-scores';

// 注册路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/demands', demandRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/trust-scores', trustScoreRoutes);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 后端服务运行在端口 ${PORT}`);
  console.log(`📊 健康检查: http://localhost:${PORT}/api/health`);
});

// 优雅关闭
process.on('SIGTERM', async () => {
  console.log('正在关闭服务器...');
  await prisma.$disconnect();
  process.exit(0);
});