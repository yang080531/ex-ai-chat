/**
 * 前任AI - 主要逻辑
 * 支持API配置、角色设定、聊天对话
 */

// 配置存储键
const STORAGE_KEYS = {
    API_CONFIG: 'ex_ai_api_config',
    PERSONA: 'ex_ai_persona',
    CHAT_HISTORY: 'ex_ai_chat_history',
    SETTINGS: 'ex_ai_settings'
};

// 默认API配置
const DEFAULT_APIS = {
    openai: {
        url: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo'
    },
    kimi: {
        url: 'https://api.moonshot.cn/v1/chat/completions',
        model: 'moonshot-v1-8k'
    },
    doubao: {
        url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        model: 'doubao-pro-128k'
    },
    qwen: {
        url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        model: 'qwen-turbo'
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
    // 检查是否配置了API
    const config = getApiConfig();
    if (!config || !config.apiKey) {
        alert('请先配置API！');
        goToConfig();
        return;
    }
    window.location.href = 'chat.html';
}

function goBack() {
    window.location.href = 'index.html';
}

// ==================== API配置 ====================
function getApiConfig() {
    const data = localStorage.getItem(STORAGE_KEYS.API_CONFIG);
    return data ? JSON.parse(data) : null;
}

function saveApiConfig(config) {
    localStorage.setItem(STORAGE_KEYS.API_CONFIG, JSON.stringify(config));
}

function loadConfigToForm() {
    const config = getApiConfig();
    if (config) {
        document.getElementById('apiUrl').value = config.apiUrl || '';
        document.getElementById('apiKey').value = config.apiKey || '';
        document.getElementById('modelName').value = config.modelName || '';
        document.getElementById('temperature').value = config.temperature || 0.7;
        document.getElementById('tempValue').textContent = config.temperature || 0.7;
    }
}

function saveConfig() {
    const config = {
        apiUrl: document.getElementById('apiUrl').value.trim(),
        apiKey: document.getElementById('apiKey').value.trim(),
        modelName: document.getElementById('modelName').value.trim(),
        temperature: parseFloat(document.getElementById('temperature').value)
    };
    
    if (!config.apiUrl || !config.apiKey) {
        alert('请填写完整的API信息！');
        return;
    }
    
    saveApiConfig(config);
    alert('配置已保存！');
    goBack();
}

function setPreset(preset) {
    const presetConfig = DEFAULT_APIS[preset];
    if (presetConfig) {
        document.getElementById('apiUrl').value = presetConfig.url;
        document.getElementById('modelName').value = presetConfig.model;
    }
}

function checkConfigStatus() {
    const config = getApiConfig();
    const statusDot = document.getElementById('apiStatus');
    const statusText = document.getElementById('statusText');
    
    if (config && config.apiKey) {
        statusDot.classList.remove('red');
        statusDot.classList.add('green');
        statusText.textContent = 'API已配置';
    } else {
        statusDot.classList.remove('green');
        statusDot.classList.add('red');
        statusText.textContent = '未配置API';
    }
}

// ==================== 角色设定 ====================
function getPersona() {
    const data = localStorage.getItem(STORAGE_KEYS.PERSONA);
    return data ? JSON.parse(data) : null;
}

function savePersona(persona) {
    localStorage.setItem(STORAGE_KEYS.PERSONA, JSON.stringify(persona));
}

function loadPersonaToForm() {
    const persona = getPersona();
    if (persona) {
        document.getElementById('exName').value = persona.name || '';
        document.getElementById('personality').value = persona.personality || '';
        document.getElementById('speakingStyle').value = persona.speakingStyle || '';
        document.getElementById('catchphrase').value = persona.catchphrase || '';
        document.getElementById('memories').value = persona.memories || '';
        document.getElementById('breakup').value = persona.breakup || '';
        
        // 恢复照片预览
        if (persona.photo) {
            const preview = document.getElementById('photoPreview');
            preview.innerHTML = `<img src="${persona.photo}" alt="TA的照片">`;
        }
    }
}

function selectPhoto() {
    document.getElementById('photoInput').click();
}

function handlePhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('photoPreview');
            preview.innerHTML = `<img src="${e.target.result}" alt="TA的照片">`;
            // 保存到临时变量
            window.tempPhoto = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function selectChatLog() {
    document.getElementById('chatLogInput').click();
}

function handleChatLog(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('chatLogName').textContent = '📄 ' + file.name;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            // 分析聊天记录，提取说话风格
            window.tempChatLog = e.target.result;
            analyzeChatLog(e.target.result);
        };
        reader.readAsText(file);
    }
}

function analyzeChatLog(content) {
    // 简单分析：提取常用词汇和表达方式
    // 实际应用中可以用更复杂的NLP
    alert('聊天记录已导入，系统将分析TA的说话风格！');
}

function generateSystemPrompt(persona) {
    let prompt = `你是${persona.name || '我的前任'}，我们正在对话。`;
    
    if (persona.personality) {
        prompt += `\n你的性格特点：${persona.personality}`;
    }
    
    if (persona.speakingStyle) {
        prompt += `\n你的说话风格：${persona.speakingStyle}`;
    }
    
    if (persona.catchphrase) {
        prompt += `\n你的口头禅：${persona.catchphrase}`;
    }
    
    if (persona.memories) {
        prompt += `\n我们的共同回忆：${persona.memories}`;
    }
    
    if (persona.breakup) {
        prompt += `\n分手后的状态：${persona.breakup}`;
    }
    
    prompt += `\n\n重要提示：`;
    prompt += `\n1. 请完全代入这个角色，用第一人称回复`;
    prompt += `\n2. 语气要自然、真实，像真人一样有情绪`;
    prompt += `\n3. 可以偶尔提起过去的回忆`;
    prompt += `\n4. 不要显得太AI，要有个人特色`;
    prompt += `\n5. 回复要简洁，不要太长`;
    
    return prompt;
}

function savePersona() {
    const persona = {
        name: document.getElementById('exName').value.trim() || '前任',
        photo: window.tempPhoto || null,
        chatLog: window.tempChatLog || null,
        personality: document.getElementById('personality').value.trim(),
        speakingStyle: document.getElementById('speakingStyle').value.trim(),
        catchphrase: document.getElementById('catchphrase').value.trim(),
        memories: document.getElementById('memories').value.trim(),
        breakup: document.getElementById('breakup').value.trim(),
        systemPrompt: ''
    };
    
    // 生成系统提示词
    persona.systemPrompt = generateSystemPrompt(persona);
    
    savePersona(persona);
    
    // 显示生成的prompt
    const preview = document.getElementById('promptPreview');
    const promptBox = document.getElementById('generatedPrompt');
    preview.style.display = 'block';
    promptBox.textContent = persona.systemPrompt;
    
    alert('人设已保存！');
    
    // 更新聊天页面的头像
    updateChatAvatar(persona);
}

function updateChatAvatar(persona) {
    // 更新聊天页面的头像显示
    const avatarElements = document.querySelectorAll('.chat-avatar, #chatAvatar');
    avatarElements.forEach(el => {
        if (persona.photo) {
            el.innerHTML = `<img src="${persona.photo}" alt="${persona.name}">`;
        } else {
            el.textContent = '💔';
        }
    });
    
    // 更新名字
    const nameElements = document.querySelectorAll('#chatTitle');
    nameElements.forEach(el => {
        el.textContent = persona.name || '前任';
    });
}

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
    
    if (persona) {
        updateChatAvatar(persona);
    }
    
    // 加载历史消息
    chatHistory = getChatHistory();
    renderChatHistory();
}

function renderChatHistory() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '<div class="system-message"><span>开始和TA的对话吧</span></div>';
    
    chatHistory.forEach(msg => {
        appendMessage(msg.role, msg.content, msg.time, false);
    });
    
    scrollToBottom();
}

function appendMessage(role, content, time, animate = true) {
    const container = document.getElementById('chatMessages');
    const persona = getPersona();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    if (animate) {
        messageDiv.style.animation = 'fadeIn 0.3s';
    }
    
    const avatar = role === 'user' ? '😊' : (persona?.photo ? `<img src="${persona.photo}">` : '💔');
    const timeStr = time || new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
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
    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'message ex';
    indicator.innerHTML = `
        <div class="message-avatar">💔</div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="typing-indicator">
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
    if (indicator) {
        indicator.remove();
    }
}

function scrollToBottom() {
    const container = document.getElementById('chatMessages');
    container.scrollTop = container.scrollHeight;
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
        alert('请先配置API！');
        goToConfig();
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
    
    // 显示输入中
    isGenerating = true;
    showTypingIndicator();
    
    try {
        // 准备消息历史
        const messages = [];
        
        // 添加系统提示词
        if (persona && persona.systemPrompt) {
            messages.push({
                role: 'system',
                content: persona.systemPrompt
            });
        }
        
        // 添加历史对话（只保留最近20条）
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
        alert('发送失败：' + error.message);
    } finally {
        isGenerating = false;
    }
}

async function callAIAPI(config, messages) {
    const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: config.modelName,
            messages: messages,
            temperature: config.temperature,
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
    } else if (data.output && data.output.text) {
        // 通义千问格式
        return data.output.text;
    }
    
    throw new Error('无法解析API响应');
}

function quickReply() {
    // 快速回复建议
    const suggestions = [
        '在干嘛呢？',
        '最近好吗？',
        '我想你了',
        '还记得我们以前...',
        '你变了'
    ];
    
    const input = document.getElementById('messageInput');
    const randomMsg = suggestions[Math.floor(Math.random() * suggestions.length)];
    input.value = randomMsg;
    input.focus();
}

function clearChat() {
    if (confirm('确定要清空聊天记录吗？')) {
        chatHistory = [];
        saveChatHistory([]);
        document.getElementById('chatMessages').innerHTML = '<div class="system-message"><span>开始和TA的对话吧</span></div>';
    }
}

// ==================== 工具函数 ====================
function exportChat() {
    const history = getChatHistory();
    let text = '聊天记录导出\n';
    text += '============\n\n';
    
    history.forEach(msg => {
        const role = msg.role === 'user' ? '我' : '前任';
        text += `${role} (${msg.time}):\n${msg.content}\n\n`;
    });
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `聊天记录_${new Date().toLocaleDateString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否在Capacitor环境
    if (window.Capacitor) {
        console.log('Running in Capacitor');
    }
});
