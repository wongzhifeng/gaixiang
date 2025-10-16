# 街巷项目 MCP 扩展配置

**创建时间**：2025-01-12  
**负责人**：Claude Code  
**版本**：v1.0.0

## 概述

本文档描述了街巷社区互助平台的MCP（Model Context Protocol）扩展配置，包括从flulink项目移植的扩展和新增的管理工具。

## 已安装的MCP扩展

### 1. Context7
- **功能**：上下文管理和检索
- **包名**：@upstash/context7-mcp
- **API密钥**：ctx7sk-3eff1f70-bd18-43af-955d-c2a3f0f94f45
- **用途**：智能上下文管理和文档检索

### 2. Sequential Thinking
- **功能**：顺序思维处理
- **包名**：@modelcontextprotocol/server-sequential-thinking
- **用途**：复杂问题的分步思考和解决

### 3. Playwright
- **功能**：浏览器自动化测试
- **包名**：@executeautomation/playwright-mcp-server
- **用途**：Web界面测试和自动化操作

### 4. Filesystem
- **功能**：文件系统操作
- **包名**：@modelcontextprotocol/server-filesystem
- **用途**：项目文件管理和操作

### 5. GitHub
- **功能**：GitHub集成
- **包名**：@modelcontextprotocol/server-github
- **用途**：代码仓库管理和协作

## 配置文件

### .cursor/mcp.json
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "env": {
        "CONTEXT7_API_KEY": "ctx7sk-3eff1f70-bd18-43af-955d-c2a3f0f94f45"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/mac/Desktop/code/gaixiang"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-token-here"
      }
    }
  }
}
```

## 管理工具

### 1. manage-mcp.sh
MCP服务器管理脚本，提供以下功能：
- 检查MCP配置
- 安装MCP依赖
- 测试MCP服务器
- 启动/停止MCP服务器
- 显示服务器状态
- 全部设置

**使用方法**：
```bash
./mcp-servers/manage-mcp.sh
```

### 2. start-mcp.js
Node.js启动脚本，用于启动所有MCP服务器。

**使用方法**：
```bash
node mcp-servers/start-mcp.js
```

### 3. playwright.ts
自定义Playwright MCP服务器，提供以下功能：
- 打开浏览器页面
- 导航到URL
- 点击元素
- 填充表单
- 截图
- 关闭浏览器

## 安装和配置

### 1. 安装依赖
```bash
npm install --save-dev @modelcontextprotocol/sdk playwright zod
```

### 2. 全局安装MCP服务器
```bash
npm install -g @executeautomation/playwright-mcp-server
npm install -g @upstash/context7-mcp
npm install -g @modelcontextprotocol/server-sequential-thinking
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-github
```

### 3. 配置API密钥
在`.cursor/mcp.json`中配置相应的API密钥：
- Context7 API Key
- Brave Search API Key
- GitHub Personal Access Token

### 4. 启动MCP服务器
```bash
./mcp-servers/manage-mcp.sh
```

## 使用指南

### Context7使用
Context7用于智能上下文管理，可以帮助：
- 存储和检索项目文档
- 管理代码上下文
- 智能问答和检索

### Sequential Thinking使用
Sequential Thinking用于复杂问题的分步思考：
- 问题分解
- 步骤规划
- 逻辑推理
- 解决方案生成

### Playwright使用
Playwright用于Web自动化测试：
- 界面测试
- 用户流程测试
- 端到端测试
- 性能测试

### Filesystem使用
Filesystem用于文件系统操作：
- 文件读写
- 目录管理
- 项目文件操作
- 代码生成

## 故障排除

### 常见问题

1. **MCP服务器启动失败**
   - 检查依赖是否正确安装
   - 验证API密钥配置
   - 查看错误日志

2. **Context7连接失败**
   - 验证API密钥有效性
   - 检查网络连接
   - 确认服务状态

3. **Playwright测试失败**
   - 检查浏览器安装
   - 验证页面元素选择器
   - 查看截图和日志

### 调试方法

1. **查看日志**
   ```bash
   # 查看MCP服务器日志
   tail -f ~/.cursor/logs/mcp.log
   ```

2. **测试连接**
   ```bash
   # 测试MCP服务器连接
   npx @executeautomation/playwright-mcp-server --test
   ```

3. **重启服务**
   ```bash
   # 重启所有MCP服务器
   ./mcp-servers/manage-mcp.sh
   ```

## 更新和维护

### 定期更新
- 每月检查MCP扩展更新
- 更新API密钥
- 测试功能完整性

### 备份配置
- 备份`.cursor/mcp.json`
- 备份自定义服务器代码
- 记录配置变更

### 性能优化
- 监控服务器资源使用
- 优化API调用频率
- 清理缓存和日志

## 安全考虑

### API密钥安全
- 不要在代码中硬编码API密钥
- 使用环境变量管理密钥
- 定期轮换密钥

### 访问控制
- 限制文件系统访问权限
- 控制网络访问范围
- 监控异常操作

### 数据保护
- 加密敏感数据
- 定期清理临时文件
- 保护用户隐私

## 联系和支持

如有问题或需要支持，请联系：
- **项目负责人**：Claude Code
- **创建时间**：2025-01-12
- **版本**：v1.0.0

---

**注意**：本文档会随着MCP扩展的更新而持续维护。
