# CodeBrush 部署指南

## 1. 环境要求

### 1.1 基础环境
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 或 **pnpm**: >= 8.0.0
- **Git**: >= 2.0.0

### 1.2 开发环境
- **操作系统**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 18.04+)
- **代码编辑器**: Visual Studio Code (推荐)
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+

## 2. 项目结构

```
CodeBrush/
├── src/                    # 源代码目录
│   ├── components/         # React组件
│   │   ├── Toolbar.tsx     # 工具栏组件
│   │   ├── Editor.tsx      # 画布编辑器
│   │   ├── LayersPanel.tsx # 图层面板
│   │   └── PropertiesPanel.tsx # 属性面板
│   ├── store/              # 状态管理
│   │   └── index.ts        # Zustand store
│   ├── types/              # TypeScript类型定义
│   │   └── index.ts
│   ├── tests/              # 测试文件
│   │   └── core.test.ts
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 入口文件
│   └── index.css           # 全局样式
├── public/                 # 静态资源
├── package.json            # 依赖配置
├── vite.config.ts          # Vite配置
├── tsconfig.json           # TypeScript配置
├── tailwind.config.js      # Tailwind配置
├── postcss.config.js       # PostCSS配置
└── vitest.config.ts        # Vitest配置
```

## 3. 安装与运行

### 3.1 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 3.2 开发模式

```bash
pnpm run dev
```

访问地址: http://localhost:5173

### 3.3 构建生产版本

```bash
pnpm run build
```

构建产物将输出到 `dist/` 目录。

### 3.4 预览生产版本

```bash
pnpm run preview
```

### 3.5 运行测试

```bash
# 运行所有测试
pnpm test --run

# 监听模式
pnpm test
```

## 4. 配置说明

### 4.1 Vite 配置

主要配置项：
- `server.port`: 开发服务器端口 (默认: 5173)
- `build.outDir`: 构建输出目录 (默认: dist)
- `plugins`: 使用 @vitejs/plugin-react

### 4.2 TypeScript 配置

- `strict`: 启用严格类型检查
- `baseUrl`: 模块解析基础路径
- `paths`: 路径别名配置

### 4.3 Tailwind 配置

- `content`: 需要扫描的文件路径
- `theme.extend`: 自定义主题扩展

## 5. 部署方案

### 5.1 静态文件部署

#### 使用 Nginx

```nginx
server {
  listen 80;
  server_name your-domain.com;

  root /path/to/dist;
  index index.html;

  # 单页应用路由配置
  location / {
    try_files $uri $uri/ /index.html;
  }

  # 静态资源缓存
  location ~* \.(js|css|png|jpg|jpeg|svg|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

#### 使用 Apache

```apache
<VirtualHost *:80>
  ServerName your-domain.com
  DocumentRoot /path/to/dist

  <Directory /path/to/dist>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted

    # 单页应用路由配置
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
  </Directory>
</VirtualHost>
```

### 5.2 云平台部署

#### Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel
```

#### Netlify

1. 连接 GitHub 仓库
2. 设置构建命令: `pnpm run build`
3. 设置输出目录: `dist`
4. 部署

#### AWS S3

```bash
# 安装 AWS CLI
pip install awscli

# 配置 AWS 凭证
aws configure

# 上传文件
aws s3 sync dist/ s3://your-bucket-name --delete
```

## 6. 环境变量

当前项目暂不需要环境变量。如需添加，可在 `.env` 文件中配置：

```env
VITE_APP_TITLE=CodeBrush
VITE_API_URL=https://api.example.com
```

## 7. 常见问题

### 7.1 依赖安装失败

```bash
# 清理缓存后重试
pnpm cache clean
pnpm install
```

### 7.2 构建失败

- 检查 Node.js 版本是否符合要求
- 检查 TypeScript 错误信息
- 确保所有依赖已正确安装

### 7.3 开发服务器无法启动

- 检查端口 5173 是否被占用
- 尝试更换端口：`pnpm run dev --port 5174`

### 7.4 测试失败

- 检查测试文件中的状态管理调用
- 确保测试前状态已正确初始化

## 8. 安全注意事项

- 避免在客户端存储敏感信息
- 使用 HTTPS 协议传输数据
- 定期更新依赖版本
- 启用 CSP (Content Security Policy)

## 9. 性能优化建议

- 使用 CDN 加速静态资源
- 启用 gzip/brotli 压缩
- 配置 HTTP 缓存策略
- 优化图片资源大小