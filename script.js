document.addEventListener('DOMContentLoaded', () => {

    // --- Starfield Universe Background ---
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    const particleCount = 600; 
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.isGlowing = Math.random() > 0.97; 
            this.size = this.isGlowing ? Math.random() * 2 + 1 : Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 0.1 - 0.05; 
            this.speedY = Math.random() * 0.1 - 0.05;
            this.opacity = Math.random() * 0.8 + 0.2;
            this.dOpacity = (Math.random() - 0.5) * 0.002; 
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width + 5) this.x = -5;
            if (this.x < -5) this.x = canvas.width + 5;
            if (this.y > canvas.height + 5) this.y = -5;
            if (this.y < -5) this.y = canvas.height + 5;
            
            this.opacity += this.dOpacity;
            if (this.opacity < 0.1 || this.opacity > 1) {
                this.dOpacity *= -1;
            }
        }
        
        draw() {
            ctx.shadowBlur = this.isGlowing ? 15 : 5;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
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
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    // --- Three.js Universe Orb ---
    if (typeof THREE !== 'undefined') {
        const container = document.getElementById('three-orb-container');
        if (container) {
            // Scene, Camera, Renderer
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 2.5;

            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            // Shaders
            const vertexShader = `
                varying vec2 vUv;
                varying vec3 vNormal;
                void main() {
                    vUv = uv;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `;

            const fragmentShader = `
                uniform float uTime;
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                varying vec2 vUv;
                varying vec3 vNormal;

                // 2D Random function
                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
                }

                // 2D Noise function
                float noise(vec2 st) {
                    vec2 i = floor(st);
                    vec2 f = fract(st);
                    float a = random(i);
                    float b = random(i + vec2(1.0, 0.0));
                    float c = random(i + vec2(0.0, 1.0));
                    float d = random(i + vec2(1.0, 1.0));
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
                }

                void main() {
                    float t = uTime * 0.2;
                    // Swirling noise pattern
                    float n = noise(vUv * 4.0 + t);
                    n += 0.5 * noise(vUv * 8.0 - t * 1.2);
                    
                    // Mix colors based on noise
                    vec3 mixedColor = mix(uColor1, uColor2, n);
                    
                    // Fresnel effect for edge glow
                    float fresnel = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
                    fresnel = pow(fresnel, 2.5);

                    vec3 finalColor = mixedColor + fresnel * 0.5;

                    gl_FragColor = vec4(finalColor, fresnel * 1.5);
                }
            `;

            // Orb Material and Mesh
            const geometry = new THREE.SphereGeometry(1.3, 64, 64);
            const material = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {
                    uTime: { value: 0 },
                    uColor1: { value: new THREE.Color(0x6a0dad) }, // Purple
                    uColor2: { value: new THREE.Color(0x4b0082) }  // Indigo
                },
                transparent: true,
                blending: THREE.AdditiveBlending,
            });

            const orb = new THREE.Mesh(geometry, material);
            scene.add(orb);
            
            // Animation Loop
            const clock = new THREE.Clock();
            function animate() {
                requestAnimationFrame(animate);
                material.uniforms.uTime.value = clock.getElapsedTime();
                orb.rotation.y += 0.001;
                orb.rotation.x += 0.0005;
                renderer.render(scene, camera);
            }
            animate();

            // Handle window resize
            window.addEventListener('resize', () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });

            // --- Orb Interaction ---
            const body = document.body;
            container.addEventListener('click', () => {
                container.classList.add('clicked');
                body.classList.add('content-revealed');
                
                setTimeout(() => {
                    body.style.overflowY = 'auto';
                }, 500);

                setTimeout(() => {
                    const aboutSection = document.getElementById('about');
                    if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 700);
            });
        }
    }

    // --- Mobile Menu Toggle & Link Fix ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // --- Smooth Scroll & Nav Dots Activation ---
    const sections = document.querySelectorAll('section');
    const navDots = document.querySelectorAll('.nav-dot');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navDots.forEach(dot => {
                    dot.classList.remove('active');
                    const dotSection = dot.dataset.section;
                    if (dotSection === sectionId) {
                        dot.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const sectionId = dot.dataset.section;
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // --- Typing Animation ---
    const typingText = document.querySelector('.typing-cursor');
    const texts = ['Software Engineer', 'Problem Solver', 'Creative Thinker', 'Tech Enthusiast'];
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
            clearTimeout(typeTimeout);
            typeTimeout = setTimeout(() => { isDeleting = true; type(); }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            clearTimeout(typeTimeout);
            typeTimeout = setTimeout(type, 500);
        } else {
            clearTimeout(typeTimeout);
            typeTimeout = setTimeout(type, typeSpeed);
        }
    }
    
    type();

    // --- Magnetic Button Effect ---
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transition = 'transform 0.1s linear';
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            btn.style.transform = 'translate(0, 0)';
        });
    });
});

