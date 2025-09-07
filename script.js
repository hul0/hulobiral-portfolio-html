document.addEventListener("DOMContentLoaded", () => {
  // --- Starfield Universe Background ---
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  const particleCount = 600; // Increased star count for a denser universe

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.isGlowing = Math.random() > 0.97; // About 3% of stars will be bigger and glowy
      this.size = this.isGlowing
        ? Math.random() * 2 + 1
        : Math.random() * 1 + 0.5;
      this.speedX = Math.random() * 0.1 - 0.05; // Slower drift
      this.speedY = Math.random() * 0.1 - 0.05;
      this.opacity = Math.random() * 0.8 + 0.2;
      // Slower, more subtle twinkle effect
      this.dOpacity = (Math.random() - 0.5) * 0.002;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap particles around the screen
      if (this.x > canvas.width + 5) this.x = -5;
      if (this.x < -5) this.x = canvas.width + 5;
      if (this.y > canvas.height + 5) this.y = -5;
      if (this.y < -5) this.y = canvas.height + 5;

      // Twinkle effect
      this.opacity += this.dOpacity;
      if (this.opacity < 0.1 || this.opacity > 1) {
        this.dOpacity *= -1;
      }
    }

    draw() {
      // Add a subtle blur to all stars
      ctx.shadowBlur = this.isGlowing ? 15 : 5;
      ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Reset shadow properties for each frame
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  });

  // --- Universe Orb Interaction ---
  const universeOrb = document.getElementById("universe-orb");
  const universeOrbContainer = document.getElementById(
    "universe-orb-container"
  );
  const body = document.body;

  universeOrb.addEventListener("click", () => {
    universeOrb.classList.add("clicked");
    body.classList.add("content-revealed");

    // Start enabling scroll after a short delay
    setTimeout(() => {
      body.style.overflowY = "auto";
    }, 500);

    // Auto-scroll to the about section to guide the user
    setTimeout(() => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 700);

    // Remove the orb from the DOM after its transition
    setTimeout(() => {
      if (universeOrbContainer) {
        universeOrbContainer.style.display = "none";
      }
    }, 500);
  });

  // --- Mobile Menu Toggle & Link Fix ---
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });

  // --- Smooth Scroll & Nav Dots Activation ---
  const sections = document.querySelectorAll("section");
  const navDots = document.querySelectorAll(".nav-dot");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        navDots.forEach((dot) => {
          dot.classList.remove("active");
          const dotSection = dot.dataset.section;
          if (dotSection === sectionId) {
            dot.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  navDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const sectionId = dot.dataset.section;
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // --- Typing Animation ---
  const typingText = document.querySelector(".typing-cursor");
  const texts = [
    "Software Engineer",
    "Problem Solver",
    "Creative Thinker",
    "Tech Enthusiast",
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeTimeout;

  function type() {
    const currentText = texts[textIndex];
    const typeSpeed = isDeleting ? 50 : 100;

    if (isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
      typeTimeout = setTimeout(() => (isDeleting = true), 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }

    typeTimeout = setTimeout(type, typeSpeed);
  }

  type();

  // --- Magnetic Button Effect ---
  document.querySelectorAll(".magnetic-btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transition = "transform 0.1s linear";
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      btn.style.transform = "translate(0, 0)";
    });
  });
});
