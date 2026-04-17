// --- Register ScrollTrigger ---
gsap.registerPlugin(ScrollTrigger);

// --- Custom Cursor ---
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (cursorDot && cursorOutline && !window.matchMedia("(max-width: 768px)").matches) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Slight delay for the outline (spring effect)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Cursor Hover States
    document.documentElement.addEventListener('mouseover', (e) => {
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.magnetic')) {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(0, 210, 255, 0.1)';
        } else {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
        }
    });
}

// --- Magnetic Elements ---
const magnetics = document.querySelectorAll('.magnetic');
magnetics.forEach((elem) => {
    elem.addEventListener('mousemove', (e) => {
        const rect = elem.getBoundingClientRect();
        const h = rect.width / 2;
        const w = rect.height / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - w;
        
        gsap.to(elem, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.4,
            ease: "power2.out"
        });
    });
    elem.addEventListener('mouseleave', (e) => {
        gsap.to(elem, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// --- Loader, Reveals & Initial Animations ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');

    // Run GSAP Reveal for Text
    const runReveals = () => {
        gsap.utils.toArray('.reveal-text').forEach(text => {
            ScrollTrigger.create({
                trigger: text,
                start: "top 85%",
                animation: gsap.to(text, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out"
                })
            });
        });

        // Trigger existing fade-in-up classes
        gsap.utils.toArray('.fade-in-up').forEach(elem => {
            ScrollTrigger.create({
                trigger: elem,
                start: "top 85%",
                animation: gsap.to(elem, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out"
                })
            });
        });
    };

    if (loader) {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                loader.style.display = 'none';
                runReveals();
            }
        });
    } else {
        runReveals();
    }
});

// --- Mouse Tilt Effect for Cards (Packages Page) ---
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; 
        const rotateY = ((x - centerX) / centerX) * 10;
        
        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            ease: "power1.out",
            duration: 0.5
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            ease: "power3.out",
            duration: 0.8
        });
    });
});

// --- Three.js Background Implementation ---
const initThreeJS = () => {
    const container = document.getElementById('webgl-container');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 400;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); 
    container.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color(0x00d2ff);
    const color2 = new THREE.Color(0x8a2387);

    for(let i = 0; i < particlesCount * 3; i+=3) {
        const r = 800 * Math.cbrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        
        posArray[i] = r * Math.sin(phi) * Math.cos(theta);     
        posArray[i+1] = r * Math.sin(phi) * Math.sin(theta);   
        posArray[i+2] = r * Math.cos(phi);                     

        const mixedColor = color1.clone().lerp(color2, Math.random());
        colorArray[i] = mixedColor.r;
        colorArray[i+1] = mixedColor.g;
        colorArray[i+2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Include scrollY for parallax effect
        const scrollY = window.scrollY;

        particlesMesh.rotation.y = elapsedTime * 0.05 + (scrollY * 0.001);
        particlesMesh.rotation.x = elapsedTime * 0.02 + (scrollY * 0.0005);

        camera.position.x += (mouseX * 50 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 50 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    animate();
};

initThreeJS();

// --- Billing Toggle Logic ---
const billingSwitch = document.getElementById('billing-switch');
const monthlyLabel = document.getElementById('monthly-label');
const yearlyLabel = document.getElementById('yearly-label');
const priceContainers = document.querySelectorAll('.package-price');

if (billingSwitch && priceContainers.length >= 2) {
    const defaultPrices = ['4,999', '9,999'];
    const yearlyPrices = ['3,999', '7,999']; // 20% off

    billingSwitch.addEventListener('change', (e) => {
        const isYearly = e.target.checked;
        if(isYearly) {
            monthlyLabel.style.color = 'var(--c-text-secondary)';
            yearlyLabel.style.color = 'white';
        } else {
            monthlyLabel.style.color = 'white';
            yearlyLabel.style.color = 'var(--c-text-secondary)';
        }

        for(let i=0; i<2; i++) {
            const priceTextNode = Array.from(priceContainers[i].childNodes).find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
            if(priceTextNode) {
                const obj = { val: parseInt(priceTextNode.textContent.replace(/,/g, '')) };
                const targetVal = isYearly ? parseInt(yearlyPrices[i].replace(/,/g, '')) : parseInt(defaultPrices[i].replace(/,/g, ''));
                
                gsap.to(obj, {
                    val: targetVal,
                    duration: 0.5,
                    onUpdate: () => {
                        priceTextNode.textContent = Math.floor(obj.val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                });
            }
        }
    });
}

// --- Contact Modal Form ---
const modalOverlay = document.getElementById('contact-modal');
const closeModalBtn = document.getElementById('close-modal');
const openModalBtns = document.querySelectorAll('.open-modal-btn');
const packageSelect = document.getElementById('package-select');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');

if (modalOverlay) {
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const packageType = btn.getAttribute('data-package');
            if (packageSelect && packageType) {
                packageSelect.value = packageType;
            }
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            if(contactForm) contactForm.style.display = 'block';
            if(formSuccess) formSuccess.style.display = 'none';
        }, 400);
    };

    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            
            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                contactForm.reset();
                
                gsap.fromTo(formSuccess, 
                    { scale: 0.8, opacity: 0 }, 
                    { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
                );
            }, 1500);
        });
    }
}

// --- FAQ Accordion ---
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const icon = question.querySelector('.faq-icon');
        const isOpen = answer.style.maxHeight;

        document.querySelectorAll('.faq-answer').forEach(ans => ans.style.maxHeight = null);
        document.querySelectorAll('.faq-icon').forEach(icn => { icn.style.transform = 'rotate(0deg)'; icn.textContent = '+'; });
        
        if (!isOpen) {
            answer.style.maxHeight = answer.scrollHeight + "px";
            icon.style.transform = 'rotate(45deg)';
            icon.textContent = '×';
        }
    });
});

// --- Scroll Utilities ---
const scrollProgress = document.getElementById('scroll-progress');
const backToTopBtn = document.getElementById('back-to-top');

if (scrollProgress || backToTopBtn) {
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = Math.max(0, Math.min((scrollTop / scrollHeight) * 100, 100));
        
        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        if (backToTopBtn) {
            if (scrollTop > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}