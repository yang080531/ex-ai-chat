# 前任AI - 安卓APP

一个模仿前任说话风格的AI聊天应用。

## 功能特点

- 🤖 支持多种大模型API（OpenAI、Kimi、豆包、通义千问等）
- 👤 可上传前任照片、导入聊天记录、手动描述性格
- 💬 微信风格的聊天界面
- 💾 所有数据本地存储，保护隐私
- 📱 可打包成APK安装到安卓手机

## 文件结构

```
ex-ai-chat/
├── index.html          # 主页面
├── config.html         # API配置页面
├── setup.html          # 角色设定页面
├── chat.html           # 聊天页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 主要逻辑
├── capacitor.config.json # Capacitor配置
└── README.md           # 本文件
```

## 打包成APK教程

### 方法一：使用Capacitor（推荐）

#### 1. 安装Node.js
确保已安装Node.js（14+）：https://nodejs.org/

#### 2. 安装依赖
在项目目录打开命令行：
```bash
cd ex-ai-chat
npm init -y
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

#### 3. 初始化Capacitor
```bash
npx cap init
```
按提示输入：
- App name: 前任AI
- App ID: com.example.exai

#### 4. 添加安卓平台
```bash
npx cap add android
```

#### 5. 构建并同步
```bash
npx cap sync
```

#### 6. 打开Android Studio
```bash
npx cap open android
```

#### 7. 生成APK
在Android Studio中：
- 等待Gradle同步完成
- 菜单栏选择 Build → Build Bundle(s) / APK(s) → Build APK(s)
- 生成的APK在：`android/app/build/outputs/apk/debug/app-debug.apk`

### 方法二：使用Cordova

```bash
npm install -g cordova
cordova create ex-ai-cordova com.example.exai 前任AI
cd ex-ai-cordova
# 将本项目的html/css/js复制到www目录
cordova platform add android
cordova build android
```

### 方法三：在线打包工具

如果不想配置环境，可以使用：
1. **PhoneGap Build** (Adobe) - 上传zip在线打包
2. **Ionic Appflow** - 云端构建
3. **Android Studio直接导入**
   - 创建新项目
   - 选择 "Empty Activity"
   - 在 `app/src/main/assets/www` 放入本项目的所有文件
   - 修改 `MainActivity.java` 加载本地HTML

## 使用方法

### 1. 配置API
首次使用需要配置：
- 选择API提供商（OpenAI/Kimi/豆包/千问）
- 输入API Key
- 选择模型
- 设置温度参数

**获取API Key：**
- OpenAI: https://platform.openai.com
- Kimi: https://platform.moonshot.cn
- 豆包: https://console.volces.com
- 通义千问: https://dashscope.aliyun.com

### 2. 设定角色
- 上传前任照片（可选）
- 导入聊天记录分析风格（可选）
- 手动输入性格、口头禅、回忆
- 生成人设Prompt

### 3. 开始对话
- 进入聊天界面
- 像正常聊天一样输入消息
- AI会以前任的身份和语气回复

## 技术说明

- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **框架**: 原生JS，无依赖
- **存储**: LocalStorage
- **API**: OpenAI兼容格式
- **打包**: Capacitor/Cordova

## 隐私说明

- 所有配置和聊天记录仅保存在本地
- API Key不会上传到任何服务器
- 照片使用base64存储在本地
- 可以随时清除所有数据

## 常见问题

**Q: 为什么回复很慢？**
A: 取决于API提供商和网络状况。Kimi和豆包在国内访问较快。

**Q: 可以离线使用吗？**
A: 不行，需要连接大模型API。

**Q: 支持iOS吗？**
A: 代码兼容，但需要Mac电脑和Xcode打包。

**Q: 如何清空数据？**
A: 在聊天页面点击右上角垃圾桶图标，或在手机设置中清除应用数据。

## 免责声明

本应用仅供娱乐和技术学习使用。使用第三方API可能产生费用，请注意API调用额度。

---

制作：前任AI团队
版本：1.0.0
