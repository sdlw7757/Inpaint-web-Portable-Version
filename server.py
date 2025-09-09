#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
import sys

# 设置端口
PORT = 5173

# 切换到dist目录
os.chdir(os.path.join(os.path.dirname(__file__), 'dist'))

# 创建处理器
Handler = http.server.SimpleHTTPRequestHandler

# 创建服务器
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("==================================")
    print("     正在启动 Inpaint Web 应用...")
    print("==================================")
    print("")
    print("启动成功后将自动打开浏览器...")
    print("关闭应用请按 Ctrl+C")
    print("")
    print(f"本地访问: http://localhost:{PORT}")
    print(f"网络访问: http://你的IP地址:{PORT}")
    print("")
    
    # 自动打开浏览器
    webbrowser.open(f'http://localhost:{PORT}')
    
    try:
        # 启动服务器
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n正在关闭服务器...")
        sys.exit(0)