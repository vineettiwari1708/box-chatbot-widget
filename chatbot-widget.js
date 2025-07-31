(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const s = document.getElementById("livechat-widget-script");
    const position = s.getAttribute("data-position") || "right";
    const whatsappNumber = s.getAttribute("data-whatsapp") || "";

    const flow = [
      {
        question: "👋 Hi! What are you looking for?",
        type: "options",
        options: ["Website", "Mobile App", "SEO", "Other"]
      },
      {
        question: "💡 What’s your project budget?",
        type: "options",
        options: ["< $500", "$500 - $1000", "$1000+"]
      },
      {
        question: "📝 Please describe your project briefly.",
        type: "text"
      },
      {
        question: "📛 Your Name:",
        type: "text"
      },
      {
        question: "📞 Phone Number:",
        type: "text"
      }
    ];

    const responses = [];
    let currentStep = 0;

    const chatBox = document.createElement("div");
    chatBox.style.cssText = `
      position: fixed;
      bottom: 90px;
      ${position}: 20px;
      width: 320px;
      height: 400px;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      font-family: 'Segoe UI', sans-serif;
      z-index: 99999;
    `;

    chatBox.innerHTML = `
      <div style="padding: 10px 16px; background: #007bff; color: white; font-weight: bold;">
        💬 Chat with Us
        <span id="chat-close" style="float:right; cursor:pointer;">×</span>
      </div>
      <div id="chat-body" style="flex:1; padding:10px; overflow-y:auto; font-size:14px;"></div>
      <div id="chat-input-area" style="padding:10px; border-top:1px solid #eee;"></div>
    `;

    document.body.appendChild(chatBox);

    const toggleBtn = document.createElement("button");
    toggleBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      ${position}: 20px;
      width: 48px;
      height: 48px;
      background: #25D366;
      border-radius: 24px;
      border: none;
      cursor: pointer;
      font-size: 20px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100000;
    `;
    toggleBtn.innerHTML = `💬`;
    document.body.appendChild(toggleBtn);

    toggleBtn.onclick = () => {
      chatBox.style.display = "flex";
      toggleBtn.style.display = "none";
      runStep();
    };

    document.getElementById("chat-close").onclick = () => {
      chatBox.style.display = "none";
      toggleBtn.style.display = "flex";
    };

    const chatBody = chatBox.querySelector("#chat-body");
    const inputArea = chatBox.querySelector("#chat-input-area");

    function appendMessage(text, sender = "bot") {
      const msg = document.createElement("div");
      msg.style.margin = "8px 0";
      msg.innerHTML = sender === "bot"
        ? `<div style="background:#f1f1f1; padding:8px 12px; border-radius:10px; max-width:80%;">${text}</div>`
        : `<div style="text-align:right;"><div style="background:#DCF8C6; padding:8px 12px; border-radius:10px; display:inline-block; max-width:80%;">${text}</div></div>`;
      chatBody.appendChild(msg);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function runStep() {
      if (currentStep >= flow.length) {
        finishChat();
        return;
      }

      const step = flow[currentStep];
      appendMessage(step.question);

      inputArea.innerHTML = "";

      if (step.type === "options") {
        step.options.forEach(opt => {
          const btn = document.createElement("button");
          btn.textContent = opt;
          btn.style.cssText = `
            margin: 5px 5px 0 0;
            padding: 6px 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          `;
          btn.onclick = () => {
            appendMessage(opt, "user");
            responses.push({ question: step.question, answer: opt });
            currentStep++;
            runStep();
          };
          inputArea.appendChild(btn);
        });
      } else if (step.type === "text") {
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Type your answer...";
        input.style.cssText = `
          width: 100%;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #ccc;
          margin-bottom: 5px;
        `;
        inputArea.appendChild(input);
        input.focus();

        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && input.value.trim()) {
            const val = input.value.trim();
            appendMessage(val, "user");
            responses.push({ question: step.question, answer: val });
            currentStep++;
            runStep();
          }
        });
      }
    }

    function finishChat() {
      appendMessage("✅ Thank you! We'll contact you soon.");
      inputArea.innerHTML = "";

      const name = responses.find(r => r.question.includes("Name"))?.answer || "";
      const phone = responses.find(r => r.question.includes("Phone"))?.answer || "";

      if (!phone || !whatsappNumber) return;

      let message = `New Inquiry:\n`;
      responses.forEach(r => {
        message += `• ${r.question.replace(/[^a-zA-Z0-9 ]/g, "")}: ${r.answer}\n`;
      });

      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      setTimeout(() => {
        window.open(whatsappURL, "_blank");
      }, 1500);
    }
  });
})();
