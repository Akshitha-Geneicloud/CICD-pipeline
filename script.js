const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage = ""; // To store user input

// Function to create chat <li> element
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);

    let chatContent = className === "outgoing"
        ? `<p></p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;

    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

// Static bot replies
const botReplies = {
    "hi": "who are you?",
    "who are you": "Im a friendly chatbot.",
    "Thank you":"You're welcome!",
    "thanks": "No problem!",
    "help": "How can I assist you today?",
    "what can you do": "I can answer questions, provide information, and chat with you!",
    "default": "Sorry, I didn't understand that. Can you please rephrase or ask something else?",
    
    "hello": "Hi, how can I assist you?",
    "how are you": "I'm just code, but thanks for asking!",
    "what is your name": "I'm a simple chatbot built with JavaScript!",
    "bye": "Goodbye! Have a great day!",
    "default": "I'm not sure how to respond to that yet."
};

// Bot response function
const generateResponse = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");
    const reply = botReplies[userMessage.toLowerCase()] || botReplies["default"];
    
    setTimeout(() => {
        messageElement.textContent = reply;
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);
};

// Handle chat submit
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Display user message
    const outgoingChatLi = createChatLi(userMessage, "outgoing");
    chatbox.appendChild(outgoingChatLi);

    // Display loading bot message
    setTimeout(() => {
        const incomingChatLi = createChatLi("Typing...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        generateResponse(incomingChatLi);
    }, 500);

    chatInput.value = "";
};

// Event listeners
sendChatBtn.addEventListener("click", handleChat);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
