document.addEventListener('DOMContentLoaded', () => {
    // 1. Language Toggle
    const langBtns = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-en]');

    const setLanguage = (lang) => {
        // Update text directions and fonts
        if (lang === 'ar') {
            document.documentElement.setAttribute('lang', 'ar');
            document.body.classList.add('rtl-layout');

            translatableElements.forEach(el => {
                if (el.tagName.toLowerCase() !== 'input' && el.tagName.toLowerCase() !== 'textarea') {
                    el.classList.add('rtl-text');
                }
            });
            // Update inputs RTL class manually based on input-group elements
            document.querySelectorAll('.input-group input, .input-group textarea, .input-group label').forEach(el => el.classList.add('rtl-text'));
        } else {
            document.documentElement.setAttribute('lang', lang);
            document.body.classList.remove('rtl-layout');

            translatableElements.forEach(el => {
                if (el.tagName.toLowerCase() !== 'input' && el.tagName.toLowerCase() !== 'textarea') {
                    el.classList.remove('rtl-text');
                }
            });
            document.querySelectorAll('.input-group input, .input-group textarea, .input-group label').forEach(el => el.classList.remove('rtl-text'));
        }

        // Update active button
        langBtns.forEach(btn => {
            if (btn.dataset.lang === lang) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        // Update texts
        translatableElements.forEach(el => {
            if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
                // Keep input value empty by default, handle placeholders natively via CSS empty checks
            } else {
                el.textContent = el.dataset[lang] || el.textContent;
            }
        });

        // Update typewriter
        startTypewriter(lang);
    };

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });

    // 2. Typewriter Effect
    const typeWriterEl = document.getElementById('typewriter');
    const strings = {
        en: [
            "Learning daily",
            "Building AI-assisted projects",
            "Improving in C#, JavaScript, HTML, CSS, SQL, GitHub"
        ],
        es: [
            "Aprendiendo diariamente",
            "Construyendo proyectos asistidos por IA",
            "Mejorando en C#, JavaScript, HTML, CSS, SQL, GitHub"
        ],
        ar: [
            "أتعلم يومياً",
            "أبني مشاريع بمساعدة الذكاء الاصطناعي",
            "أطور مهاراتي في C#, JavaScript, HTML, CSS, SQL, GitHub"
        ]
    };

    let typeTimerId;
    let typeCharIdx = 0;
    let typeStrIdx = 0;
    let isDeleting = false;
    let currentLang = 'en';

    function startTypewriter(lang) {
        currentLang = lang;
        clearTimeout(typeTimerId);
        typeCharIdx = 0;
        typeStrIdx = 0;
        isDeleting = false;
        typeWriterEl.textContent = '';
        typeLoop();
    }

    function typeLoop() {
        const currentStrings = strings[currentLang];
        const fullStr = currentStrings[typeStrIdx];

        if (isDeleting) {
            typeWriterEl.textContent = fullStr.substring(0, typeCharIdx - 1);
            typeCharIdx--;
        } else {
            typeWriterEl.textContent = fullStr.substring(0, typeCharIdx + 1);
            typeCharIdx++;
        }

        let typeSpeed = isDeleting ? 30 : 60;

        if (!isDeleting && typeCharIdx === fullStr.length) {
            typeSpeed = 2500; // Pause at end
            isDeleting = true;
        } else if (isDeleting && typeCharIdx === 0) {
            isDeleting = false;
            typeStrIdx = (typeStrIdx + 1) % currentStrings.length;
            typeSpeed = 600; // Pause before new word
        }

        typeTimerId = setTimeout(typeLoop, typeSpeed);
    }

    startTypewriter('en');

    // 3. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add in-view to children
                const animates = entry.target.querySelectorAll('.animate-slide-left, .animate-slide-right, .animate-fade-up, .title-glow, .name-underline');
                animates.forEach(el => el.classList.add('in-view'));

                // If skills section, animate bars
                if (entry.target.id === 'skills') {
                    const bars = entry.target.querySelectorAll('.skill-bar');
                    bars.forEach(bar => {
                        bar.style.width = bar.dataset.width;
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-observe').forEach(section => {
        sectionObserver.observe(section);
    });

    // 4. Floating Assistant Logic
    const eyesContainer = document.querySelector('.eyes-container');
    const assistant = document.getElementById('assistant');
    const bubble = document.getElementById('speech-bubble');
    const bubbleText = bubble.querySelector('.bubble-text');

    // Eyes follow mouse and cards 3D hover parallax
    const cardsParallax = document.querySelectorAll('.hover-parallax');

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 8; // Max move 4px left/right
        const y = (e.clientY / window.innerHeight - 0.5) * 6; // Max move 3px up/down

        eyesContainer.style.transform = `translate(${x}px, ${y}px)`;

        // 3D Parallax on specific Cards
        cardsParallax.forEach(card => {
            const rect = card.getBoundingClientRect();
            // Check if mouse is over the card to apply the 3d rotate effect
            if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
                const cardX = (e.clientX - rect.left) / rect.width - 0.5;
                const cardY = (e.clientY - rect.top) / rect.height - 0.5;
                const rotateY = cardX * 10;
                const rotateX = cardY * -10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            } else {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
            }
        });
    });

    document.addEventListener('mouseleave', () => {
        cardsParallax.forEach(card => card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`);
    });

    // Assistant comments dictionary
    const commentsData = {
        hero: {
            en: "Welcome to my digital space.",
            es: "Bienvenido a mi espacio digital.",
            ar: "مرحباً بك في مساحتي الرقمية."
        },
        about: {
            en: "That’s me, still learning, growing daily.",
            es: "Ese soy yo, sigo aprendiendo, creciendo a diario.",
            ar: "هذا أنا، لا أزال أتعلم وأنمو يومياً."
        },
        skills: {
            en: "Progress is steady and consistent.",
            es: "El progreso es constante y firme.",
            ar: "التقدم ثابت ومستمر."
        },
        languages: {
            en: "Communication opens many doors.",
            es: "La comunicación abre muchas puertas.",
            ar: "التواصل يفتح أبواباً كثيرة."
        },
        education: {
            en: "Building a strong academic foundation.",
            es: "Construyendo una sólida base académica.",
            ar: "بناء أساس أكاديمي قوي."
        },
        projects: {
            en: "Building real projects while learning.",
            es: "Construyendo proyectos reales mientras aprendo.",
            ar: "بناء مشاريع حقيقية أثناء التعلم."
        },

        contact: {
            en: "Let’s create value together.",
            es: "Vamos a crear valor juntos.",
            ar: "دعونا نصنع قيمة معاً."
        }
    };

    let lastScrollY = window.scrollY;
    let tiltTimeout;
    const sections = document.querySelectorAll('.section-observe');
    let currentActiveSectionId = 'hero';

    // Parallax background elements
    const parallaxBgs = document.querySelectorAll('.parallax-bg, .parallax-content');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Background Parallax
        parallaxBgs.forEach(el => {
            const speed = parseFloat(el.dataset.speed);
            const yPos = -(scrollY * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });

        const delta = scrollY - lastScrollY;

        // Tilt more if scrolling faster
        let rotZ = delta > 0 ? Math.min(delta * 0.15, 6) : Math.max(delta * 0.15, -6);
        if (Math.abs(delta) < 2) rotZ = 0;

        // Only check class for layout specific items if strictly needed
        if (document.body.classList.contains('rtl-layout')) {
            // Note: with explicit text dir we aren't completely breaking timeline mirroring coordinates, just reversing tilt
            rotZ = -rotZ;
        }

        assistant.style.transform = `rotate(${rotZ}deg)`;

        clearTimeout(tiltTimeout);
        tiltTimeout = setTimeout(() => {
            assistant.style.transform = `rotate(0deg)`;
        }, 150);

        lastScrollY = scrollY;

        // Find visible section
        let currentSection = sections[0];
        let minDistance = Infinity;

        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
            if (distance < minDistance) {
                minDistance = distance;
                currentSection = sec;
            }
        });

        const newSectionId = currentSection.id;

        if (currentActiveSectionId !== newSectionId) {
            currentActiveSectionId = newSectionId;
            updateBubbleText();
        }
    });

    function updateBubbleText() {
        const commentObj = commentsData[currentActiveSectionId];
        if (!commentObj) return;

        const newComment = commentObj[currentLang];

        if (bubbleText.textContent !== newComment) {
            bubble.classList.remove('visible');
            setTimeout(() => {
                bubbleText.textContent = newComment;
                bubble.classList.add('visible');
            }, 300);
        }
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateBubbleText();
        });
    });

    setTimeout(() => {
        updateBubbleText();
        bubble.classList.add('visible');
    }, 1000);

    // 5. Generate Particles in Background
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random positioning
        particle.style.left = `${Math.random() * 100}%`;

        // Random animation delay and duration
        const duration = 10 + Math.random() * 20;
        const delay = Math.random() * -20;

        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        // Random slight scaling
        const scale = 0.5 + Math.random() * 1;
        particle.style.width = `${scale * 3}px`;
        particle.style.height = `${scale * 3}px`;

        particlesContainer.appendChild(particle);
    }
});
