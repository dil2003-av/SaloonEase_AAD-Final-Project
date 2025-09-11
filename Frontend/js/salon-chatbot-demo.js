/**
 * SaloonEase AI Chatbot Widget - Demo Version
 * A floating chatbot widget for salon services assistance with demo responses
 */

class SaloonEaseChatbotDemo {
  constructor(options = {}) {
    this.options = {
      apiUrl: options.apiUrl || 'http://localhost:8080/api/chat',
      position: options.position || 'bottom-right',
      theme: options.theme || 'salon',
      autoOpen: options.autoOpen || false,
      showWelcome: options.showWelcome !== false,
      demoMode: options.demoMode || false,
      ...options
    };
    
    this.isOpen = false;
    this.isTyping = false;
    this.messageHistory = [];
    
    // Demo responses for when backend is not available
    this.demoResponses = {
      'hello': 'Hello! Welcome to SaloonEase. I\'m here to help you with our salon services. How can I assist you today?',
      'services': 'We offer a wide range of salon services including haircuts, hair coloring, styling, facials, manicures, pedicures, and spa treatments. Would you like more details about any specific service?',
      'appointment': 'To book an appointment, you can use our online booking system by clicking on the "Appointments" tab in the navigation menu. You can also call us directly. What service are you interested in?',
      'hours': 'Our salon is open Monday to Saturday from 9:00 AM to 7:00 PM, and Sunday from 10:00 AM to 6:00 PM. We also offer special evening appointments upon request.',
      'price': 'Our prices vary depending on the service. Haircuts start from $25, hair coloring from $45, facials from $35, and manicures from $20. Would you like a detailed price list?',
      'location': 'We\'re conveniently located in the heart of the city. You can find our exact address and directions in the Contact Us section of our website.',
      'staff': 'Our team consists of highly trained and experienced stylists and beauty professionals. Each of our staff members is certified and passionate about making you look and feel your best.',
      'products': 'We use only premium, salon-grade products from top brands. We also retail some of our professional products so you can maintain your look at home.',
      'default': 'Thank you for your question! While I\'m running in demo mode right now, our full AI assistant can help with detailed information about salon services, booking assistance, beauty tips, and more. Please make sure Ollama is running for the complete experience.'
    };
    
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.attachEventListeners();
    this.injectStyles();
    
    if (this.options.showWelcome) {
      setTimeout(() => this.showWelcomeMessage(), 1000);
    }
    
    console.log('SaloonEase Chatbot Demo initialized');
  }

  createChatbotHTML() {
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'saloonease-chatbot-widget';
    chatbotContainer.innerHTML = `
      <!-- Chatbot Toggle Button -->
      <div class="chatbot-toggle" id="chatbot-toggle">
        <div class="chatbot-icon">
          <i class="fas fa-comment-dots"></i>
        </div>
        <div class="chatbot-close-icon" style="display: none;">
          <i class="fas fa-times"></i>
        </div>
      </div>

      <!-- Chat Window -->
      <div class="chatbot-window" id="chatbot-window" style="display: none;">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-header-content">
            <div class="chatbot-avatar">
              <i class="fas fa-cut"></i>
            </div>
            <div class="chatbot-info">
              <div class="chatbot-name">SaloonEase Assistant</div>
              <div class="chatbot-status">Demo Mode</div>
            </div>
          </div>
          <button class="chatbot-minimize" id="chatbot-minimize">
            <i class="fas fa-minus"></i>
          </button>
        </div>

        <!-- Messages Container -->
        <div class="chatbot-messages" id="chatbot-messages">
          <!-- Messages will appear here -->
        </div>

        <!-- Typing Indicator -->
        <div class="typing-indicator" id="typing-indicator" style="display: none;">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="typing-text">Assistant is typing...</span>
        </div>

        <!-- Input Area -->
        <div class="chatbot-input-area">
          <div class="input-container">
            <input type="text" 
                   id="chatbot-input" 
                   placeholder="Ask about our salon services..." 
                   maxlength="500"
                   autocomplete="off">
            <button id="chatbot-send" disabled>
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(chatbotContainer);
  }

  attachEventListeners() {
    const toggle = document.getElementById('chatbot-toggle');
    const minimize = document.getElementById('chatbot-minimize');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');

    // Toggle chat window
    toggle.addEventListener('click', () => this.toggleChat());
    minimize.addEventListener('click', () => this.closeChat());

    // Input handling
    input.addEventListener('input', (e) => {
      const hasText = e.target.value.trim().length > 0;
      sendBtn.disabled = !hasText;
      sendBtn.style.opacity = hasText ? '1' : '0.5';
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    sendBtn.addEventListener('click', () => this.sendMessage());
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    const window = document.getElementById('chatbot-window');
    const icon = document.querySelector('.chatbot-icon');
    const closeIcon = document.querySelector('.chatbot-close-icon');
    
    window.style.display = 'flex';
    icon.style.display = 'none';
    closeIcon.style.display = 'flex';
    
    this.isOpen = true;
    
    // Focus on input
    setTimeout(() => {
      document.getElementById('chatbot-input').focus();
    }, 300);
  }

  closeChat() {
    const window = document.getElementById('chatbot-window');
    const icon = document.querySelector('.chatbot-icon');
    const closeIcon = document.querySelector('.chatbot-close-icon');
    
    window.style.display = 'none';
    icon.style.display = 'flex';
    closeIcon.style.display = 'none';
    
    this.isOpen = false;
  }

  showWelcomeMessage() {
    const welcomeMessage = "Hi! I'm your SaloonEase assistant. I'm currently running in demo mode. Ask me about our services, appointments, or beauty tips!";
    this.addMessage(welcomeMessage, 'bot');
  }

  async sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;

    // Add user message
    this.addMessage(message, 'user');
    input.value = '';
    document.getElementById('chatbot-send').disabled = true;
    document.getElementById('chatbot-send').style.opacity = '0.5';

    // Show typing indicator
    this.showTypingIndicator();

    // Try backend first, then fall back to demo responses
    try {
      const response = await fetch(this.options.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message })
      });

      if (response.ok) {
        const data = await response.json();
        this.hideTypingIndicator();
        const botReply = data.reply || "I'm sorry, I didn't understand that. Could you please rephrase your question?";
        this.addMessage(botReply, 'bot');
        return;
      }
    } catch (error) {
      console.log('Backend not available, using demo mode');
    }

    // Use demo responses
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.getDemoResponse(message.toLowerCase());
      this.addMessage(response, 'bot');
    }, 1500);
  }

  getDemoResponse(message) {
    // Simple keyword matching for demo responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return this.demoResponses.hello;
    } else if (message.includes('service') || message.includes('what do you offer')) {
      return this.demoResponses.services;
    } else if (message.includes('appointment') || message.includes('book') || message.includes('schedule')) {
      return this.demoResponses.appointment;
    } else if (message.includes('hour') || message.includes('time') || message.includes('open')) {
      return this.demoResponses.hours;
    } else if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
      return this.demoResponses.price;
    } else if (message.includes('location') || message.includes('address') || message.includes('where')) {
      return this.demoResponses.location;
    } else if (message.includes('staff') || message.includes('team') || message.includes('stylist')) {
      return this.demoResponses.staff;
    } else if (message.includes('product') || message.includes('brand')) {
      return this.demoResponses.products;
    } else {
      return this.demoResponses.default;
    }
  }

  addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (sender === 'bot') {
      messageDiv.innerHTML = `
        <div class="message-avatar">
          <i class="fas fa-cut"></i>
        </div>
        <div class="message-content">
          <div class="message-text">${this.formatMessage(text)}</div>
          <div class="message-time">${this.getCurrentTime()}</div>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="message-content">
          <div class="message-text">${this.formatMessage(text)}</div>
          <div class="message-time">${this.getCurrentTime()}</div>
        </div>
      `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store message in history
    this.messageHistory.push({ text, sender, timestamp: new Date() });
  }

  formatMessage(text) {
    // Basic text formatting
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  showTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    indicator.style.display = 'flex';
    
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    indicator.style.display = 'none';
  }

  injectStyles() {
    if (document.getElementById('saloonease-chatbot-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'saloonease-chatbot-styles';
    styles.textContent = `
      #saloonease-chatbot-widget {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 10000;
      }

      .chatbot-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #ff6b9d, #ff8e92);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: bounce 2s infinite;
      }

      .chatbot-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 25px rgba(255, 107, 157, 0.4);
      }

      .chatbot-toggle .fas {
        color: white;
        font-size: 24px;
      }

      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-5px); }
        60% { transform: translateY(-3px); }
      }

      .chatbot-window {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .chatbot-header {
        background: linear-gradient(135deg, #ff6b9d, #ff8e92);
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .chatbot-header-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .chatbot-avatar {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .chatbot-avatar .fas {
        font-size: 16px;
      }

      .chatbot-name {
        font-weight: 600;
        font-size: 16px;
      }

      .chatbot-status {
        font-size: 12px;
        opacity: 0.9;
      }

      .chatbot-minimize {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: background 0.2s;
      }

      .chatbot-minimize:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .chatbot-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .chatbot-messages::-webkit-scrollbar {
        width: 4px;
      }

      .chatbot-messages::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      .chatbot-messages::-webkit-scrollbar-thumb {
        background: #ff6b9d;
        border-radius: 2px;
      }

      .message {
        display: flex;
        gap: 8px;
        animation: messageSlideIn 0.3s ease-out;
      }

      @keyframes messageSlideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .user-message {
        justify-content: flex-end;
      }

      .bot-message {
        justify-content: flex-start;
      }

      .message-avatar {
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, #ff6b9d, #ff8e92);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        flex-shrink: 0;
      }

      .message-content {
        max-width: 80%;
      }

      .message-text {
        padding: 12px 16px;
        border-radius: 18px;
        line-height: 1.4;
        word-wrap: break-word;
      }

      .user-message .message-text {
        background: linear-gradient(135deg, #ff6b9d, #ff8e92);
        color: white;
        border-bottom-right-radius: 6px;
      }

      .bot-message .message-text {
        background: #f5f5f5;
        color: #333;
        border-bottom-left-radius: 6px;
      }

      .message-time {
        font-size: 11px;
        color: #999;
        margin-top: 4px;
        text-align: right;
      }

      .bot-message .message-time {
        text-align: left;
      }

      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 16px 12px;
        color: #666;
      }

      .typing-dots {
        display: flex;
        gap: 4px;
      }

      .typing-dots span {
        width: 6px;
        height: 6px;
        background: #ff6b9d;
        border-radius: 50%;
        animation: typingDots 1.4s infinite ease-in-out;
      }

      .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
      .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

      @keyframes typingDots {
        0%, 80%, 100% {
          transform: scale(0);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }

      .typing-text {
        font-size: 12px;
      }

      .chatbot-input-area {
        padding: 16px;
        border-top: 1px solid #eee;
        background: white;
      }

      .input-container {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      #chatbot-input {
        flex: 1;
        border: 2px solid #eee;
        border-radius: 20px;
        padding: 12px 16px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.3s;
      }

      #chatbot-input:focus {
        border-color: #ff6b9d;
      }

      #chatbot-send {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #ff6b9d, #ff8e92);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        opacity: 0.5;
      }

      #chatbot-send:not(:disabled):hover {
        transform: scale(1.1);
      }

      #chatbot-send:disabled {
        cursor: not-allowed;
      }

      /* Mobile responsiveness */
      @media (max-width: 480px) {
        .chatbot-window {
          right: 10px;
          left: 10px;
          width: auto;
          bottom: 80px;
        }
        
        .chatbot-toggle {
          right: 15px;
          bottom: 15px;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the chatbot with demo mode enabled
  window.saloonChatbot = new SaloonEaseChatbotDemo({
    showWelcome: true,
    autoOpen: false,
    demoMode: true
  });
});
