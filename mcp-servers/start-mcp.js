#!/usr/bin/env node
// 街巷项目 MCP 服务器启动脚本
// 创建时间：2025-01-12
// 负责人：Claude Code

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MCP 服务器配置
const servers = [
  {
    name: 'playwright',
    command: 'npx',
    args: ['-y', '@executeautomation/playwright-mcp-server'],
    env: { PLAYWRIGHT_HEADLESS: 'true' }
  },
  {
    name: 'context7',
    command: 'npx',
    args: ['-y', '@upstash/context7-mcp@latest'],
    env: { CONTEXT7_API_KEY: 'ctx7sk-3eff1f70-bd18-43af-955d-c2a3f0f94f45' }
  },
  {
    name: 'sequential-thinking',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-sequential-thinking']
  },
  {
    name: 'filesystem',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', '/Users/mac/Desktop/code/gaixiang']
  }
];

// 启动所有 MCP 服务器
servers.forEach(server => {
  console.log(`启动 MCP 服务器: ${server.name}`);
  
  const child = spawn(server.command, server.args, {
    env: { ...process.env, ...server.env },
    stdio: ['pipe', 'pipe', 'pipe']
  });

  child.stdout.on('data', (data) => {
    console.log(`[${server.name}] ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`[${server.name}] ${data}`);
  });

  child.on('close', (code) => {
    console.log(`MCP 服务器 ${server.name} 退出，代码: ${code}`);
  });

  child.on('error', (error) => {
    console.error(`MCP 服务器 ${server.name} 错误:`, error);
  });
});

console.log('所有 MCP 服务器已启动');
