document.addEventListener("DOMContentLoaded", () => {
  // --- INITIALIZE AOS ---
  AOS.init({
    duration: 1000,
    once: true,
  });
  // --- NAVBAR SCROLL EFFECT ---
  const nav = document.querySelector("nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  // --- CUSTOM CURSOR ---
  const cursor = document.querySelector(".cursor");
  const follower = document.querySelector(".cursor-follower");
  const hoverables = document.querySelectorAll("a, button, .cursor-pointer");

  let mouseX = 0,
    mouseY = 0;
  let followerX = 0,
    followerY = 0;

  if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
      const dx = mouseX - followerX;
      const dy = mouseY - followerY;
      followerX += dx * 0.1;
      followerY += dy * 0.1;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", () =>
        follower.classList.add("cursor-grow")
      );
      el.addEventListener("mouseleave", () =>
        follower.classList.remove("cursor-grow")
      );
    });
  } else {
    cursor.style.display = "none";
    follower.style.display = "none";
  }

  // --- PARTICLE ANIMATION ---
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");

  let particles = [];

  function setCanvasSizeAndParticles() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    let particleCount = window.innerWidth < 768 ? 480 : 1200;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      const isMobile = window.innerWidth < 768;
      this.size = isMobile
        ? Math.random() * 1.0 + 0.2
        : Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.8 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width + 10) this.x = -10;
      else if (this.x < -10) this.x = canvas.width + 10;
      if (this.y > canvas.height + 10) this.y = -10;
      else if (this.y < -10) this.y = canvas.height + 10;
    }

    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(
        this.x,
        this.y,
        this.size * window.devicePixelRatio,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  let animationFrameId;
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    animationFrameId = requestAnimationFrame(animateParticles);
  }

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const handleResize = debounce(() => {
    cancelAnimationFrame(animationFrameId);
    setCanvasSizeAndParticles();
    animateParticles();
  }, 250);

  window.addEventListener("resize", handleResize);

  setCanvasSizeAndParticles();
  animateParticles();

  // --- MOBILE MENU ---
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const openIcon = document.querySelector(".menu-icon-open");
  const closeIcon = document.querySelector(".menu-icon-close");

  function toggleMenu() {
    mobileMenu.classList.toggle("open");
    document.body.classList.toggle("menu-open");
    openIcon.classList.toggle("hidden");
    closeIcon.classList.toggle("hidden");
  }

  mobileMenuBtn.addEventListener("click", toggleMenu);
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileMenu.classList.contains("open")) {
        toggleMenu();
      }
    });
  });

  // --- NAV DOTS & SMOOTH SCROLL ---
  const sections = document.querySelectorAll("section");
  const navDots = document.querySelectorAll(".nav-dot");

  const observerOptions = { root: null, rootMargin: "0px", threshold: 0.5 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        navDots.forEach((dot) => {
          dot.classList.remove("active");
          if (dot.dataset.section === sectionId) {
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
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // --- TYPING ANIMATION ---
  const typingText = document.querySelector(".typing-cursor");
  const texts = [
    "Software Engineer",
    "Problem Solver",
    "Creative Thinker",
    "Tech Enthusiast",
  ];
  let textIndex = 0,
    charIndex = 0,
    isDeleting = false;

  function type() {
    const currentText = texts[textIndex];
    if (isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, isDeleting ? 50 : 100);
    }
  }
  type();

  // --- MAGNETIC BUTTON ---
  document.querySelectorAll(".magnetic-btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
});
