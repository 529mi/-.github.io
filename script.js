document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chatHistory');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const clearButton = document.getElementById('clearButton');

    // HuggingFace API 设置
    const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
    const API_KEY = "YOUR_HUGGINGFACE_API_KEY"; // 替换为您的 API 密钥

    // 轮播功能
    let slideIndex = 1;
    showSlides(slideIndex);

    window.plusSlides = function(n) {
        showSlides(slideIndex += n);
    }

    function showSlides(n) {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        slides[slideIndex-1].style.display = "block";
    }

    // 自动轮播
    setInterval(() => {
        plusSlides(1);
    }, 5000); // 每5秒切换一次图片

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

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat('user', message);
            userInput.value = '';
            
            try {
                const aiResponse = await getAIResponse(message);
                addMessageToChat('ai', `喵~ ${aiResponse}`);
            } catch (error) {
                console.error('Error:', error);
                addMessageToChat('ai', '喵呜~ 我遇到了一些问题，可能是网络不太好。稍后再和你聊天哦！');
            }
        }
    }

    async function getAIResponse(message) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result[0].generated_text;
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

    console.log('JavaScript loaded successfully');
});