document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // ELEMENTS
    // =========================

    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelectorAll(".nav-link");
    const backTop = document.getElementById("backTop");
    const currentYear = document.getElementById("currentYear");

    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");


    // =========================
    // CURRENT YEAR
    // =========================

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    // =========================
    // MOBILE MENU
    // =========================

    function closeMenu() {
        if (!navbar || !menuToggle) return;

        navbar.classList.remove("active");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
    }


    if (menuToggle && navbar) {

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", (event) => {

            event.stopPropagation();

            const isOpen = navbar.classList.contains("active");

            navbar.classList.toggle("active");
            menuToggle.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );
        });
    }


    // Close menu after clicking a navigation link

    navLinks.forEach((link) => {

        link.addEventListener("click", () => {
            closeMenu();
        });

    });


    // Close menu when clicking outside

    document.addEventListener("click", (event) => {

        if (!navbar || !menuToggle) return;

        if (
            navbar.classList.contains("active") &&
            !navbar.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }

    });


    // Close menu with Escape key

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeMenu();
        }

    });


    // =========================
    // HEADER SCROLL EFFECT
    // =========================

    function handleHeader() {

        if (!header) return;

        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

    handleHeader();

    window.addEventListener(
        "scroll",
        handleHeader,
        { passive: true }
    );


    // =========================
    // SMOOTH SCROLL
    // =========================

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                10;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });


    // =========================
    // ACTIVE NAVIGATION
    // =========================

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    if ("IntersectionObserver" in window) {

        const sectionObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            navLinks.forEach((link) => {

                                const linkTarget =
                                    link.getAttribute("href");

                                link.classList.toggle(
                                    "active",
                                    linkTarget ===
                                    `#${entry.target.id}`
                                );

                            });

                        }

                    });

                },
                {
                    rootMargin: "-100px 0px -55% 0px",
                    threshold: 0
                }
            );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });

    }


    // =========================
    // SCROLL REVEAL ANIMATION
    // =========================

    const revealElements = document.querySelectorAll(
        ".section-heading, " +
        ".about-grid, " +
        ".service-card, " +
        ".project-card, " +
        ".process-step, " +
        ".why-item, " +
        ".contact-grid, " +
        ".cta-container"
    );


    // Add reveal class

    revealElements.forEach((element, index) => {

        element.classList.add("reveal");

        element.style.transitionDelay =
            `${Math.min(index * 50, 300)}ms`;

    });


    // Create animation CSS

    const animationStyle =
        document.createElement("style");

    animationStyle.textContent = `

        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition:
                opacity 0.7s ease,
                transform 0.7s ease;
        }

        .reveal.visible {
            opacity: 1;
            transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {

            .reveal {
                opacity: 1;
                transform: none;
                transition: none;
            }

        }

    `;

    document.head.appendChild(animationStyle);


    // Start reveal observer

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {

            element.classList.add("visible");

        });

    }


    // =========================
    // BACK TO TOP
    // =========================

    if (backTop) {

        backTop.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    // =========================
    // CONTACT FORM
    // =========================

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const name =
                    document.getElementById("name")?.value.trim();

                const email =
                    document.getElementById("email")?.value.trim();

                const service =
                    document.getElementById("service")?.value;

                const message =
                    document.getElementById("message")?.value.trim();


                // Check required fields

                if (
                    !name ||
                    !email ||
                    !service ||
                    !message
                ) {

                    if (formMessage) {

                        formMessage.textContent =
                            "Please fill in all fields.";

                    }

                    return;
                }


                // Check email

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(email)) {

                    if (formMessage) {

                        formMessage.textContent =
                            "Please enter a valid email address.";

                    }

                    return;
                }


                // Prepare email

                const subject =
                    encodeURIComponent(
                        `New Project Inquiry - ${service}`
                    );


                const body =
                    encodeURIComponent(
`
Hello MarathTech Solutions,

Name: ${name}
Email: ${email}
Service: ${service}

Project Details:
${message}

Sent from the MarathTech Solutions website.
`
                    );


                if (formMessage) {

                    formMessage.textContent =
                        "Opening your email app...";

                }


                // Open user's email application

                window.location.href =
                    `mailto:marathtechsolutions@gmail.com?subject=${subject}&body=${body}`;

            }
        );

    }


    // =========================
    // ESC KEY SAFETY
    // =========================

    window.addEventListener("resize", () => {

        if (window.innerWidth > 760) {
            closeMenu();
        }

    });


});