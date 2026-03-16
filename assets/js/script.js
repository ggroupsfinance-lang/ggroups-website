// Wait until DOM loads
document.addEventListener("DOMContentLoaded", function () {

    /* =========================
    1. Mobile Menu Toggle
    ========================= */

    const navbar = document.getElementById("navbar");
    const navContainer = document.querySelector(".nav-container");
    const overlay = document.getElementById("overlay");

    // Create hamburger
    const menuToggle = document.createElement("div");
    menuToggle.classList.add("menu-toggle");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';

    // Append inside container
    navContainer.appendChild(menuToggle);

    // Open / Close Menu
    menuToggle.addEventListener("click", function () {
        navbar.classList.toggle("active");
        menuToggle.classList.toggle("active");

        if (navbar.classList.contains("active")) {
            menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }

        if (overlay) overlay.classList.toggle("active");
    });

    // Click outside (overlay) → Close
    if (overlay) {
        overlay.addEventListener("click", function () {
            navbar.classList.remove("active");
            overlay.classList.remove("active");
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    }

    // Optional: Close when clicking any menu link
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", function () {
            navbar.classList.remove("active");
            if (overlay) overlay.classList.remove("active");
        });
    });

    const header = document.querySelector(".main-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    /* =========================
    2. Global Theme Sync
    ========================== */

    const body = document.body;
    const toggleBtn = document.getElementById("themeToggle");

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.classList.add("dark");
    } else {
        body.classList.remove("dark");
    }

    if (toggleBtn) {
        const icon = toggleBtn.querySelector(".icon");
        if (body.classList.contains("dark")) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }

        toggleBtn.addEventListener("click", () => {
            body.classList.toggle("dark");
            const isDark = body.classList.contains("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            icon.classList.remove("fa-moon", "fa-sun");
            icon.classList.add(isDark ? "fa-sun" : "fa-moon");
            toggleBtn.classList.add("active");
            setTimeout(() => toggleBtn.classList.remove("active"), 500);
        });
    }

    /* =========================
    3. Smooth Scroll
    ========================== */

    document.querySelectorAll("a[href^='#']").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    /* =========================
    4. Scroll Reveal / Fade-In Animations
    ========================== */

    function revealOnScroll() {
        const reveals = document.querySelectorAll(".reveal, .reveal-zoom");
        reveals.forEach((element) => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const revealPoint = 120;
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add("active");
            }
        });
    }

    const fadeInSections = document.querySelectorAll('.fade-in, .box, .service-card, .value-box, .section-description');
    if (fadeInSections.length > 0) {
        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        fadeInSections.forEach(el => fadeObserver.observe(el));
    }

    window.addEventListener("scroll", revealOnScroll, { passive: true });
    revealOnScroll();

    /* =========================
    5. Active Nav Highlight
    ========================== */

    let currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "") currentPage = "index.html";
    document.querySelectorAll(".nav-links a").forEach(link => {
        let linkPage = link.getAttribute("href").split("/").pop();
        if (linkPage === currentPage) link.classList.add("active");
    });

    /* =========================
    6. Contact Form Submit
    ========================== */

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        const submitBtn = document.getElementById("submitBtn");
        const successMessage = document.getElementById("successMessage");

        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const honeypot = contactForm.querySelector("input[name='website']");
            if (honeypot && honeypot.value.trim() !== "") return;

            const name = contactForm.querySelector("[name='name']").value.trim();
            const email = contactForm.querySelector("[name='email']").value.trim();
            const phone = contactForm.querySelector("[name='phone']").value.trim();
            const service = contactForm.querySelector("[name='service']").value;
            const message = contactForm.querySelector("[name='message']").value.trim();

            if (!name || !email || !phone || !service || !message) {
                alert("Please fill all required fields.");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) { alert("Enter valid email address"); return; }

            const phonePattern = /^[6-9]\d{9}$/;
            if (!phonePattern.test(phone)) { alert("Enter valid 10-digit phone number"); return; }

            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            fetch("https://script.google.com/macros/s/AKfycbxRd896HP8heESP7mbl18NcqqPgHVUZFL677qHA2CXwq8XVWCY01XhV8Fao98e6OAlc/exec", {
                method: "POST", body: formData
            })
            .then(response => { if (!response.ok) throw new Error(); return response.text(); })
            .then(() => {
                contactForm.reset();
                successMessage.classList.add("show");
                setTimeout(() => { successMessage.classList.remove("show"); }, 5000);
            })
            .catch(() => { alert("Submission failed. Try again."); })
            .finally(() => { submitBtn.innerHTML = "Send Message"; submitBtn.disabled = false; });
        });
    }

    /* =========================
    7. Dynamic MCA & ROC Compliance Dates
    ========================== */

    const today = new Date();
    const currentYear = today.getFullYear();
    document.querySelectorAll('.roc-compliance tbody tr').forEach(tr => {
        const tdDate = tr.querySelector('.due-date');
        const spanTag = tr.querySelector('.due-tag');
        if (!tdDate || !spanTag) return;

        const month = parseInt(tdDate.dataset.month);
        const day = parseInt(tdDate.dataset.day);
        let dueDate = new Date(currentYear, month - 1, day);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) { spanTag.textContent = "Overdue"; spanTag.className = "due-tag overdue"; }
        else if (diffDays <= 30) { spanTag.textContent = "Due Soon"; spanTag.className = "due-tag due-soon"; }
        else { spanTag.textContent = "Upcoming"; spanTag.className = "due-tag upcoming"; }

        tdDate.textContent = dueDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    });

   /* =========================
    8. Custom Cursor + Hover Effect
    ========================= */

    // Main cursor
    const cursor = document.createElement("div");
    cursor.classList.add("cursor");
    document.body.appendChild(cursor);

    // Trailing dots
    const trailCount = 6;
    const trails = [];
    for (let i = 0; i < trailCount; i++) {
        const dot = document.createElement("div");
        dot.classList.add("cursor-trail");
        document.body.appendChild(dot);
        trails.push(dot);
    }

    let mouseX = 0, mouseY = 0;
    let posX = Array(trailCount).fill(0);
    let posY = Array(trailCount).fill(0);

    // Mouse follow
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor and trail
    function animateCursor() {
        // main cursor
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";

        // trailing dots
        trails.forEach((dot, i) => {
            // Wave offset for smooth side-to-side motion
            const wave = Math.sin(Date.now() / 200 + i) * 8; // 8px horizontal oscillation

            // Update position with trailing effect
            posX[i] += ((i === 0 ? mouseX : posX[i - 1]) + wave - posX[i]) * 0.15;
            posY[i] += ((i === 0 ? mouseY : posY[i - 1]) - wave - posY[i]) * 0.15;

            // Apply position
            dot.style.left = posX[i] + "px";
            dot.style.top = posY[i] + "px";

            // Scale & fade for depth effect
            const scale = 1 - i * 0.08;            // smaller for farther dots
            const opacity = 0.6 - i * 0.07;       // more transparent for farther dots
            dot.style.transform = `translate(-50%, -50%) scale(${scale})`;
            dot.style.opacity = opacity;
        });

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // ==========================
    // Hover effect for interactive elements
    // ==========================
    const hoverElements = document.querySelectorAll("button, a, .btn-cta, .service-card, .intro-item1-b-b2");

    hoverElements.forEach(el => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
    });
});