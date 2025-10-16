# 街巷项目部署指南

## Zeabur 部署步骤

### 1. 准备工作
- 确保项目已提交到 Git 仓库
- 在 Zeabur 平台注册账号
- 准备数据库服务（Zeabur 提供或外部数据库）

### 2. 部署流程

#### 方式一：自动部署（推荐）
1. 登录 Zeabur 控制台
2. 点击 "New Project"
3. 选择 "Import from Git"
4. 连接你的 Git 仓库
5. Zeabur 会自动检测项目类型并部署

#### 方式二：手动配置
1. 在 Zeabur 创建新项目
2. 添加 "Web Service" 服务
3. 配置构建设置：
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Port**: `3000`

### 3. 环境变量配置

在 Zeabur 的 "Environment Variables" 页面设置：

```env
# 必须配置
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-app.zeabur.app
NODE_ENV=production

# 数据库配置（Zeabur 会自动提供）
DATABASE_URL=your-database-url-from-zeabur
```

### 4. 数据库配置

#### 使用 Zeabur 数据库服务
1. 在 Zeabur 项目中添加 "Database" 服务
2. Zeabur 会自动提供 `DATABASE_URL` 环境变量
3. 项目会自动运行数据库迁移

#### 使用外部数据库
- 在环境变量中配置外部数据库连接字符串
- 确保数据库支持 SQLite 或配置为其他数据库类型

### 5. 域名配置

1. 在 Zeabur 项目设置中配置自定义域名
2. 更新 `NEXTAUTH_URL` 环境变量为你的域名
3. 等待 DNS 生效

## 部署验证

部署完成后，访问你的应用 URL 验证：

1. **首页**：检查是否能正常访问
2. **互助广场**：验证模拟数据是否正确显示
3. **个人中心**：确认用户信息管理功能
4. **对话功能**：测试消息系统

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 `package.json` 依赖是否正确
   - 验证 Node.js 版本兼容性

2. **数据库连接失败**
   - 确认 `DATABASE_URL` 环境变量正确
   - 检查数据库服务状态

3. **页面 404 错误**
   - 验证 Next.js 路由配置
   - 检查构建输出是否正确

4. **环境变量未生效**
   - 确认环境变量名称正确
   - 重启服务应用新配置

### 日志查看

在 Zeabur 控制台的 "Logs" 页面查看：
- 构建日志
- 运行时日志
- 错误信息

## 后续维护

### 更新部署
- 推送代码到 Git 仓库
- Zeabur 会自动重新部署

### 环境变量更新
- 在 Zeabur 控制台修改环境变量
- 重启服务生效

### 数据库备份
- 定期备份数据库数据
- Zeabur 提供自动备份功能

## 技术支持

如有部署问题，请参考：
- [Zeabur 官方文档](https://zeabur.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- 项目 README.md 文件