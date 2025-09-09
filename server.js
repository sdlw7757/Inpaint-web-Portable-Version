const express = require('express');
const path = require('path');
const open = require('open');

const app = express();
const PORT = process.env.PORT || 5173;

// 提供静态文件
app.use(express.static(path.join(__dirname, 'dist')));

// 所有路由都返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).send('服务器内部错误');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`==================================`);
  console.log(`     Inpaint Web 应用已启动!`);
  console.log(`==================================`);
  console.log(``);
  console.log(`本地访问: http://localhost:${PORT}`);
  console.log(`网络访问: http://你的IP地址:${PORT}`);
  console.log(``);
  console.log(`关闭应用请按 Ctrl+C`);
  console.log(``);
  
  // 延迟几秒后自动打开浏览器，确保服务器完全启动
  setTimeout(() => {
    open(`http://localhost:${PORT}`).then(() => {
      console.log('浏览器已打开');
    }).catch(err => {
      console.log('无法自动打开浏览器，请手动访问 http://localhost:' + PORT);
    });
  }, 2000);
});

// 处理服务器启动错误
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`端口 ${PORT} 已被占用，正在尝试其他端口...`);
    server.close();
    const newPort = PORT + 1;
    app.listen(newPort, '0.0.0.0', () => {
      console.log(`==================================`);
      console.log(`     Inpaint Web 应用已启动!`);
      console.log(`==================================`);
      console.log(``);
      console.log(`本地访问: http://localhost:${newPort}`);
      console.log(`网络访问: http://你的IP地址:${newPort}`);
      console.log(``);
      console.log(`关闭应用请按 Ctrl+C`);
      console.log(``);
      
      setTimeout(() => {
        open(`http://localhost:${newPort}`).catch(err => {
          console.log('无法自动打开浏览器，请手动访问 http://localhost:' + newPort);
        });
      }, 2000);
    });
  } else {
    console.error('服务器启动失败:', err);
  }
});