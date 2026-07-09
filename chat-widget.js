/* =====================================================================
   ZAP MUDRA — WhatsApp Chat Widget
   ===================================================================== */
(function() {
  const styles = `
    .zm-chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: 'Inter', sans-serif;
    }
    .zm-chat-btn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #a464f4 0%, #4a1c82 100%);
      box-shadow: 0 4px 12px rgba(74,28,130,.4);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .zm-chat-btn:hover {
      transform: scale(1.1);
    }
    .zm-chat-btn svg {
      width: 32px;
      height: 32px;
      fill: #fff;
    }
    .zm-chat-box {
      position: absolute;
      bottom: 80px;
      right: 0;
      width: 320px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      overflow: hidden;
      transform-origin: bottom right;
      transform: scale(0);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      visibility: hidden;
    }
    .zm-chat-box.active {
      transform: scale(1);
      opacity: 1;
      visibility: visible;
    }
    .zm-chat-header {
      background: linear-gradient(135deg, #a464f4 0%, #4a1c82 100%);
      padding: 20px;
      color: #fff;
      position: relative;
    }
    .zm-chat-header h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
    }
    .zm-chat-header p {
      margin: 5px 0 0;
      font-size: 0.85rem;
      opacity: 0.9;
    }
    .zm-chat-close {
      position: absolute;
      top: 15px;
      right: 15px;
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .zm-chat-body {
      padding: 20px;
      background: #f8f9fa;
    }
    .zm-chat-message {
      background: #fff;
      padding: 12px 16px;
      border-radius: 0 12px 12px 12px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      font-size: 0.95rem;
      color: #333;
      margin-bottom: 20px;
      line-height: 1.5;
    }
    .zm-chat-action {
      display: block;
      background: #25D366;
      color: #fff;
      text-align: center;
      padding: 12px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      transition: background 0.2s;
    }
    .zm-chat-action:hover {
      background: #20b858;
    }
    .zm-chat-action svg {
      width: 20px;
      height: 20px;
      vertical-align: middle;
      margin-right: 8px;
      fill: currentColor;
    }
  `;

  const html = `
    <div class="zm-chat-box" id="zmChatBox">
      <div class="zm-chat-header">
        <h3>Hi there! 👋</h3>
        <p>Get your loan approved in just 2 minutes! 🚀</p>
        <button class="zm-chat-close" id="zmChatClose">&times;</button>
      </div>
      <div class="zm-chat-body">
        <div class="zm-chat-message">
          Welcome to ZapMudra! We're here to help you get your finances powered up. Tap the button below to chat with our support team on WhatsApp.
        </div>
        <a href="https://wa.me/919211013612" target="_blank" rel="noopener noreferrer" class="zm-chat-action">
          <svg viewBox="0 0 24 24"><path d="M12.031 21.172l-1.406-1.406a9.96 9.96 0 0 1-5.625-1.547l-3.328 1.078 1.125-3.234a9.96 9.96 0 0 1-1.547-5.625c0-5.531 4.469-10 10-10s10 4.469 10 10-4.469 10-10 10zm0-18c-4.406 0-8 3.594-8 8 0 1.734.547 3.375 1.531 4.734l-1.078 3.141 3.234-1.031a7.97 7.97 0 0 0 4.313 1.156c4.406 0 8-3.594 8-8s-3.594-8-8-8zm4.266 11.203c-.234-.109-1.359-.672-1.563-.75s-.359-.109-.5.109-.594.75-.734.906-.281.172-.516.063a6.45 6.45 0 0 1-1.922-1.188 6.64 6.64 0 0 1-1.328-1.641c-.141-.234-.016-.359.109-.469.109-.094.234-.281.359-.422.109-.141.156-.234.234-.391.078-.156.031-.313-.031-.422s-.5-1.219-.688-1.672c-.172-.438-.359-.375-.5-.391h-.422c-.172 0-.453.063-.688.313s-.906.891-.906 2.172.938 2.516 1.063 2.688 1.828 2.797 4.438 3.891c2.609 1.094 2.609.734 3.094.688.484-.047 1.563-.641 1.781-1.266.219-.625.219-1.156.156-1.266-.062-.109-.234-.172-.469-.281z"/></svg>
          Chat on WhatsApp
        </a>
      </div>
    </div>
    <div class="zm-chat-btn" id="zmChatBtn" title="Chat with us">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
    </div>
  `;

  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.innerHTML = styles;
  document.head.appendChild(styleEl);

  // Inject widget HTML
  const widgetEl = document.createElement('div');
  widgetEl.className = 'zm-chat-widget';
  widgetEl.innerHTML = html;
  document.body.appendChild(widgetEl);

  // Add interactions
  const chatBtn = document.getElementById('zmChatBtn');
  const chatBox = document.getElementById('zmChatBox');
  const chatClose = document.getElementById('zmChatClose');

  chatBtn.addEventListener('click', () => {
    chatBox.classList.toggle('active');
  });

  chatClose.addEventListener('click', () => {
    chatBox.classList.remove('active');
  });

  // Optional: Auto-open after a few seconds
  setTimeout(() => {
    if (!sessionStorage.getItem('zm_chat_shown')) {
      chatBox.classList.add('active');
      sessionStorage.setItem('zm_chat_shown', 'true');
    }
  }, 5000);
})();
