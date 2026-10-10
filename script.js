/* =========================================
   NAFIS MAHMUD NIROB — PORTFOLIO SCRIPT
   Countdown • Animations • Navigation
   Scroll Effects • Interactive Features
========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. LAUNCH SCREEN & COUNTDOWN
    // =====================================

    const splash = document.querySelector("#splash-screen");
    const enterButton = document.querySelector("#splash-enter");
    const countNumber = document.querySelector("#count-number");
    const timerProgress = document.querySelector(".timer-progress");

    let countdownTimer = null;
    let countdown = 3;
    let portfolioOpened = false;

    function updateCountdownDisplay(value) {
        if (countNumber) {
            countNumber.textContent = value;
            countNumber.classList.remove("count-pop");

            // Restart the number animation
            void countNumber.offsetWidth;
            countNumber.classList.add("count-pop");
        }

        if (timerProgress) {
            timerProgress.style.setProperty(
                "--countdown-progress",
                `${((3 - value) / 3) * 100}%`
            );

            timerProgress.style.setProperty(
                "--progress",
                `${((3 - value) / 3) * 100}%`
            );
        }
    }

    function openPortfolio() {
        if (portfolioOpened) return;
        portfolioOpened = true;

        clearInterval(countdownTimer);

        if (splash) {
            splash.classList.add("splash-exit");
            splash.setAttribute("aria-hidden", "true");

            document.body.classList.remove("loading");
            document.body.style.overflow = "";

            // Remove the splash after its exit animation
            window.setTimeout(() => {
                splash.hidden = true;
                splash.style.display = "none";
            }, 750);
        }

        window.dispatchEvent(new Event("portfolio:ready"));
    }

    function startCountdown() {
        if (!splash || portfolioOpened) return;

        clearInterval(countdownTimer);

        countdown = 3;
        updateCountdownDisplay(countdown);

        const startTime = Date.now();
        const duration = 3000;

        countdownTimer = window.setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(
                0,
                Math.ceil((duration - elapsed) / 1000)
            );

            if (remaining !== countdown) {
                countdown = remaining;
                updateCountdownDisplay(countdown);
            }

            if (elapsed >= duration) {
                openPortfolio();
            }
        }, 80);
    }

    if (splash) {
        document.body.classList.add("loading");

        // Keep the background page from scrolling
        document.body.style.overflow = "hidden";

        // Respect users who prefer reduced motion
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            openPortfolio();
        } else {
            startCountdown();
        }
    }

    // Clicking the launch button enters immediately
    if (enterButton) {
        enterButton.addEventListener("click", openPortfolio);
    }

    // Escape can dismiss the launch screen
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && splash && !portfolioOpened) {
            openPortfolio();
        }
    });


    // =====================================
    // 2. MOBILE NAVIGATION
    // =====================================

    const menuToggle = document.querySelector(
        ".menu-toggle, #menu-toggle, .nav-toggle"
    );

    const navigation = document.querySelector(
        ".nav-links, .navbar-links, #nav-links"
    );

    function closeMenu() {
        if (!menuToggle || !navigation) return;

        menuToggle.classList.remove("active");
        navigation.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    if (menuToggle && navigation) {
        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", (event) => {
            if (
                !navigation.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });
    }


    // =====================================
    // 3. SCROLL REVEAL ANIMATIONS
    // =====================================

    const revealElements = document.querySelectorAll(
        ".reveal, [data-reveal]"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        entry.target.classList.add("revealed");

                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible", "revealed");
        });
    }


    // =====================================
    // 4. NAVBAR SCROLL EFFECT
    // =====================================

    const navbar = document.querySelector(
        ".navbar, nav, #navbar"
    );

    let scrollTicking = false;

    function updateScrollEffects() {
        const scrollY = window.scrollY;

        if (navbar) {
            navbar.classList.toggle("scrolled", scrollY > 30);
        }

        const scrollProgress = document.querySelector(
            "#scroll-progress, .scroll-progress"
        );

        if (scrollProgress) {
            const scrollableHeight =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const percentage = scrollableHeight > 0
                ? (scrollY / scrollableHeight) * 100
                : 0;

            scrollProgress.style.width = `${percentage}%`;
        }

        const backToTop = document.querySelector(
            "#back-to-top, .back-to-top"
        );

        if (backToTop) {
            backToTop.classList.toggle("visible", scrollY > 400);
            backToTop.setAttribute(
                "aria-hidden",
                String(scrollY <= 400)
            );
        }

        scrollTicking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(updateScrollEffects);
                scrollTicking = true;
            }
        },
        { passive: true }
    );

    updateScrollEffects();


    // =====================================
    // 5. BACK-TO-TOP BUTTON
    // =====================================

    document.querySelectorAll(
        "#back-to-top, .back-to-top"
    ).forEach((button) => {
        button.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth"
            });
        });
    });


    // =====================================
    // 6. AUTOMATIC COPYRIGHT YEAR
    // =====================================

    document.querySelectorAll(
        "#year, #current-year, [data-current-year]"
    ).forEach((element) => {
        element.textContent = new Date().getFullYear();
    });


    // =====================================
    // 7. ACTIVE NAVIGATION LINK
    // =====================================

    const sectionLinks = document.querySelectorAll(
        'nav a[href^="#"], .nav-links a[href^="#"]'
    );

    const sections = Array.from(sectionLinks)
        .map((link) => {
            const id = link.getAttribute("href");

            if (!id || id === "#") return null;

            return document.querySelector(id);
        })
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    sectionLinks.forEach((link) => {
                        const active =
                            link.getAttribute("href") ===
                            `#${entry.target.id}`;

                        link.classList.toggle("active", active);

                        if (active) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    // =====================================
    // 8. COPY EMAIL TO CLIPBOARD
    // =====================================

    document.querySelectorAll(
        "[data-copy-email], .copy-email"
    ).forEach((button) => {
        button.addEventListener("click", async () => {
            const email =
                button.dataset.copyEmail ||
                button.textContent.trim();

            if (!email || !navigator.clipboard) {
                return;
            }

            try {
                await navigator.clipboard.writeText(email);

                const originalText = button.textContent;
                button.textContent = "Copied! ✓";

                window.setTimeout(() => {
                    button.textContent = originalText;
                }, 1800);
            } catch (error) {
                console.error("Could not copy email:", error);
            }
        });
    });


    // =====================================
    // 9. IMAGE LOADING & FALLBACK
    // =====================================

    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("error", () => {
            img.classList.add("image-load-error");
        }, { once: true });

        if (img.complete && img.naturalWidth === 0 && img.src) {
            img.classList.add("image-load-error");
        }
    });


    // =====================================
    // 10. CURRENT PAGE READY
    // =====================================

    document.documentElement.classList.add("js-enabled");

    console.log(
        "%cWelcome to Nafis Mahmud Nirob's Portfolio 🚀",
        "color:#8b9cff;font-size:14px;font-weight:bold;"
    );

}); 
