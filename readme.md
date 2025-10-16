街巷 - 社区互助平台 🎯 项目简介 "街巷"是一个简洁易用的社区互助平台，
街巷 - 社区互助平台
🎯 项目简介
"街巷"是一个简洁易用的社区互助平台，让邻里之间可以方便地互相帮助。平台设计简洁，适合所有年龄段用户使用，特别是老年人和小朋友。

✨ 主要功能
🏠 核心功能
发布需求：简单描述需要什么帮助
提供服务：分享自己的技能和资源
智能匹配：自动匹配合适的邻居
即时对话：直接与帮助者沟通
链接检查：确保所有交互元素正常工作
🎨 界面特色
简洁设计：去掉复杂装饰，专注核心功能
大字体大按钮：方便老年人和小朋友操作
温暖配色：适合夜晚查看，不刺眼
清晰导航：一目了然的页面结构
📱 页面功能
发布页面：以"好汉三个帮"为主题发布需求或服务
街巷互助广场：浏览社区内的所有互助信息
我的街巷互助：管理自己发布的需求和服务
对话页面：与邻居实时沟通
能量场：查看附近用户和匹配度
链接检查：检测页面所有链接的可用性
🚀 技术栈
前端：Next.js 15 + TypeScript + Tailwind CSS
后端：Next.js API Routes + Prisma ORM
数据库：SQLite
UI组件：shadcn/ui
实时通信：Socket.io
AI集成：z-ai-web-dev-sdk
📊 实现进度
✅ 已完成功能 (100%)
核心业务功能
用户系统
用户注册/登录模拟
用户资料管理
在线状态显示
位置信息管理
需求/服务发布
简化发布流程（1步发布）
智能场景识别
位置、时间、紧急程度设置
标签分类系统
智能匹配算法
基于距离的匹配（Haversine公式）
标签匹配算法
紧急程度权重计算
综合匹配分数计算：(distanceScore * 0.4) + (tagScore * 0.3) + (urgencyScore * 0.3)
对话系统
实时消息传递（Socket.io）
信任机制（6轮对话建立信任）
快捷回复模板
联系方式交换（3轮后解锁）
互助管理
需求/服务状态管理
响应系统
互助历史记录
激活/暂停功能
用户界面功能
响应式设计
移动端优先设计
适配各种屏幕尺寸
触摸友好的交互
无障碍支持
语义化HTML结构
ARIA标签支持
键盘导航支持
高对比度配色
链接可用性检查
自动检测页面所有可点击元素
可见性和可点击性验证
事件监听器检查
无障碍属性验证
实时状态反馈和详细报告
技术架构
数据库设计
Prisma Schema定义
用户、意图、需求、服务表结构
关系映射和约束
API接口
RESTful API设计
意图匹配接口
用户管理接口
需求/服务CRUD接口
实时通信
Socket.io集成
实时消息推送
在线状态同步
🚧 未实现功能建议
高优先级功能
真实用户认证系统
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
// 建议实现
- NextAuth.js集成
- 支持手机号/邮箱注册
- 短信验证码
- 微信/支付宝第三方登录
推送通知系统
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
// 建议实现
- Web Push API
- 移动端推送（PWA）
- 邮件通知
- 短信通知
地理位置服务
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
// 建议实现
- 高德/百度地图API
- 自动定位
- 地图显示
- 距离计算优化
图片上传功能
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
// 建议实现
- Cloudinary/AWS S3
- 图片压缩
- 多格式支持
- 安全验证
中优先级功能
评价系统
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
// 建议实现
- 星级评分
- 文字评价
- 互助历史统计
- 信誉等级系统
支付系统
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
// 建议实现
- 微信支付
- 支付宝
- 钱包功能
- 交易记录
群组功能
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
// 建议实现
- 小区群组
- 兴趣群组
- 群聊功能
- 群公告
低优先级功能
AI智能助手
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
// 建议实现
- 智能客服
- 需求自动分类
- 匹配算法优化
- 个性化推荐
数据分析后台
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
// 建议实现
- 用户行为分析
- 互助数据统计
- 热力图展示
- 报表导出
🛠️ 部署配置
Zeabur部署
项目已配置Zeabur部署支持，包含以下配置文件：

zeabur.yaml - Zeabur部署配置
.env.example - 环境变量示例
package-lock.json - 锁定依赖版本
部署步骤
准备Zeabur账户
注册Zeabur账户
连接GitHub仓库
配置环境变量
bash
Line Wrapping
折叠
复制
1
2
3
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.zeabur.app"
一键部署
选择Next.js模板
自动构建和部署
获得生产环境URL
依赖版本配置
项目使用稳定性和兼容性最高的依赖版本：

核心依赖
json
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
⌄
{
"next": "15.1.0",
"react": "18.3.1",
"react-dom": "18.3.1",
"typescript": "5.7.2",
"@types/node": "22.10.2",
"@types/react": "18.3.17",
"@types/react-dom": "18.3.5"
}
UI和样式
json
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
⌄
{
"tailwindcss": "3.4.17",
"@tailwindcss/typography": "0.5.15",
"lucide-react": "0.462.0",
"class-variance-authority": "0.7.1",
"clsx": "2.1.1",
"tailwind-merge": "2.5.4"
}
数据和API
json
Line Wrapping
折叠
复制
1
2
3
4
5
6
⌄
{
"prisma": "6.17.1",
"@prisma/client": "6.17.1",
"socket.io": "4.8.1",
"socket.io-client": "4.8.1"
}
开发工具
json
Line Wrapping
折叠
复制
1
2
3
4
5
6
⌄
{
"eslint": "9.17.0",
"eslint-config-next": "15.1.0",
"postcss": "8.5.1",
"autoprefixer": "10.4.20"
}
🎯 设计理念
简单易用
发布需求只需1步：输入描述 → 点击发布
大字体、大按钮，方便操作
清晰的视觉层次
温暖友好
橙红色主题，营造温暖氛围
适合夜晚低亮度查看
邻里互助的社区文化
智能高效
自动识别需求场景
智能匹配最合适的帮助者
支持语义理解
📋 使用指南
发布需求
选择"我需要"或"我能提供"
输入简单的描述
点击"发布"按钮
浏览互助
点击"街巷互助广场"
使用筛选功能查找相关信息
点击"联系TA"开始对话
管理互助
点击"我的街巷互助"
查看自己发布的信息
使用"激活/暂停"按钮管理状态
链接检查
点击"链接检查"
点击"开始测试"
查看详细报告和优化建议
🌟 特色场景
平台特别支持以下社区场景：

🏠 家门锁打不开
🔧 水管电器维修
📦 搬家搬运帮助
👶 照看老人孩子
🚗 代购配送服务
🛠️ 专业技能分享
🎊 优化亮点
操作简化
从5步操作减少到1步
自动场景识别
智能表单填充
界面优化
去掉无效装饰边框
统一温暖配色方案
增大可点击区域
用户体验
适合老年人操作
小朋友也能轻松使用
夜晚查看不刺眼
🔧 开发指南
本地开发
bash
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
# 安装依赖
npm install
# 启动开发服务器
npm run dev
# 运行数据库迁移
npm run db:push
# 代码检查
npm run lint
项目结构
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
12
13
14
src/
├── app/                 # Next.js App Router
│   ├── api/            # API路由
│   ├── globals.css     # 全局样式
│   ├── layout.tsx      # 根布局
│   └── page.tsx        # 主页面
├── components/         # React组件
│   ├── ui/            # shadcn/ui组件
│   └── *.tsx          # 业务组件
├── lib/               # 工具库
│   ├── db.ts          # 数据库配置
│   ├── utils.ts       # 工具函数
│   └── socket.ts      # Socket.io配置
└── hooks/             # React Hooks
贡献指南
Fork项目
创建功能分支
提交更改
推送到分支
创建Pull Request
街巷 - 让社区更温暖，让邻里更亲近！🏡❤️



AI Agent 开发指南 - 街巷社区互助平台
🤖 AI Agent 提示词模板
系统角色定义

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
你是一个专业的全栈开发工程师，专门负责"街巷"社区互助平台的开发、优化和维护。
## 核心职责
1. 理解并实现社区互助业务逻辑
2. 确保代码质量和用户体验
3. 优化性能和可访问性
4. 遵循项目的技术栈和开发规范
## 技术栈要求
- 前端：Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- 后端：Next.js API Routes + Prisma ORM
- 数据库：SQLite
- 实时通信：Socket.io
- AI集成：z-ai-web-dev-sdk
## 开发原则
1. 简单易用：适合老年人和小朋友操作
2. 温暖友好：橙红色主题，营造社区氛围
3. 智能高效：自动化匹配和推荐
4. 响应式设计：移动端优先
5. 无障碍支持：符合WCAG标准
## 禁止事项
- 不要使用除指定技术栈外的其他框架
- 不要修改核心配色方案（橙红色主题）
- 不要增加复杂的操作流程
- 不要忽视无障碍要求
- 不要使用indigo或蓝色颜色
功能开发提示词
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
## 任务：实现[具体功能名称]
### 需求分析
- 功能目标：[描述用户需求]
- 用户场景：[描述使用场景]
- 业务逻辑：[描述核心逻辑]
### 技术要求
- 使用Next.js 15 App Router
- TypeScript严格类型检查
- shadcn/ui组件库
- 响应式设计
- 无障碍支持
### 实现步骤
1. 分析现有代码结构
2. 设计数据模型（如需要）
3. 实现API接口
4. 开发前端组件
5. 集成到主应用
6. 测试和优化
### 验收标准
- 功能正常运行
- 代码质量通过检查
- 用户体验良好
- 响应式适配
- 无障碍合规
🧮 核心算法实现
1. 智能匹配算法
距离计算（Haversine公式）
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
⌄
⌄
/**
 * 计算两点间距离（公里）
 * @param lat1 纬度1
 * @param lng1 经度1
 * @param lat2 纬度2
 * @param lng2 经度2
 * @returns 距离（公里）
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
const R = 6371 // 地球半径（公里）
const dLat = (lat2 - lat1) * Math.PI / 180
const dLng = (lng2 - lng1) * Math.PI / 180
const a = 
Math.sin(dLat/2) * Math.sin(dLat/2) +
Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
Math.sin(dLng/2) * Math.sin(dLng/2)
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
return R * c
}
匹配分数计算
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
⌄
⌄
/**
 * 计算用户匹配分数
 * @param distance 距离（公里）
 * @param tagMatches 标签匹配数
 * @param totalTags 总标签数
 * @param urgency 紧急程度 (1-5)
 * @returns 匹配分数 (0-100)
 */
function calculateMatchScore(
distance: number,
tagMatches: number,
totalTags: number,
urgency: number
): number {
// 距离分数（距离越近分数越高）
const distanceScore = Math.max(0, 100 - (distance * 10))
// 标签分数
const tagScore = totalTags > 0 ? (tagMatches / totalTags) * 100 : 0
// 紧急程度分数
const urgencyScore = urgency * 20
// 加权计算总分
const totalScore = (distanceScore * 0.4) + (tagScore * 0.3) + (urgencyScore * 0.3)
return Math.min(100, Math.max(0, totalScore))
}
2. 信任建立算法
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
⌄
⌄
⌄
⌄
/**
 * 计算信任进度
 * @param messageCount 消息数量
 * @param maxMessages 最大消息数
 * @returns 信任进度百分比
 */
function calculateTrustProgress(messageCount: number, maxMessages: number = 6): number {
return Math.min((messageCount / maxMessages) * 100, 100)
}
/**
 * 判断是否可以交换联系方式
 * @param messageCount 消息数量
 * @param minMessages 最小消息数
 * @returns 是否可以交换
 */
function canExchangeContact(messageCount: number, minMessages: number = 3): boolean {
return messageCount >= minMessages
}
3. 场景识别算法
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
⌄
⌄
⌄
⌄
⌄
/**
 * 识别需求场景
 * @param text 用户输入文本
 * @returns 场景类型和置信度
 */
function identifyScenario(text: string): { scenario: string; confidence: number } {
const scenarios = {
emergency: ['紧急', '急', '马上', '立即', '帮忙', '救命'],
repair: ['修', '维修', '坏了', '故障', '漏水', '电器'],
care: ['照顾', '看护', '老人', '孩子', '病人'],
shopping: ['买', '购', '代购', '超市', '药店'],
moving: ['搬家', '搬运', '抬', '重物'],
learning: ['教', '学习', '辅导', '作业']
}
let bestMatch = { scenario: 'general', confidence: 0 }
for (const [scenario, keywords] of Object.entries(scenarios)) {
const matches = keywords.filter(keyword => text.includes(keyword)).length
const confidence = matches / keywords.length
if (confidence > bestMatch.confidence) {
bestMatch = { scenario, confidence }
}
}
return bestMatch
}
🚀 部署要点
Zeabur部署配置
1. 环境变量设置
bash
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
# 必需变量
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="https://your-domain.zeabur.app"
# 可选变量
NEXT_PUBLIC_MAP_API_KEY="your-map-api-key"
SMS_ACCESS_KEY="your-sms-access-key"
SMTP_HOST="smtp.gmail.com"
2. 构建优化
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
⌄
⌄
⌄
// next.config.ts
const nextConfig = {
// 启用压缩
compress: true,
// 优化图片
images: {
domains: ['your-cdn-domain.com'],
formats: ['image/webp', 'image/avif']
},
// 实验性功能
experimental: {
optimizeCss: true,
optimizePackageImports: ['lucide-react']
}
}
3. 性能优化
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
⌄
// 动态导入大型组件
const LinkChecker = dynamic(() => import('@/components/link-checker'), {
loading: () => <div>加载中...</div>,
ssr: false
})
// 图片优化
import Image from 'next/image'
<Image src="/avatar.jpg" alt="用户头像" width={40} height={40} priority />
数据库优化
1. 索引策略
sql
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
-- 用户位置索引
CREATE INDEX idx_user_location ON User(locationLat, locationLng);
-- 意图时间索引
CREATE INDEX idx_intent_created ON Intent(createdAt);
-- 活跃状态索引
CREATE INDEX idx_demand_active ON Demand(active);
2. 查询优化
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
⌄
⌄
⌄
⌄
⌄
// 使用Prisma的include和select优化查询
const users = await db.user.findMany({
select: {
id: true,
name: true,
avatar: true,
locationLat: true,
locationLng: true,
onlineStatus: true
},
where: {
onlineStatus: true,
locationLat: {
gte: minLat,
lte: maxLat
},
locationLng: {
gte: minLng,
lte: maxLng
}
}
})
🔮 未来建议
短期优化（1-3个月）
1. 性能优化
实现服务端渲染（SSR）提升首屏加载速度
添加Redis缓存减少数据库查询
优化图片加载和CDN配置
实现增量静态再生（ISR）
2. 功能增强
添加推送通知系统
实现图片上传和压缩
集成地图服务显示用户位置
添加评价和信誉系统
3. 用户体验
实现PWA支持离线使用
添加语音输入功能
优化移动端手势操作
增加快捷键支持
中期发展（3-6个月）
1. AI智能化
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
⌄
⌄
⌄
⌄
⌄
⌄
// AI需求分类
async function classifyIntent(text: string): Promise<{
category: string;
urgency: number;
tags: string[];
}> {
const zai = await ZAI.create()
const response = await zai.chat.completions.create({
messages: [
{
role: 'system',
content: '你是一个社区需求分类专家，请分析用户需求并分类。'
},
{
role: 'user',
content: `请分类以下需求：${text}`
}
]
})
return JSON.parse(response.choices[0].message.content)
}
2. 社交功能
实现群组聊天功能
添加社区公告系统
实现活动组织功能
添加好友关系管理
3. 商业化功能
集成支付系统
实现积分奖励机制
添加广告位管理
实现会员订阅功能
长期规划（6-12个月）
1. 平台扩展
支持多社区管理
实现跨社区互助
添加商家入驻功能
开发移动端APP
2. 数据智能
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
⌄
⌄
// 智能推荐算法
async function getRecommendations(userId: string): Promise<{
users: User[];
intents: Intent[];
services: Service[];
}> {
// 基于用户历史的协同过滤
// 基于位置的推荐
// 基于时间的推荐
// 基于兴趣的推荐
}
3. 生态建设
开放API接口
第三方应用集成
数据分析平台
智能客服系统
📊 监控和分析
1. 性能监控
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
⌄
⌄
// 性能指标收集
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'
function sendToAnalytics(metric: any) {
// 发送到分析服务
fetch('/api/analytics', {
method: 'POST',
body: JSON.stringify(metric)
})
}
getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
2. 用户行为分析
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
⌄
⌄
⌄
// 用户行为追踪
interface UserEvent {
type: 'click' | 'view' | 'submit' | 'match'
target: string
timestamp: number
userId?: string
metadata?: Record<string, any>
}
function trackEvent(event: UserEvent) {
// 发送到分析服务
analytics.track(event.type, {
target: event.target,
userId: event.userId,
...event.metadata
})
}
3. 错误监控
typescript
Line Wrapping
折叠
复制
1
2
3
4
5
6
7
8
9
10
11
12
13
⌄
⌄
⌄
// 错误边界和上报
import * as Sentry from '@sentry/nextjs'
Sentry.init({
dsn: process.env.SENTRY_DSN,
environment: process.env.NODE_ENV
})
export class ErrorBoundary extends Component {
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
Sentry.captureException(error)
}
}
🎯 开发最佳实践
1. 代码规范
使用TypeScript严格模式
遵循ESLint和Prettier配置
编写单元测试和集成测试
使用语义化Git提交信息
2. 安全考虑
输入验证和清理
SQL注入防护
XSS攻击防护
CSRF令牌验证
敏感数据加密
3. 可访问性
语义化HTML结构
ARIA标签支持
键盘导航支持
屏幕阅读器兼容
高对比度模式
4. 性能优化
代码分割和懒加载
图片优化和压缩
缓存策略实施
Bundle大小优化
服务端渲染优化
注意：本指南会随着项目发展持续更新，请定期查看