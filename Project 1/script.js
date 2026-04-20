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

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                menuCards.forEach(card => {
                    const catMatches = filter === 'all' || card.getAttribute('data-category') === filter;
                    if (catMatches) {
                        card.style.display = 'block';
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
    }

    // 4. Contact Form Submission mock
    const form = document.getElementById('bookingForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
            submitBtn.style.opacity = '0.8';

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Request Sent!';
                submitBtn.style.backgroundColor = '#2a9d8f';
                submitBtn.style.color = '#fff';
                form.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

    // 5. Gallery Tabs
    window.switchGalleryTab = function(tab, id) {
        document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        ['photos','videos','past'].forEach(t => {
            const el = document.getElementById('tab-' + t);
            if(el) el.style.display = (t === id) ? '' : 'none';
        });
    };

    // 6. Lightbox
    window.openLightbox = function(emoji, caption) {
        const emojiEl = document.getElementById('lightboxEmoji');
        const capEl = document.getElementById('lightboxCaption');
        const box = document.getElementById('lightbox');
        if (emojiEl && capEl && box) {
            emojiEl.textContent = emoji;
            capEl.textContent = caption;
            box.classList.add('open');
        }
    };
    
    window.closeLightbox = function() {
        const box = document.getElementById('lightbox');
        if (box) box.classList.remove('open');
    };

    // 7. FAQ Accordion
    window.toggleFaq = function(el) {
        const ans = el.nextElementSibling;
        const isOpen = el.classList.contains('open');
        document.querySelectorAll('.faq-q.open').forEach(q => {
            q.classList.remove('open');
            if (q.nextElementSibling) q.nextElementSibling.classList.remove('open');
        });
        if (!isOpen) {
            el.classList.add('open');
            if (ans) ans.classList.add('open');
        }
    };
});
