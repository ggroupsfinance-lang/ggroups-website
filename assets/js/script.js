// Wait until DOM loads
document.addEventListener("DOMContentLoaded", function () {

    /* =========================
    Mobile Menu Toggle
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
            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars"></i>';
            overlay.classList.remove("active");
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

  // ==============================
    // Global Theme Sync (All Pages)
    // ==============================

    const body = document.body;
    const toggleBtn = document.getElementById("themeToggle");

    // 1. Get saved theme
    const savedTheme = localStorage.getItem("theme");

    // 2. Apply saved theme
    if (savedTheme === "dark") {
        body.classList.add("dark");
    } else {
        body.classList.remove("dark");
    }

    // 3. Handle toggle button
    if (toggleBtn) {
        const icon = toggleBtn.querySelector(".icon");

        // Set correct icon on page load
        if (body.classList.contains("dark")) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }

        // 4. Toggle on click
        toggleBtn.addEventListener("click", () => {
            body.classList.toggle("dark");

            const isDark = body.classList.contains("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");

            icon.classList.remove("fa-moon", "fa-sun");
            icon.classList.add(isDark ? "fa-sun" : "fa-moon");

            // Add rotate animation
            toggleBtn.classList.add("active");
            setTimeout(() => toggleBtn.classList.remove("active"), 500);
        });
    }

    /* =========================
       2. Smooth Scroll
    ========================== */
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    /* =========================
    Scroll Reveal Animation
    ========================= */

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
 /* =========================
          3. Fade In Animation
 ========================== */

    const fadeInSections = document.querySelectorAll('.fade-in, .box, .service-card, .value-box, .section-description');

        if (fadeInSections.length > 0) {

            const fadeObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('show');
                        observer.unobserve(entry.target); // animate once only
                    }
                });
            }, {
                threshold: 0.15
            });

            fadeInSections.forEach(el => fadeObserver.observe(el));
        }   


    /* =========================
    4. Active Nav Highlight
    ========================= */

    let currentPage = window.location.pathname.split("/").pop();

    // If URL ends with "/", treat it as index.html
    if (currentPage === "") currentPage = "index.html";

    document.querySelectorAll(".nav-links a").forEach(link => {
        let linkPage = link.getAttribute("href").split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });


  /* =========================
    5. Contact Form Submit
    ========================= */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {

        const submitBtn = document.getElementById("submitBtn");
        const successMessage = document.getElementById("successMessage");

        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            /* =====================
            Honeypot Spam Check
            ===================== */
            const honeypot =
                contactForm.querySelector("input[name='website']");

            if (honeypot && honeypot.value.trim() !== "") {
                console.warn("🚫 Spam detected");
                return;
            }

            /* =====================
            Get Values
            ===================== */
            const name =
                contactForm.querySelector("[name='name']").value.trim();

            const email =
                contactForm.querySelector("[name='email']").value.trim();

            const phone =
                contactForm.querySelector("[name='phone']").value.trim();

            const service =
                contactForm.querySelector("[name='service']").value;

            const message =
                contactForm.querySelector("[name='message']").value.trim();

            /* =====================
            Validation
            ===================== */
            if (!name || !email || !phone || !service || !message) {
                alert("Please fill all required fields.");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Enter valid email address");
                return;
            }

            const phonePattern = /^[6-9]\d{9}$/;
            if (!phonePattern.test(phone)) {
                alert("Enter valid 10-digit phone number");
                return;
            }

            /* =====================
            Loading State
            ===================== */
            submitBtn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            submitBtn.disabled = true;

            const formData = new FormData(contactForm);

            /* =====================
            Send to Google Sheet
            ===================== */
            fetch("https://script.google.com/macros/s/AKfycbxRd896HP8heESP7mbl18NcqqPgHVUZFL677qHA2CXwq8XVWCY01XhV8Fao98e6OAlc/exec", {
                method: "POST",
                body: formData
            })
            .then(response => {
                if (!response.ok) throw new Error();
                return response.text();
            })
            .then(() => {

                /* ✅ Reset Form */
                contactForm.reset();

                /* ✅ SHOW SUCCESS ANIMATION */
                successMessage.classList.add("show");

                /* ✅ Auto Hide */
                setTimeout(() => {
                    successMessage.classList.remove("show");
                }, 5000);

            })
            .catch(() => {
                alert("Submission failed. Try again.");
            })
            .finally(() => {

                submitBtn.innerHTML = "Send Message";
                submitBtn.disabled = false;

            });
        });
    }
    /* =========================
    6. Dynamic MCA & ROC Compliance Dates & Status
    ========================= */

    const today = new Date();
    const currentYear = today.getFullYear();

    document.querySelectorAll('.roc-compliance tbody tr').forEach(tr => {
        const tdDate = tr.querySelector('.due-date');
        const spanTag = tr.querySelector('.due-tag');

        if (!tdDate || !spanTag) return;

        const month = parseInt(tdDate.dataset.month);
        const day = parseInt(tdDate.dataset.day);

        // Base due date this year
        let dueDate = new Date(currentYear, month - 1, day);

        // Calculate diffDays for status
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        // Decide status & color
        if (diffDays < 0) {
            spanTag.textContent = "Overdue";
            spanTag.className = "due-tag overdue";  // RED
        } else if (diffDays <= 30) {
            spanTag.textContent = "Due Soon";
            spanTag.className = "due-tag due-soon"; // ORANGE
        } else {
            spanTag.textContent = "Upcoming";
            spanTag.className = "due-tag upcoming"; // BLUE
        }

        // Always show formatted date
        tdDate.textContent = dueDate.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    });
    window.addEventListener("scroll", revealOnScroll, {
        passive: true
    });
    revealOnScroll(); // first load ki

});