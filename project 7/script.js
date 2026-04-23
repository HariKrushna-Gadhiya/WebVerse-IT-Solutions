document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header & Active Nav State
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active Nav State based on URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');

    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navbar.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
            // Ensure header is white if menu is open
            header.classList.add('scrolled');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
            if (window.scrollY <= 50) {
                header.classList.remove('scrolled');
            }
        }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // 3. Menu Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            menuCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    // Small animation trick
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 4. Contact Form Submission via Web3Forms & CallMeBot
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
            submitBtn.style.opacity = '0.8';
            submitBtn.disabled = true;

            // Get form values
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const date = document.getElementById('date').value;
            const guests = document.getElementById('guests').value;
            const eventType = document.getElementById('eventType').value;
            const message = document.getElementById('message').value;

            // --- Web3Forms Email Integration ---
            // Replace 'YOUR_WEB3FORMS_ACCESS_KEY' with your actual access key from https://web3forms.com/
            // const web3FormsKey = 'YOUR_WEB3FORMS_ACCESS_KEY';
            const web3FormsKey = '8312489e-a146-444b-8687-186a001c1663';
            // --- CallMeBot WhatsApp Integration ---
            // Replace with your CallMeBot details: https://www.callmebot.com/blog/free-api-whatsapp-messages/
            // Note: phone number must include country code without '+' (e.g., 919876543210 for India)
            const whatsappPhone = 'YOUR_WHATSAPP_PHONE_NUMBER';
            const callMeBotApiKey = 'YOUR_CALLMEBOT_API_KEY';

            try {
                // Send to Web3Forms (Email)
                const emailPromise = fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: web3FormsKey,
                        subject: 'New Catering Inquiry',
                        name: name,
                        email: email,
                        phone: phone,
                        date: date,
                        guests: guests,
                        eventType: eventType,
                        message: message
                    })
                });

                // Send to CallMeBot (WhatsApp)
                const whatsappText = encodeURIComponent(`*New Inquiry Received*\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nDate: ${date}\nGuests: ${guests}\nEvent: ${eventType}\nMessage: ${message}`);
                const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=${whatsappPhone}&text=${whatsappText}&apikey=${callMeBotApiKey}`;

                // Using mode: 'no-cors' because CallMeBot does not return CORS headers for browser requests
                const whatsappPromise = fetch(callMeBotUrl, { mode: 'no-cors' });

                // Wait for both APIs to be requested
                await Promise.all([emailPromise, whatsappPromise]);

                // Success UI update
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Request Sent!';
                submitBtn.style.backgroundColor = '#2a9d8f';
                submitBtn.style.color = '#fff';
                form.reset();

            } catch (error) {
                console.error("Error submitting form:", error);
                submitBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Failed to send';
                submitBtn.style.backgroundColor = '#e76f51';
                submitBtn.style.color = '#fff';
            } finally {
                // Reset back after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    // 5. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.fade-in-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
});
