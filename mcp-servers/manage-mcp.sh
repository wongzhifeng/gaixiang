#!/bin/bash
# 街巷项目 MCP 服务器管理脚本
# 创建时间：2025-01-12
# 负责人：Claude Code

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="/Users/mac/Desktop/code/gaixiang"
MCP_DIR="$PROJECT_ROOT/mcp-servers"

echo -e "${BLUE}街巷项目 MCP 服务器管理${NC}"
echo "================================"

# 检查 MCP 配置
check_mcp_config() {
    echo -e "${YELLOW}检查 MCP 配置...${NC}"
    
    if [ ! -f "$PROJECT_ROOT/.cursor/mcp.json" ]; then
        echo -e "${RED}错误: MCP 配置文件不存在${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✓ MCP 配置文件存在${NC}"
    return 0
}

# 安装 MCP 依赖
install_mcp_deps() {
    echo -e "${YELLOW}安装 MCP 依赖...${NC}"
    
    cd "$PROJECT_ROOT"
    
    # 安装核心 MCP 包
    npm install --save-dev @modelcontextprotocol/sdk playwright zod
    
    # 安装 MCP 服务器
    npm install -g @executeautomation/playwright-mcp-server
    npm install -g @upstash/context7-mcp
    npm install -g @modelcontextprotocol/server-sequential-thinking
    npm install -g @modelcontextprotocol/server-filesystem
    npm install -g @modelcontextprotocol/server-brave-search
    npm install -g @modelcontextprotocol/server-github
    
    echo -e "${GREEN}✓ MCP 依赖安装完成${NC}"
}

# 测试 MCP 服务器
test_mcp_servers() {
    echo -e "${YELLOW}测试 MCP 服务器...${NC}"
    
    # 测试 playwright
    echo "测试 Playwright MCP 服务器..."
    npx @executeautomation/playwright-mcp-server --version || echo -e "${RED}Playwright MCP 服务器测试失败${NC}"
    
    # 测试 context7
    echo "测试 Context7 MCP 服务器..."
    npx @upstash/context7-mcp@latest --version || echo -e "${RED}Context7 MCP 服务器测试失败${NC}"
    
    # 测试 sequential-thinking
    echo "测试 Sequential Thinking MCP 服务器..."
    npx @modelcontextprotocol/server-sequential-thinking --version || echo -e "${RED}Sequential Thinking MCP 服务器测试失败${NC}"
    
    echo -e "${GREEN}✓ MCP 服务器测试完成${NC}"
}

# 启动 MCP 服务器
start_mcp_servers() {
    echo -e "${YELLOW}启动 MCP 服务器...${NC}"
    
    cd "$MCP_DIR"
    
    # 启动自定义 Playwright 服务器
    echo "启动自定义 Playwright 服务器..."
    node playwright.ts &
    
    echo -e "${GREEN}✓ MCP 服务器已启动${NC}"
}

# 停止 MCP 服务器
stop_mcp_servers() {
    echo -e "${YELLOW}停止 MCP 服务器...${NC}"
    
    # 查找并停止 MCP 相关进程
    pkill -f "playwright-mcp-server" || true
    pkill -f "context7-mcp" || true
    pkill -f "server-sequential-thinking" || true
    pkill -f "server-filesystem" || true
    pkill -f "playwright.ts" || true
    
    echo -e "${GREEN}✓ MCP 服务器已停止${NC}"
}

# 显示状态
show_status() {
    echo -e "${YELLOW}MCP 服务器状态:${NC}"
    
    # 检查进程
    if pgrep -f "playwright-mcp-server" > /dev/null; then
        echo -e "${GREEN}✓ Playwright MCP 服务器运行中${NC}"
    else
        echo -e "${RED}✗ Playwright MCP 服务器未运行${NC}"
    fi
    
    if pgrep -f "context7-mcp" > /dev/null; then
        echo -e "${GREEN}✓ Context7 MCP 服务器运行中${NC}"
    else
        echo -e "${RED}✗ Context7 MCP 服务器未运行${NC}"
    fi
    
    if pgrep -f "server-sequential-thinking" > /dev/null; then
        echo -e "${GREEN}✓ Sequential Thinking MCP 服务器运行中${NC}"
    else
        echo -e "${RED}✗ Sequential Thinking MCP 服务器未运行${NC}"
    fi
}

# 主菜单
show_menu() {
    echo ""
    echo "请选择操作:"
    echo "1) 检查 MCP 配置"
    echo "2) 安装 MCP 依赖"
    echo "3) 测试 MCP 服务器"
    echo "4) 启动 MCP 服务器"
    echo "5) 停止 MCP 服务器"
    echo "6) 显示状态"
    echo "7) 全部设置"
    echo "0) 退出"
    echo ""
}

# 全部设置
setup_all() {
    echo -e "${BLUE}开始全部设置...${NC}"
    
    check_mcp_config
    install_mcp_deps
    test_mcp_servers
    start_mcp_servers
    
    echo -e "${GREEN}✓ 全部设置完成${NC}"
}

# 主循环
main() {
    while true; do
        show_menu
        read -p "请输入选择 (0-7): " choice
        
        case $choice in
            1) check_mcp_config ;;
            2) install_mcp_deps ;;
            3) test_mcp_servers ;;
            4) start_mcp_servers ;;
            5) stop_mcp_servers ;;
            6) show_status ;;
            7) setup_all ;;
            0) echo -e "${GREEN}退出${NC}"; exit 0 ;;
            *) echo -e "${RED}无效选择，请重试${NC}" ;;
        esac
        
        echo ""
        read -p "按回车键继续..."
    done
}

# 如果直接运行脚本
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
    main "$@"
fi
