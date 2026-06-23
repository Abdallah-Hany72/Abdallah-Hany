// Toggle Icon Navbar
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// Scroll Sections Active Link & Sticky Navbar
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });

    // Sticky Navbar
    let header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 50);

    // Remove toggle icon and navbar when click navbar link (scroll)
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

// Dark / Light Mode Toggle
let themeBtn = document.querySelector('#theme-toggle');
let themeIcon = document.querySelector('#theme-toggle i');
// Check local storage for theme preference
let currentTheme = localStorage.getItem('portfolio-theme');

// Set default theme state based on OS preference if no local storage
if (!currentTheme) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    currentTheme = prefersDark ? 'dark' : 'light';
}

if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.replace('bx-moon', 'bx-sun');
}

themeBtn.onclick = () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.replace('bx-moon', 'bx-sun');
        localStorage.setItem('portfolio-theme', 'dark');
    } else {
        themeIcon.classList.replace('bx-sun', 'bx-moon');
        localStorage.setItem('portfolio-theme', 'light');
    }
};

// Scroll Reveal Animations
ScrollReveal({ 
    // reset: true,
    distance: '60px',
    duration: 2500,
    delay: 200
});

ScrollReveal().reveal('.heading', { origin: 'top' });
ScrollReveal().reveal('.services-container, .skills-container, .carousel-viewport, .timeline-wrapper, .contact-wrapper', { origin: 'bottom' });
ScrollReveal().reveal('.about-img', { origin: 'left' });
ScrollReveal().reveal('.about-content', { origin: 'right' });


// Vanilla JS Typing Effect
const typedTextSpan = document.querySelector(".multiple-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["Software Engineer", "Front-End Developer", "React Enthusiast", "Problem Solver"];
const typingDelay = 100;
const erasingDelay = 60;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  } 
  else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if(textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, typingDelay + 1100);
  }
}
// Premium Projects Carousel Implementation
class ProjectCarousel {
    constructor() {
        this.viewport = document.querySelector('.carousel-viewport');
        this.track = document.querySelector('.carousel-track');
        if (!this.viewport || !this.track) return;

        this.originalCards = Array.from(this.track.children);
        this.totalOriginals = this.originalCards.length;
        if (this.totalOriginals === 0) return;

        this.prevBtn = document.querySelector('.carousel-nav-btn.prev-btn');
        this.nextBtn = document.querySelector('.carousel-nav-btn.next-btn');
        this.currentSlideText = document.querySelector('.carousel-counter .current-slide');
        this.totalSlidesText = document.querySelector('.carousel-counter .total-slides');
        this.progressBar = document.getElementById('carousel-progress');

        // Carousel State
        this.activeIndex = 0;
        this.cardsToShow = 4;
        this.gap = 30; // 3rem gap matches 30px
        
        this.isTransitioning = false;
        this.clonesCount = 4; // Sufficient padding clones for desktop

        // Drag State
        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.draggedDistance = 0;
        this.dragStartTime = 0;
        this.preventClick = false;

        // Autoplay
        this.autoplayInterval = null;
        this.autoplayDelay = 4000;
        this.swipeThreshold = 50;

        this.init();
    }

    init() {
        this.createClones();

        if (this.totalSlidesText) {
            this.totalSlidesText.textContent = this.padZero(this.totalOriginals);
        }

        this.setupEventListeners();
        this.handleResize();
        this.startAutoplay();
    }

    createClones() {
        // Clone first N cards and append to the end
        for (let i = 0; i < this.clonesCount; i++) {
            const clone = this.originalCards[i].cloneNode(true);
            clone.classList.add('carousel-clone');
            clone.setAttribute('aria-hidden', 'true');
            clone.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', '-1'));
            this.track.appendChild(clone);
        }

        // Clone last N cards and prepend to the start
        for (let i = this.totalOriginals - this.clonesCount; i < this.totalOriginals; i++) {
            const clone = this.originalCards[i].cloneNode(true);
            clone.classList.add('carousel-clone');
            clone.setAttribute('aria-hidden', 'true');
            clone.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', '-1'));
            this.track.insertBefore(clone, this.track.firstChild);
        }
    }

    updateColumnsCount() {
        const width = window.innerWidth;
        if (width >= 1200) {
            this.cardsToShow = 4;
        } else if (width >= 992) {
            this.cardsToShow = 3;
        } else if (width >= 768) {
            this.cardsToShow = 2;
        } else {
            this.cardsToShow = 1;
        }
    }

    handleResize() {
        this.updateColumnsCount();

        const viewportWidth = this.viewport.getBoundingClientRect().width;
        const totalGapsWidth = (this.cardsToShow - 1) * this.gap;
        this.cardWidth = (viewportWidth - totalGapsWidth) / this.cardsToShow;

        const allCards = this.track.querySelectorAll('.project-card');
        allCards.forEach(card => {
            card.style.width = `${this.cardWidth}px`;
        });

        this.goToIndex(this.activeIndex, false);
    }

    getTranslateForIndex(index) {
        const cardWidthWithGap = this.cardWidth + this.gap;
        return -((index + this.clonesCount) * cardWidthWithGap);
    }

    goToIndex(index, animate = true) {
        if (this.isTransitioning && animate) return;

        this.activeIndex = index;

        if (animate) {
            this.isTransitioning = true;
            this.track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
        } else {
            this.track.style.transition = 'none';
        }

        const translateVal = this.getTranslateForIndex(this.activeIndex);
        this.setTransform(translateVal);
        this.currentTranslate = translateVal;
        this.prevTranslate = translateVal;

        this.updateIndicators();

        if (!animate) {
            this.isTransitioning = false;
        }
    }

    setTransform(value) {
        this.track.style.transform = `translate3d(${value}px, 0, 0)`;
    }

    updateIndicators() {
        if (this.currentSlideText) {
            let normalizedIndex = this.activeIndex;
            if (normalizedIndex < 0) {
                normalizedIndex = this.totalOriginals - 1;
            } else if (normalizedIndex >= this.totalOriginals) {
                normalizedIndex = 0;
            }
            this.currentSlideText.textContent = this.padZero(normalizedIndex + 1);
        }

        if (this.progressBar) {
            let normalizedIndex = this.activeIndex;
            if (normalizedIndex < 0) {
                normalizedIndex = this.totalOriginals - 1;
            } else if (normalizedIndex >= this.totalOriginals) {
                normalizedIndex = 0;
            }
            const maxScrollableIndex = this.totalOriginals - 1;
            const progress = maxScrollableIndex > 0 ? (normalizedIndex / maxScrollableIndex) * 100 : 100;
            this.progressBar.style.width = `${progress}%`;
        }

        this.originalCards.forEach((card, idx) => {
            if (idx === this.activeIndex) {
                card.setAttribute('aria-selected', 'true');
                card.removeAttribute('tabindex');
                card.querySelectorAll('a, button').forEach(el => el.removeAttribute('tabindex'));
            } else {
                card.setAttribute('aria-selected', 'false');
            }
        });
    }

    slideNext() {
        this.goToIndex(this.activeIndex + 1);
    }

    slidePrev() {
        this.goToIndex(this.activeIndex - 1);
    }

    handleTransitionEnd() {
        this.isTransitioning = false;

        if (this.activeIndex >= this.totalOriginals) {
            this.goToIndex(0, false);
        } else if (this.activeIndex < 0) {
            this.goToIndex(this.totalOriginals - 1, false);
        }
    }

    pointerDown(e) {
        this.isDragging = true;
        this.startX = this.getPointerX(e);
        this.dragStartTime = Date.now();
        this.preventClick = false;

        this.pauseAutoplay();
        this.track.style.transition = 'none';

        this.currentTranslate = this.getTranslateForIndex(this.activeIndex);
        this.prevTranslate = this.currentTranslate;
    }

    pointerMove(e) {
        if (!this.isDragging) return;

        const currentX = this.getPointerX(e);
        this.draggedDistance = currentX - this.startX;

        if (Math.abs(this.draggedDistance) > 10) {
            this.preventClick = true;
        }

        const newTranslate = this.prevTranslate + this.draggedDistance;
        this.setTransform(newTranslate);
        this.currentTranslate = newTranslate;
    }

    pointerUp(e) {
        if (!this.isDragging) return;
        this.isDragging = false;

        const dragDuration = Date.now() - this.dragStartTime;
        const totalDistance = this.draggedDistance;
        this.draggedDistance = 0;

        if (!this.viewport.matches(':hover')) {
            this.startAutoplay();
        }

        const cardWidthWithGap = this.cardWidth + this.gap;
        const isQuickSwipe = dragDuration < 300 && Math.abs(totalDistance) > this.swipeThreshold;
        const isSignificantDrag = Math.abs(totalDistance) > cardWidthWithGap * 0.35;

        if (isQuickSwipe || isSignificantDrag) {
            if (totalDistance < 0) {
                this.slideNext();
            } else {
                this.slidePrev();
            }
        } else {
            this.goToIndex(this.activeIndex);
        }
    }

    getPointerX(e) {
        return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    }

    handleWheel(e) {
        const deltaX = e.deltaX;
        const deltaY = e.deltaY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault();
            this.pauseAutoplay();
            if (deltaX > 20 && !this.isTransitioning) {
                this.slideNext();
            } else if (deltaX < -20 && !this.isTransitioning) {
                this.slidePrev();
            }
        } else {
            // Translate vertical scroll inside the viewport to horizontal sliding
            if (Math.abs(deltaY) > 30) {
                e.preventDefault();
                this.pauseAutoplay();
                if (deltaY > 0 && !this.isTransitioning) {
                    this.slideNext();
                } else if (deltaY < 0 && !this.isTransitioning) {
                    this.slidePrev();
                }
            }
        }
    }

    handleKeyDown(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.pauseAutoplay();
            this.slidePrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.pauseAutoplay();
            this.slideNext();
        }
    }

    startAutoplay() {
        if (this.autoplayInterval) return;
        this.autoplayInterval = setInterval(() => {
            this.slideNext();
        }, this.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    setupEventListeners() {
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => {
            this.pauseAutoplay();
            this.slidePrev();
        });
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => {
            this.pauseAutoplay();
            this.slideNext();
        });

        this.track.addEventListener('transitionend', () => this.handleTransitionEnd());

        this.viewport.addEventListener('pointerdown', (e) => this.pointerDown(e));
        window.addEventListener('pointermove', (e) => this.pointerMove(e));
        window.addEventListener('pointerup', (e) => this.pointerUp(e));
        window.addEventListener('pointercancel', (e) => this.pointerUp(e));

        this.track.addEventListener('click', (e) => {
            if (this.preventClick) {
                e.preventDefault();
            }
        });

        this.viewport.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.viewport.addEventListener('mouseleave', () => this.startAutoplay());

        this.viewport.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        this.viewport.addEventListener('keydown', (e) => this.handleKeyDown(e));

        window.addEventListener('resize', () => this.handleResize());
    }

    padZero(num) {
        return num < 10 ? `0${num}` : num;
    }
}

document.addEventListener("DOMContentLoaded", function() {
  // Setup year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  if(textArray.length) setTimeout(type, newTextDelay + 250);

  // Initialize Projects Carousel
  new ProjectCarousel();
});

// Form Submission Prevention (for demo purposes)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = 'Sent Successfully! <i class="bx bx-check"></i>';
        btn.style.backgroundColor = '#10b981'; // Success green
        
        setTimeout(() => {
            this.reset();
            btn.innerHTML = originalText;
            btn.style.backgroundColor = ''; // Revert to default
        }, 3000);
    });
}
