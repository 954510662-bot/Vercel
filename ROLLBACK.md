# CodeBrush 回滚方案

## 1. 概述

本文档定义了 CodeBrush 项目的回滚策略和操作流程，确保在发布出现问题时能够快速、安全地恢复到稳定版本。

## 2. 回滚策略

### 2.1 策略类型

| 策略 | 适用场景 | 恢复时间 | 数据风险 |
|------|----------|----------|----------|
| **快速回滚** | 前端界面问题、功能异常 | < 5分钟 | 低 |
| **版本回退** | 严重功能缺陷、性能问题 | 10-15分钟 | 低 |
| **数据恢复** | 数据丢失、数据库损坏 | 视数据量而定 | 中 |

### 2.2 触发条件

当出现以下情况时，应立即触发回滚：

- 应用无法启动或加载
- 核心功能完全失效
- 严重的性能问题（响应时间 > 10秒）
- 安全漏洞被发现
- 用户反馈大量失败操作

## 3. 回滚流程

### 3.1 快速回滚（推荐）

适用于使用 Vercel 等平台部署的场景。

**步骤**:

1. **确认问题**
   ```bash
   # 检查当前部署状态
   vercel ls
   ```

2. **回滚到上一个版本**
   ```bash
   # 回滚到上一个生产版本
   vercel rollback --prod
   ```

3. **验证回滚结果**
   - 检查应用是否正常加载
   - 测试核心功能
   - 监控错误日志

### 3.2 版本回退

适用于需要回退到特定版本的场景。

**步骤**:

1. **查找目标版本**
   ```bash
   # 查看部署历史
   vercel ls --all
   ```

2. **部署指定版本**
   ```bash
   # 使用特定 Git commit 部署
   vercel --prod --prebuilt --token $VERCEL_TOKEN
   ```

3. **验证**
   - 确认版本号
   - 执行功能测试
   - 检查性能指标

### 3.3 手动回滚

如果自动化工具不可用，使用手动方式。

**步骤**:

1. **停止当前服务**
   ```bash
   # 如果使用 PM2
   pm2 stop codebrush
   ```

2. **切换到稳定版本**
   ```bash
   git checkout <stable-commit-hash>
   ```

3. **重新构建**
   ```bash
   pnpm install
   pnpm run build
   ```

4. **重启服务**
   ```bash
   pm2 start codebrush
   ```

## 4. 回滚检查清单

### 4.1 回滚前检查

- [ ] 确认问题范围和影响
- [ ] 通知相关团队成员
- [ ] 备份当前状态
- [ ] 记录当前版本信息

### 4.2 回滚中操作

- [ ] 执行回滚命令
- [ ] 监控回滚过程
- [ ] 记录回滚日志
- [ ] 通知相关人员

### 4.3 回滚后验证

- [ ] 应用启动正常
- [ ] 核心功能可用
- [ ] 性能指标正常
- [ ] 无错误日志
- [ ] 通知用户服务恢复

## 5. 版本管理

### 5.1 版本命名规范

```
v<major>.<minor>.<patch>[-<pre-release>]

示例:
- v1.0.0
- v1.0.1
- v1.1.0-beta.1
```

### 5.2 标签管理

```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release v1.0.0"

# 推送标签
git push origin v1.0.0

# 查看标签
git tag -l
```

### 5.3 发布分支策略

- `main`: 生产稳定版本
- `develop`: 开发分支
- `feature/*`: 功能特性分支
- `hotfix/*`: 紧急修复分支

## 6. 监控与告警

### 6.1 关键指标

| 指标 | 阈值 | 告警方式 |
|------|------|----------|
| 响应时间 | > 3秒 | Slack |
| 错误率 | > 5% | Slack + Email |
| 内存使用率 | > 80% | Slack |
| CPU使用率 | > 90% | Slack |

### 6.2 监控工具

- **前端监控**: Sentry
- **性能监控**: Lighthouse CI
- **日志聚合**: Datadog / ELK Stack

## 7. 应急预案

### 7.1 紧急联系人

| 角色 | 姓名 | 联系方式 |
|------|------|----------|
| 技术负责人 | 张三 | zhangsan@example.com |
| 开发工程师 | 李四 | lisi@example.com |
| DevOps工程师 | 王五 | wangwu@example.com |

### 7.2 沟通渠道

- **即时通讯**: Slack #codebrush-alerts
- **邮件列表**: codebrush-team@example.com
- **电话**: 紧急情况下使用

### 7.3 升级流程

如果回滚后问题仍未解决：

1. 降级到更早的稳定版本
2. 如果所有版本都有问题，启用维护模式页面
3. 通知用户服务中断
4. 组织紧急修复会议

## 8. 演练计划

### 8.1 定期演练

- **频率**: 每月一次
- **参与人员**: 开发、运维团队
- **目标**: 验证回滚流程的有效性

### 8.2 演练步骤

1. 模拟部署一个有问题的版本
2. 执行回滚操作
3. 记录回滚时间
4. 验证回滚结果
5. 总结经验教训

## 9. 文档更新

每次执行回滚后，应更新以下文档：

- 版本变更日志
- 问题追踪记录
- 回滚操作记录

## 10. 附录

### 10.1 常用命令

```bash
# 查看当前部署版本
vercel ls

# 回滚到上一版本
vercel rollback --prod

# 查看 Git 提交历史
git log --oneline -10

# 创建紧急修复分支
git checkout -b hotfix/issue-xxx

# 合并修复到主分支
git checkout main
git merge hotfix/issue-xxx
```

### 10.2 环境变量

```env
# Vercel 配置
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id

# 监控配置
SENTRY_DSN=your-sentry-dsn
DATADOG_API_KEY=your-datadog-key
```

### 10.3 维护页面模板

当需要长时间维护时，可显示维护页面：

```html
<!DOCTYPE html>
<html>
<head>
  <title>CodeBrush - 维护中</title>
  <style>
    body { text-align: center; padding: 100px; font-family: sans-serif; }
    h1 { font-size: 50px; }
    body { font: 20px Helvetica, sans-serif; color: #333; }
    article { display: block; text-align: left; max-width: 650px; margin: 0 auto; }
    a { color: #dc8100; text-decoration: none; }
    a:hover { color: #333; text-decoration: none; }
  </style>
</head>
<body>
  <article>
    <h1>我们正在维护</h1>
    <p>抱歉，CodeBrush 暂时不可用。我们正在进行紧急维护，预计很快恢复。</p>
    <p>&mdash; CodeBrush 团队</p>
  </article>
</body>
</html>
```