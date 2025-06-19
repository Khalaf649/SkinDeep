// Create animated background particles
function createParticles() {
    const particlesContainer = document.getElementById("particles");
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 6 + "s";
        particle.style.animationDuration = Math.random() * 3 + 3 + "s";
        particlesContainer.appendChild(particle);
    }
}

// Smooth scrolling to sections
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    const headerHeight =
        document.querySelector("header").offsetHeight +
        document.querySelector("nav").offsetHeight;
    const elementPosition = element.offsetTop - headerHeight - 20;

    window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
    });
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

// Fade in animation on scroll
function handleScrollAnimations() {
    const elements = document.querySelectorAll(".fade-in");
    const windowHeight = window.innerHeight;

    elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add("visible");
        }
    });
}


// Update navigation active state on scroll
function updateNavigation() {
    const sections = ["equations", "analytical", "numerical"];
    const navLinks = document.querySelectorAll("nav a");
    const headerHeight =
        document.querySelector("header").offsetHeight +
        document.querySelector("nav").offsetHeight;

    let currentSection = "";

    sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
            currentSection = sectionId;
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + currentSection) {
            link.classList.add("active");
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    createParticles();
    handleScrollAnimations();

    // Add scroll event listeners
    window.addEventListener("scroll", function () {
        handleScrollAnimations();
        updateNavigation();
    });

    // Add resize event listener
    window.addEventListener("resize", function () {
        handleScrollAnimations();
    });

    // Initial visibility check
    setTimeout(handleScrollAnimations, 100);
});

// Add some interactive effects
document.addEventListener("mousemove", function (e) {
    const particles = document.querySelectorAll(".particle");
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    particles.forEach((particle, index) => {
        if (index % 5 === 0) {
            // Only affect every 5th particle for performance
            const speed = 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            particle.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        }
    });
});