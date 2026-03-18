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
ScrollReveal().reveal('.services-container, .skills-container, .projects-container, .timeline-wrapper, .contact-wrapper', { origin: 'bottom' });
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

document.addEventListener("DOMContentLoaded", function() {
  // Setup year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  if(textArray.length) setTimeout(type, newTextDelay + 250);
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
