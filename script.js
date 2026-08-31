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
});
