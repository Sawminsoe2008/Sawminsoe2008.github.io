// main.js - Modern JavaScript for Personal Website

document.addEventListener('DOMContentLoaded', function() {
    // ========== Header Scroll Effect ==========
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ========== Smooth Scrolling for Anchor Links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });

    // ========== Animate Elements When Scrolled Into View ==========
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .about-image, .contact-form');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    };

    // Initial check in case elements are already visible
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);

    // ========== Skill Progress Bars Animation ==========
    const animateSkills = function() {
        const skillsSection = document.querySelector('.skills');
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        if (skillsSection) {
            observer.observe(skillsSection);
        }
    };

    animateSkills();

    // ========== Contact Form Handling ==========
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Simple validation
            if (!formValues.name || !formValues.email || !formValues.message) {
                showAlert('Please fill in all required fields', 'error');
                return;
            }
            
            if (!validateEmail(formValues.email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission (in a real site, you would use fetch/axios)
            showAlert('Your message has been sent successfully!', 'success');
            this.reset();
            
            // In a real implementation, you would send the data to a server:
            // sendFormData(formValues);
        });
    }

    // ========== Helper Functions ==========
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showAlert(message, type) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.form-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `form-alert ${type}`;
        alert.textContent = message;
        
        // Add to form
        const form = document.querySelector('.contact-form');
        if (form) {
            form.insertBefore(alert, form.firstChild);
            
            // Remove after 5 seconds
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    }

    // ========== Mobile Menu Toggle ==========
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
    
    const nav = document.querySelector('nav');
    if (nav) {
        nav.appendChild(mobileMenuToggle);
        
        mobileMenuToggle.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.toggle('active');
                this.classList.toggle('active');
                
                // Toggle icon between bars and times
                const icon = this.querySelector('i');
                if (icon) {
                    if (this.classList.contains('active')) {
                        icon.classList.replace('fa-bars', 'fa-times');
                    } else {
                        icon.classList.replace('fa-times', 'fa-bars');
                    }
                }
            }
        });
    }

    // ========== Dark/Light Mode Toggle ==========
    const modeToggle = document.createElement('button');
    modeToggle.className = 'mode-toggle';
    modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    modeToggle.setAttribute('aria-label', 'Toggle dark mode');
    
    if (nav) {
        nav.insertBefore(modeToggle, mobileMenuToggle);
        
        // Check for saved user preference or use OS preference
        const savedMode = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedMode === 'dark' || (!savedMode && systemPrefersDark)) {
            document.body.classList.add('dark-mode');
            modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        modeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            const icon = this.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ========== Typing Animation for Hero Section ==========
    const heroTitle = document.querySelector('.hero-content h1 span');
    if (heroTitle) {
        const professions = ['Web Developer', 'UI/UX Designer', 'Freelancer', 'Problem Solver'];
        let professionIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentProfession = professions[professionIndex];
            
            if (isDeleting) {
                heroTitle.textContent = currentProfession.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                heroTitle.textContent = currentProfession.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentProfession.length) {
                isDeleting = true;
                typingSpeed = 1500; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                professionIndex = (professionIndex + 1) % professions.length;
                typingSpeed = 500; // Pause before typing next
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Start typing animation after a short delay
        setTimeout(type, 1000);
    }

    // ========== Project Filtering (if you add a portfolio section) ==========
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Filter projects
                const filterValue = this.getAttribute('data-filter');
                const projects = document.querySelectorAll('.project-item');
                
                projects.forEach(project => {
                    if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                        }, 50);
                    } else {
                        project.style.opacity = '0';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
});

// ========== Form Data Submission (Example with Fetch API) ==========
async function sendFormData(formData) {
    try {
        const response = await fetch('https://example.com/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error submitting form:', error);
        throw error;
    }
}

// ========== Intersection Observer for Lazy Loading ==========
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is fully loaded
if (document.readyState === 'complete') {
    setupLazyLoading();
} else {
    window.addEventListener('load', setupLazyLoading);
}
