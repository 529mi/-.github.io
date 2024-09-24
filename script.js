document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chatHistory');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const clearButton = document.getElementById('clearButton');

    // 预设的问答对
    const qaPairs = {
        "你好": "喵~ 你好呀！我正在舔爪子，要不要一起玩？",
        "你是谁": "我是一只超级可爱的小猫咪，喜欢追逐毛线球和晒太阳喵~",
        "今天天气怎么样": "喵呜~ 今天阳光真好，我刚刚在窗台上打了个滚儿呢！要不要一起晒太阳？",
        "你能做什么": "我会卖萌、撒娇、装可爱，还会把你的东西推到地上喵！想看我表演吗？",
        "你喜欢吃什么": "喵喵喵！我最喜欢吃小鱼干和猫罐头啦！你有好吃的吗？",
        "你会抓老鼠吗": "抓老鼠？那太没意思了喵~ 我更喜欢抓你的鞋带和袜子！",
        "你喜欢睡觉吗": "喵~ 睡觉是我的专长哦！我可以一天睡18个小时，你想和我一起午睡吗？",
        "你有什么爱好": "我喜欢追逐激光点、钻纸箱、挠沙发，还有躺在你的键盘上看你着急喵~",
        "你最喜欢什么玩具": "喵呜~我最喜欢会动的小老鼠玩具啦！不过你的手指也很好玩哦~",
        "你怕水吗": "水？那是什么可怕的东西！除非你给我买个小黄鸭，我可以考虑碰一下下喵~",
        "你会唱歌吗": "喵喵喵~喵喵喵~这是我最新创作的歌曲，好听吗？",
        "你多大了": "我今年3岁啦！按人类年龄算，我可是个成熟的小猫咪了呢，喵~",
        "你喜欢被摸肚子吗": "这个嘛...要看心情的喵！小心我突然抓住你的手哦~",
        "你会使用猫砂盆吗": "当然啦！我可是个有教养的小猫咪。不过有时候我也会假装不会，就为了看你着急，嘿嘿~"
    };

    // 加载保存的对话历史
    loadChatHistory();

    sendButton.addEventListener('click', sendMessage);
    clearButton.addEventListener('click', clearChat);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat('user', message);
            userInput.value = '';
            
            // 模拟AI响应
            setTimeout(() => {
                const aiResponse = getAIResponse(message);
                addMessageToChat('ai', aiResponse);
            }, 1000);
        }
    }

    function getAIResponse(message) {
        // 检查是否匹配预设问答
        const lowercaseMessage = message.toLowerCase();
        for (const [question, answer] of Object.entries(qaPairs)) {
            if (lowercaseMessage.includes(question.toLowerCase())) {
                return answer;
            }
        }
        // 如果没有匹配，返回随机的调皮回复
        const defaultResponses = [
            "喵？你说什么？我刚刚在追自己的尾巴，没听清楚呢~",
            "喵喵喵！这个问题太难了，我得去吃点小鱼干补补脑子~",
            "你的问题真有趣！不过我现在想玩毛线球，待会再聊好吗？",
            "喵呜~ 我听不懂，但我可以对你卖个萌！（龇牙咧嘴）",
            "这个嘛...不如我们来玩捉迷藏吧！我先躲起来，你来找我喵~",
            "你说的话太复杂啦！能不能用逗猫棒解释给我听？",
            "哎呀，我突然想去挠挠猫抓板，等我回来再回答你哦~",
            "喵喵？你的问题让我有点困惑，不如我们来玩丢纸团游戏吧！",
            "我觉得这个问题需要深思熟虑...让我先睡个午觉再回答你吧~",
            "你说的每个字我都懂，但是连在一起我就不明白了，喵~"
        ];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        messageElement.textContent = message;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // 保存对话历史到本地存储
        saveChatHistory();
    }

    function clearChat() {
        chatHistory.innerHTML = '';
        localStorage.removeItem('chatHistory');
    }

    function saveChatHistory() {
        const messages = Array.from(chatHistory.children).map(msg => ({
            sender: msg.classList.contains('user') ? 'user' : 'ai',
            content: msg.textContent
        }));
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }

    function loadChatHistory() {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            const messages = JSON.parse(savedHistory);
            messages.forEach(msg => addMessageToChat(msg.sender, msg.content));
        }
    }

    // 照片轮播相关代码保持不变
    // ...

    console.log('JavaScript loaded successfully');
});