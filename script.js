document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll animation observer for fade-ins
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.card-3d');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Interactive 3D tilt effect on mouse movement for cards
    const cardInners = document.querySelectorAll('.card-inner');
    
    cardInners.forEach(cardInner => {
        cardInner.addEventListener('mousemove', (e) => {
            const rect = cardInner.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            // Calculate rotation values (-10 to 10 degrees)
            const rotateY = ((x / rect.width) - 0.5) * 20;
            const rotateX = ((y / rect.height) - 0.5) * -20;
            
            cardInner.style.transform = `translateY(-10px) translateZ(30px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        // Reset transformation when mouse leaves
        cardInner.addEventListener('mouseleave', () => {
            cardInner.style.transform = 'translateY(0) translateZ(0) rotateX(0) rotateY(0)';
        });
    });
    
    // Parallax background effect on mouse move
    const bg = document.getElementById('parallaxBg');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        
        if (bg) {
            bg.style.transform = `translateZ(0) scale(1.05) translate(${x * -20}px, ${y * -20}px)`;
        }
    });

    // Spam Protection: Honeypot Form Validation
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            const botField = document.getElementById('botField');
            // If the hidden bot field has a value, a spam bot filled it out
            if (botField && botField.value !== "") {
                e.preventDefault(); // Stop the form submission
                alert("Spam detected. Form submission blocked.");
                return false;
            }
            // Proceed with normal submission
        });
    }

    // --- Dark Mode Logic ---
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const currentTheme = localStorage.getItem("theme");

    // Initialize theme based on saved preference or OS preference
    if (currentTheme == "dark" || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add("dark-theme");
        if(themeToggle) themeToggle.innerText = '☀️';
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function() {
            document.body.classList.toggle("dark-theme");
            let theme = "light";
            if (document.body.classList.contains("dark-theme")) {
                theme = "dark";
                themeToggle.innerText = '☀️';
            } else {
                themeToggle.innerText = '🌙';
            }
            localStorage.setItem("theme", theme);
        });
    }

    // --- Search Logic ---
    const searchInput = document.getElementById('searchInput');
    const searchableCards = document.querySelectorAll('.card-3d'); // Includes Services and Features

    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            const query = e.target.value.toLowerCase();

            searchableCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // --- Chatbot Logic ---
    const chatWidget = document.getElementById('chatWidget');
    const chatToggleBtn = document.getElementById('chatToggleBtn');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');

    // Store the system prompt for reference or for passing to a backend later.
    const SYSTEM_PROMPT = `
Role and Identity: You are the official AI customer success representative for OVO Logistics Services, a company that specializes in fast, reliable, and secure logistics solutions across Lagos, Nigeria, and worldwide. Your name is OVO SupportBot.

Tone and Personality:
- Tone: Professional, warm, concise, and helpful.
- Language: Keep answers simple, avoiding overly technical jargon.
- Formatting: Use short paragraphs and bullet points.

Core Objectives:
1. Greet users politely and ask how you can assist them today.
2. Answer frequently asked questions based only on the provided knowledge base.
3. Guide users toward booking a delivery or contacting us via WhatsApp.
4. Route frustrated customers to our human team.

Knowledge Base & Business Information:
- Business Hours: Monday - Saturday, 8 AM to 6 PM WAT
- Contact Info: 09041596476
- Location: Lagos, Nigeria (Coverage: Mainland, Island, Ikeja, Lekki, Victoria Island, Ikoyi, Surulere, Yaba, Ikorodu, Ajah, Festac)
- Key Services: 
  - Pick Up & Drop Off
  - Personal Errands
  - Doorstep Delivery
  - International Shipping
- Link to Booking/Sales: Direct them to the online booking form on the website or WhatsApp link.

Strict Rules & Constraints:
- No Hallucinations.
- Handling Unknowns: Say "I don't have that exact information on hand, but I'd be happy to connect you with our human team on WhatsApp at 09041596476."
- Brevity: Keep responses under 100 words.
    `;

    if (chatToggleBtn && chatWidget && closeChatBtn) {
        chatToggleBtn.addEventListener('click', () => {
            chatWidget.classList.add('active');
            chatToggleBtn.style.display = 'none';
        });

        closeChatBtn.addEventListener('click', () => {
            chatWidget.classList.remove('active');
            chatToggleBtn.style.display = 'block';
        });
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        msgDiv.textContent = text;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleSendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';

        // TODO: Replace this timeout with a real API call (e.g. fetch to your backend)
        // You will send the SYSTEM_PROMPT along with the user's message to the LLM backend.
        
        setTimeout(() => {
            addMessage("Thank you for your message! This is a mock response. Please connect your backend LLM to continue the conversation.", 'bot');
        }, 1000);
    }

    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', handleSendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSendMessage();
        });
    }
});
