// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Close mobile menu after a nav click
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

// Theme toggle with persistence
const root = document.documentElement;
const savedTheme = localStorage.getItem("portfolio-theme");
const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme || (preferredDark ? "dark" : "light");

root.setAttribute("data-theme", initialTheme);
if (themeIcon) {
  themeIcon.textContent = initialTheme === "dark" ? "☀" : "🌙";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
    if (themeIcon) themeIcon.textContent = nextTheme === "dark" ? "☀" : "🌙";
  });
}

// Reveal sections on scroll
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

// Add active state to navbar links based on visible section
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeId = entry.target.getAttribute("id");

      navAnchors.forEach((anchor) => {
        const isActive = anchor.getAttribute("href") === `#${activeId}`;
        anchor.classList.toggle("active-link", isActive);
      });
    });
  },
  {
    threshold: 0.5,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

// Animate mini chart line once on load
const equityCurve = document.getElementById("equityCurve");
if (equityCurve) {
  const pathLength = equityCurve.getTotalLength();
  equityCurve.style.setProperty("--path-length", `${pathLength}`);
  equityCurve.style.strokeDasharray = `${pathLength}`;
  equityCurve.style.strokeDashoffset = `${pathLength}`;
  equityCurve.classList.add("animate");
}

// Footer year keeps itself updated
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear().toString();
}

// Contact form (Formspree) - AJAX submit for clean UX
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const contactSubmit = document.getElementById("contactSubmit");

if (contactForm && formStatus && contactSubmit) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (contactForm.action.includes("YOUR_FORM_ID")) {
      formStatus.classList.add("error");
      formStatus.textContent =
        "Form not configured yet. Replace YOUR_FORM_ID in the form action, or email directly.";
      return;
    }

    formStatus.classList.remove("error");
    formStatus.textContent = "Sending...";
    contactSubmit.setAttribute("disabled", "true");

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      contactForm.reset();
      formStatus.classList.remove("error");
      formStatus.textContent = "Message sent. Thanks — I’ll get back to you soon.";
    } catch {
      formStatus.classList.add("error");
      formStatus.textContent =
        "Something went wrong. Please try again or email me directly at aws.hossain@mail.utoronto.ca.";
    } finally {
      contactSubmit.removeAttribute("disabled");
    }
  });
}
