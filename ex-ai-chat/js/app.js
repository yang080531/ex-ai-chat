/**
 * 前任AI v2.0 - 全面升级
 * 更多模型支持 | 更美观UI | 修复人设功能
 */

// ==================== 配置 ====================
const STORAGE_KEYS = {
    API_CONFIG: 'ex_ai_api_v2',
    PERSONA: 'ex_ai_persona_v2',
    USER_PROFILE: 'ex_ai_user_profile_v2',
    CHAT_HISTORY: 'ex_ai_chat_v2',
    STATS: 'ex_ai_stats'
};

// 支持的模型列表（增加更多）
const AI_MODELS = {
    openai: {
        name: 'OpenAI GPT-4',
        url: 'https://api.openai.com/v1/chat/completions',
        models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
        defaultModel: 'gpt-3.5-turbo',
        desc: '最强大模型'
    },
    kimi: {
        name: 'Kimi (Moonshot)',
        url: 'https://api.moonshot.cn/v1/chat/completions',
        models: ['kimi-k2.5', 'moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
        defaultModel: 'kimi-k2.5',
        desc: '国内访问快',
        notes: 'kimi-k2.5要求temperature必须为1.0'
    },
    doubao: {
        name: '豆包 (字节)',
        url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        models: ['doubao-pro-128k', 'doubao-lite-128k', 'doubao-vision'],
        defaultModel: 'doubao-pro-128k',
        desc: '性价比高'
    },
    qwen: {
        name: '通义千问 (阿里)',
        url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
        defaultModel: 'qwen-turbo',
        desc: '中文优秀'
    },
    claude: {
        name: 'Claude (Anthropic)',
        url: 'https://api.anthropic.com/v1/messages',
        models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
        defaultModel: 'claude-3-sonnet',
        desc: '逻辑清晰'
    },
    deepseek: {
        name: 'DeepSeek',
        url: 'https://api.deepseek.com/v1/chat/completions',
        models: ['deepseek-chat', 'deepseek-coder'],
        defaultModel: 'deepseek-chat',
        desc: '代码能力强'
    },
    custom: {
        name: '自定义 API',
        url: '',
        models: [],
        defaultModel: '',
        desc: '手动输入'
    }
};

// ==================== 页面导航 ====================
function goToConfig() {
    window.location.href = 'config.html';
}

function goToSetup() {
    window.location.href = 'setup.html';
}

function goToChat() {
    const config = getApiConfig();
    if (!config || !config.apiKey) {
        showToast('请先配置API！', 'error');
        setTimeout(() => goToConfig(), 1500);
        return;
    }
    window.location.href = 'chat.html';
}

function goBack() {
    window.location.href = 'index.html';
}

function goToContact() {
    window.location.href = 'contact.html';
}

// ==================== 首页初始化 ====================
function initHomePage() {
    updateStats();
    checkApiStatus();
}

function updateStats() {
    const history = getChatHistory();
    const stats = getStats();
    
    document.getElementById('chatCount').textContent = stats.chatCount || 0;
    document.getElementById('msgCount').textContent = history.length || 0;
    
    const config = getApiConfig();
    const statusEl = document.getElementById('apiStatus');
    if (config && config.apiKey) {
        statusEl.textContent = '已连接';
        statusEl.style.color = 'var(--success)';
    } else {
        statusEl.textContent = '未连接';
        statusEl.style.color = 'var(--error)';
    }
}

function checkApiStatus() {
    const config = getApiConfig();
    const indicator = document.getElementById('statusIndicator');
    if (indicator) {
        if (config && config.apiKey) {
            indicator.querySelector('.status-dot').classList.add('connected');
            indicator.querySelector('.status-text').textContent = 'API已就绪';
        }
    }
}

function getStats() {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    return data ? JSON.parse(data) : { chatCount: 0 };
}

function saveStats(stats) {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

// ==================== API配置 ====================
function getApiConfig() {
    const data = localStorage.getItem(STORAGE_KEYS.API_CONFIG);
    return data ? JSON.parse(data) : null;
}

function saveApiConfig(config) {
    localStorage.setItem(STORAGE_KEYS.API_CONFIG, JSON.stringify(config));
}

function initConfigPage() {
    renderModelGrid();
    loadConfigToForm();
}

function renderModelGrid() {
    const grid = document.getElementById('modelGrid');
    if (!grid) return;
    
    grid.innerHTML = Object.entries(AI_MODELS).map(([key, model]) => `
        <div class="model-option" data-provider="${key}" onclick="selectProvider('${key}')">
            <div class="model-name">${model.name}</div>
            <div class="model-desc">${model.desc}</div>
        </div>
    `).join('');
}

function selectProvider(provider) {
    // 移除所有选中状态
    document.querySelectorAll('.model-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    // 添加选中状态
    const selected = document.querySelector(`[data-provider="${provider}"]`);
    if (selected) {
        selected.classList.add('selected');
    }
    
    // 填充表单
    const model = AI_MODELS[provider];
    if (model && provider !== 'custom') {
        document.getElementById('apiUrl').value = model.url;
        document.getElementById('modelName').value = model.defaultModel;
    }
    
    // 显示模型选择下拉
    renderModelSelect(model.models, model.defaultModel);
    
    // 显示Kimi特殊提示
    const kimiNotice = document.getElementById('kimiNotice');
    if (kimiNotice) {
        kimiNotice.style.display = (provider === 'kimi') ? 'block' : 'none';
    }
}

function renderModelSelect(models, defaultModel) {
    const select = document.getElementById('modelSelect');
    if (!select) return;
    
    if (models && models.length > 0) {
        select.innerHTML = models.map(m => 
            `<option value="${m}" ${m === defaultModel ? 'selected' : ''}>${m}</option>`
        ).join('');
        select.style.display = 'block';
        
        // 监听模型选择变化
        select.onchange = function() {
            const selectedModel = this.value;
            const tempSlider = document.getElementById('temperature');
            const tempValue = document.getElementById('tempValue');
            const kimiNotice = document.getElementById('kimiNotice');
            
            if (selectedModel === 'kimi-k2.5') {
                // 强制设置temperature为1.0
                tempSlider.value = 100;
                tempValue.textContent = '1.0';
                if (kimiNotice) kimiNotice.style.display = 'block';
                showToast('Kimi k2.5 温度已自动调整为 1.0', 'info');
            } else {
                if (kimiNotice) kimiNotice.style.display = 'none';
            }
            
            // 同步更新modelName输入框
            document.getElementById('modelName').value = selectedModel;
        };
    } else {
        select.style.display = 'none';
    }
}

function loadConfigToForm() {
    const config = getApiConfig();
    if (config) {
        document.getElementById('apiUrl').value = config.apiUrl || '';
        document.getElementById('apiKey').value = config.apiKey || '';
        document.getElementById('modelName').value = config.modelName || '';
        
        const tempSlider = document.getElementById('temperature');
        if (tempSlider) {
            // 如果是kimi-k2.5，强制设置temperature
            let tempValue = config.temperature || 0.7;
            if (config.modelName === 'kimi-k2.5') {
                tempValue = 1.0;
            }
            tempSlider.value = Math.round(tempValue * 100);
            document.getElementById('tempValue').textContent = tempValue.toFixed(1);
        }
        
        // 尝试匹配已选中的provider
        let matchedProvider = null;
        Object.entries(AI_MODELS).forEach(([key, model]) => {
            if (config.apiUrl === model.url) {
                matchedProvider = key;
            }
        });
        
        if (matchedProvider) {
            selectProvider(matchedProvider);
            // 如果加载的是kimi且选择了k2.5，显示提示
            if (matchedProvider === 'kimi' && config.modelName === 'kimi-k2.5') {
                const kimiNotice = document.getElementById('kimiNotice');
                if (kimiNotice) kimiNotice.style.display = 'block';
            }
        }
    }
}

function saveConfig() {
    const config = {
        provider: document.querySelector('.model-option.selected')?.dataset.provider || 'custom',
        apiUrl: document.getElementById('apiUrl').value.trim(),
        apiKey: document.getElementById('apiKey').value.trim(),
        modelName: document.getElementById('modelName').value.trim() || document.getElementById('modelSelect')?.value,
        temperature: parseFloat(document.getElementById('temperature').value)
    };
    
    if (!config.apiUrl || !config.apiKey) {
        showToast('请填写完整的API信息！', 'error');
        return;
    }
    
    saveApiConfig(config);
    showToast('配置已保存！', 'success');
    
    setTimeout(() => goBack(), 1000);
}

// ==================== 用户资料 ====================
function getUserProfile() {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : { name: '我', avatar: null, botEmail: 'ai-assistant@ex-ai.local' };
}

function saveUserProfile(profile) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

function initUserProfilePage() {
    const profile = getUserProfile();
    
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('botEmail');
    
    if (nameInput) nameInput.value = profile.name || '我';
    if (emailInput) emailInput.value = profile.botEmail || '';
    
    // 恢复头像
    if (profile.avatar) {
        const preview = document.getElementById('userAvatarPreview');
        if (preview) {
            preview.innerHTML = `<img src="${profile.avatar}" class="photo-preview-img">`;
            preview.classList.add('has-image');
        }
    }
}

function selectUserAvatar() {
    document.getElementById('userAvatarInput')?.click();
}

function handleUserAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('userAvatarPreview');
        if (preview) {
            preview.innerHTML = `<img src="${e.target.result}" class="photo-preview-img">`;
            preview.classList.add('has-image');
        }
        
        // 保存到全局变量
        window.tempUserAvatar = e.target.result;
        showToast('头像已上传', 'success');
    };
    reader.readAsDataURL(file);
}

function saveUserProfileData() {
    const existing = getUserProfile();
    
    const profile = {
        name: document.getElementById('userName')?.value.trim() || '我',
        avatar: window.tempUserAvatar || existing.avatar || null,
        botEmail: document.getElementById('botEmail')?.value.trim() || 'ai-assistant@ex-ai.local'
    };
    
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    showToast('✨ 个人资料已保存！', 'success');
    
    setTimeout(() => goBack(), 1000);
}

// ==================== 人设设定 ====================
function getPersona() {
    const data = localStorage.getItem(STORAGE_KEYS.PERSONA);
    return data ? JSON.parse(data) : null;
}

function savePersonaToStorage(persona) {
    localStorage.setItem(STORAGE_KEYS.PERSONA, JSON.stringify(persona));
}

function initSetupPage() {
    loadPersonaToForm();
}

function loadPersonaToForm() {
    const persona = getPersona();
    if (!persona) {
        // 初始化全局变量
        window.tempPhoto = null;
        window.tempChatLog = null;
        return;
    }
    
    // 安全地设置值
    const exName = document.getElementById('exName');
    const personality = document.getElementById('personality');
    const speakingStyle = document.getElementById('speakingStyle');
    const catchphrase = document.getElementById('catchphrase');
    const memories = document.getElementById('memories');
    const breakup = document.getElementById('breakup');
    
    if (exName) exName.value = persona.name || '';
    if (personality) personality.value = persona.personality || '';
    if (speakingStyle) speakingStyle.value = persona.speakingStyle || '';
    if (catchphrase) catchphrase.value = persona.catchphrase || '';
    if (memories) memories.value = persona.memories || '';
    if (breakup) breakup.value = persona.breakup || '';
    
    // 恢复全局变量
    window.tempPhoto = persona.photo || null;
    window.tempChatLog = persona.chatLog || null;
    
    // 恢复照片显示
    if (persona.photo) {
        const preview = document.getElementById('photoPreview');
        if (preview) {
            preview.innerHTML = `<img src="${persona.photo}" class="photo-preview-img">`;
            preview.classList.add('has-image');
        }
    }
    
    // 恢复聊天记录文件名
    if (persona.chatLog) {
        const chatLogName = document.getElementById('chatLogName');
        if (chatLogName) chatLogName.textContent = '📄 已导入聊天记录';
    }
}

function selectPhoto() {
    document.getElementById('photoInput').click();
}

function handlePhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // 检查文件大小（限制为2MB）
    if (file.size > 2 * 1024 * 1024) {
        showToast('图片太大，请选择小于2MB的图片', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('photoPreview');
        if (preview) {
            preview.innerHTML = `<img src="${e.target.result}" class="photo-preview-img">`;
            preview.classList.add('has-image');
        }
        
        // 保存到全局变量
        window.tempPhoto = e.target.result;
        showToast('✨ 照片已上传', 'success');
    };
    reader.onerror = function() {
        showToast('上传失败，请重试', 'error');
    };
    reader.readAsDataURL(file);
}

function selectChatLog() {
    document.getElementById('chatLogInput').click();
}

function handleChatLog(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    document.getElementById('chatLogName').textContent = '📄 ' + file.name;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        window.tempChatLog = e.target.result;
        analyzeChatStyle(e.target.result);
    };
    reader.readAsText(file);
}

function analyzeChatStyle(content) {
    // 简单分析聊天记录
    const lines = content.split('\n').filter(l => l.trim());
    const messages = [];
    
    // 尝试提取对方的消息
    lines.forEach(line => {
        // 匹配常见的聊天记录格式
        const match = line.match(/[:：]\s*(.+)$/);
        if (match) {
            messages.push(match[1]);
        }
    });
    
    if (messages.length > 0) {
        // 提取口头禅（最常见的词）
        const allText = messages.join(' ');
        const commonWords = ['啊', '呢', '吧', '哦', '嗯', '哈', '呀'];
        const found = commonWords.filter(w => allText.includes(w));
        
        if (found.length > 0) {
            document.getElementById('catchphrase').value = '喜欢用：' + found.join('、');
        }
        
        showToast(`分析了${messages.length}条消息`, 'success');
    }
}

function generateSystemPrompt(persona) {
    let prompt = `你是${persona.name || '我的前任'}，我们正在微信聊天。`;
    
    prompt += `\n\n【你的基本信息】`;
    prompt += `\n- 你是对方的${persona.relationship || '前任恋人'}`;
    prompt += `\n- 你们已经分手了，但还保持着联系`;
    
    if (persona.personality) {
        prompt += `\n\n【你的性格】\n${persona.personality}`;
    }
    
    if (persona.speakingStyle) {
        prompt += `\n\n【说话风格】\n${persona.speakingStyle}`;
    }
    
    if (persona.catchphrase) {
        prompt += `\n\n【常用口头禅】\n${persona.catchphrase}`;
    }
    
    if (persona.memories) {
        prompt += `\n\n【你们的共同回忆】\n${persona.memories}`;
    }
    
    if (persona.breakup) {
        prompt += `\n\n【分手后的状态】\n${persona.breakup}`;
    }
    
    prompt += `\n\n【重要提示】`;
    prompt += `\n1. 用第一人称"我"回复，不要出现"作为AI"等表述`;
    prompt += `\n2. 语气要自然、真实，像真人聊天一样`;
    prompt += `\n3. 可以偶尔提起过去的回忆，但不要过于伤感`;
    prompt += `\n4. 回复要简洁，2-3句话为主，不要太长`;
    prompt += `\n5. 适当使用emoji，但不要太多`;
    prompt += `\n6. 表现出对对方的关心，但保持适当的距离`;
    prompt += `\n7. 如果对方提到新恋情，表现出祝福但略带酸意`;
    prompt += `\n8. 保持人设一致性，每次回复都要符合你的性格`;
    
    return prompt;
}

function savePersonaData() {
    // 获取现有数据，保留照片
    const existing = getPersona() || {};
    
    const persona = {
        name: document.getElementById('exName')?.value.trim() || '前任',
        photo: window.tempPhoto || existing.photo || null,
        chatLog: window.tempChatLog || existing.chatLog || null,
        personality: document.getElementById('personality')?.value.trim() || '',
        speakingStyle: document.getElementById('speakingStyle')?.value.trim() || '',
        catchphrase: document.getElementById('catchphrase')?.value.trim() || '',
        memories: document.getElementById('memories')?.value.trim() || '',
        breakup: document.getElementById('breakup')?.value.trim() || '',
        systemPrompt: ''
    };
    
    // 生成系统提示词
    persona.systemPrompt = generateSystemPrompt(persona);
    
    // 保存到localStorage（注意：这里调用的是storage工具函数，不是递归）
    localStorage.setItem(STORAGE_KEYS.PERSONA, JSON.stringify(persona));
    
    // 显示预览
    const previewSection = document.getElementById('promptPreview');
    const promptBox = document.getElementById('generatedPrompt');
    if (previewSection && promptBox) {
        previewSection.style.display = 'block';
        promptBox.textContent = persona.systemPrompt;
        // 添加动画效果
        previewSection.style.animation = 'fadeInUp 0.5s ease';
    }
    
    showToast('✨ 人设已保存！', 'success');
    
    // 3秒后自动返回首页
    setTimeout(() => {
        if (confirm('人设保存成功！是否返回首页？')) {
            goBack();
        }
    }, 500);
}

// 为了向后兼容，保留旧的函数名作为别名
const savePersona = savePersonaData;

// ==================== 聊天功能 ====================
let chatHistory = [];
let isGenerating = false;

function getChatHistory() {
    const data = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return data ? JSON.parse(data) : [];
}

function saveChatHistory(history) {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
}

function initChat() {
    const persona = getPersona();
    const config = getApiConfig();
    
    // 更新聊天界面
    if (persona) {
        document.getElementById('chatTitle').textContent = persona.name || '前任';
        
        const avatarEl = document.getElementById('chatAvatar');
        if (persona.photo) {
            avatarEl.innerHTML = `<img src="${persona.photo}" alt="${persona.name}">`;
        } else {
            avatarEl.textContent = '💔';
        }
    }
    
    // 加载历史消息
    chatHistory = getChatHistory();
    renderChatHistory();
    
    // 更新统计
    const stats = getStats();
    stats.chatCount = (stats.chatCount || 0) + 1;
    saveStats(stats);
}

function renderChatHistory() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    
    container.innerHTML = '<div class="system-message"><span>开始和TA的对话吧</span></div>';
    
    chatHistory.forEach(msg => {
        appendMessage(msg.role, msg.content, msg.time, false);
    });
    
    scrollToBottom();
}

function appendMessage(role, content, time, animate = true) {
    const container = document.getElementById('chatMessages');
    const persona = getPersona();
    const userProfile = getUserProfile();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    if (animate) {
        messageDiv.style.animation = 'fadeInUp 0.3s ease';
    }
    
    let avatar;
    if (role === 'user') {
        avatar = userProfile?.avatar 
            ? `<img src="${userProfile.avatar}">` 
            : '😊';
    } else {
        avatar = persona?.photo 
            ? `<img src="${persona.photo}">` 
            : '💔';
    }
    
    const timeStr = time || new Date().toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-bubble">${escapeHtml(content)}</div>
            <div class="message-time">${timeStr}</div>
        </div>
    `;
    
    container.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const existing = document.getElementById('typingIndicator');
    if (existing) return;
    
    const persona = getPersona();
    const avatar = persona?.photo 
        ? `<img src="${persona.photo}">` 
        : '💔';
    
    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'message ex';
    indicator.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    container.appendChild(indicator);
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function scrollToBottom() {
    const container = document.getElementById('chatMessages');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || isGenerating) return;
    
    const config = getApiConfig();
    const persona = getPersona();
    
    if (!config || !config.apiKey) {
        showToast('请先配置API！', 'error');
        return;
    }
    
    // 添加用户消息
    const userMsg = {
        role: 'user',
        content: message,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    chatHistory.push(userMsg);
    appendMessage('user', message);
    saveChatHistory(chatHistory);
    
    input.value = '';
    input.style.height = 'auto';
    
    // 显示正在输入
    isGenerating = true;
    showTypingIndicator();
    
    try {
        // 准备消息
        const messages = [];
        
        // 系统提示词
        if (persona && persona.systemPrompt) {
            messages.push({ role: 'system', content: persona.systemPrompt });
        }
        
        // 历史对话（保留最近10轮）
        const recentHistory = chatHistory.slice(-20);
        recentHistory.forEach(msg => {
            messages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            });
        });
        
        // 调用API
        const response = await callAIAPI(config, messages);
        
        hideTypingIndicator();
        
        if (response) {
            const aiMsg = {
                role: 'ex',
                content: response,
                time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
            };
            chatHistory.push(aiMsg);
            appendMessage('ex', response);
            saveChatHistory(chatHistory);
        }
    } catch (error) {
        hideTypingIndicator();
        showToast('发送失败：' + error.message, 'error');
    } finally {
        isGenerating = false;
    }
}

async function callAIAPI(config, messages) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
    };
    
    // 处理temperature - kimi-k2.5 必须严格为1.0
    let temperature = config.temperature;
    if (config.modelName === 'kimi-k2.5') {
        temperature = 1.0;
        console.log('[Kimi k2.5] 温度参数已强制设置为 1.0');
    }
    
    // Claude API需要特殊处理
    if (config.provider === 'claude') {
        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                ...headers,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: config.modelName,
                messages: messages,
                max_tokens: 1000
            })
        });
        
        if (!response.ok) {
            throw new Error(`API错误: ${await response.text()}`);
        }
        
        const data = await response.json();
        return data.content[0].text;
    }
    
    // 标准OpenAI格式
    const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            model: config.modelName,
            messages: messages,
            temperature: temperature,
            max_tokens: 1000
        })
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API错误: ${error}`);
    }
    
    const data = await response.json();
    
    // 处理不同API的响应格式
    if (data.choices && data.choices[0]) {
        return data.choices[0].message.content;
    } else if (data.output && data.output.choices) {
        return data.output.choices[0].message.content;
    }
    
    throw new Error('无法解析API响应');
}

function quickReply(text) {
    const input = document.getElementById('messageInput');
    input.value = text;
    input.focus();
}

function clearChat() {
    if (confirm('确定要清空聊天记录吗？')) {
        chatHistory = [];
        saveChatHistory([]);
        renderChatHistory();
        showToast('聊天记录已清空', 'success');
    }
}

// ==================== 工具函数 ====================
function showToast(message, type = 'info') {
    // 移除已有的toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    // 根据页面执行不同初始化
    const page = document.body.dataset.page;
    
    switch(page) {
        case 'home':
            initHomePage();
            break;
        case 'config':
            initConfigPage();
            break;
        case 'setup':
            initSetupPage();
            break;
        case 'chat':
            initChat();
            break;
        case 'profile':
            initUserProfilePage();
            break;
    }
});
