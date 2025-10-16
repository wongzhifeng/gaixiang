#!/usr/bin/env node
// DeepSeek MCP Server (OpenAI-compatible chat proxy)
// Env vars required: DEEPSEEK_API_KEY
// Optional: DEEPSEEK_API_BASE (default: https://api.deepseek.com)

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new Server({ name: "deepseek-mcp", version: "0.1.0" });

const ChatInput = z.object({
  model: z.string().default("deepseek-chat"),
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string(),
      })
    )
    .nonempty(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().optional(),
});

server.tool(
  {
    name: "deepseek_chat",
    description: "调用 DeepSeek Chat Completions（OpenAI 兼容接口）",
    inputSchema: ChatInput,
  },
  async ({ model, messages, temperature, max_tokens }) => {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return {
        content: [
          { type: "text", text: "DEEPSEEK_API_KEY 未设置，请配置环境变量后重试。" },
        ],
      };
    }

    const apiBase = process.env.DEEPSEEK_API_BASE || "https://api.deepseek.com";
    const url = `${apiBase.replace(/\/$/, "")}/v1/chat/completions`;

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, messages, temperature, max_tokens }),
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        return {
          content: [
            {
              type: "text",
              text: `DeepSeek API 调用失败: ${resp.status} ${resp.statusText} ${errText}`.trim(),
            },
          ],
        };
      }

      const data = await resp.json();
      const text = data?.choices?.[0]?.message?.content ?? "";
      return { content: [{ type: "text", text }] };
    } catch (e) {
      return {
        content: [
          { type: "text", text: `DeepSeek API 调用异常: ${e?.message || String(e)}` },
        ],
      };
    }
  }
);

const transport = new StdioServerTransport();
server.connect(transport).catch((err) => {
  console.error("DeepSeek MCP server failed:", err);
  process.exit(1);
});


