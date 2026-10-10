const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

const roles = [
  "Web Developer",
  "Data Science Enthusiast",
  "Tech Internship Candidate",
];

const typingText = document.getElementById("typing-text");

if (typingText) {
  let roleIndex = 0;

  const rotateRole = () => {
    roleIndex = (roleIndex + 1) % roles.length;
    typingText.textContent = roles[roleIndex];
  };

  window.setInterval(rotateRole, 2200);
}

const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const track = carousel.querySelector("[data-track]");
  const viewport = carousel.querySelector("[data-viewport]");
  const prevButton = carousel.querySelector(".prev");
  const nextButton = carousel.querySelector(".next");
  const dotsContainer = document.querySelector("[data-dots]");
  const slides = Array.from(track.children);
  const autoAdvanceMs = 3000;

  let currentIndex = 0;
  let startX = 0;
  let currentTranslate = 0;
  let previousTranslate = 0;
  let isDragging = false;
  let autoTimer;

  const clampIndex = (index) => {
    if (index < 0) return slides.length - 1;
    if (index >= slides.length) return 0;
    return index;
  };

  const buildDots = () => {
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to project ${index + 1}`);
      dot.addEventListener("click", () => {
        goTo(index);
        restartAutoAdvance();
      });
      dotsContainer.appendChild(dot);
    });
  };

  const updateDots = () => {
    Array.from(dotsContainer.children).forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  };

  const slideWidth = () => viewport.clientWidth;

  const setTrackPosition = (translateX, animate = true) => {
    track.style.transition = animate
      ? "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";
    track.style.transform = `translateX(${translateX}px)`;
  };

  const goTo = (index, animate = true) => {
    currentIndex = clampIndex(index);
    previousTranslate = -slideWidth() * currentIndex;
    currentTranslate = previousTranslate;
    setTrackPosition(currentTranslate, animate);
    updateDots();
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  const startAutoAdvance = () => {
    autoTimer = window.setInterval(next, autoAdvanceMs);
  };

  const stopAutoAdvance = () => {
    window.clearInterval(autoTimer);
  };

  const restartAutoAdvance = () => {
    stopAutoAdvance();
    startAutoAdvance();
  };

  const pointerDown = (clientX) => {
    isDragging = true;
    startX = clientX;
    viewport.classList.add("dragging");
    stopAutoAdvance();
  };

  const pointerMove = (clientX) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    currentTranslate = previousTranslate + deltaX;
    setTrackPosition(currentTranslate, false);
  };

  const pointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove("dragging");
    const movedBy = currentTranslate - previousTranslate;

    if (movedBy < -70) {
      next();
    } else if (movedBy > 70) {
      prev();
    } else {
      goTo(currentIndex);
    }

    restartAutoAdvance();
  };

  buildDots();
  goTo(0, false);
  startAutoAdvance();

  nextButton?.addEventListener("click", () => {
    next();
    restartAutoAdvance();
  });

  prevButton?.addEventListener("click", () => {
    prev();
    restartAutoAdvance();
  });

  viewport.addEventListener("mousedown", (event) => pointerDown(event.clientX));
  viewport.addEventListener("mousemove", (event) => pointerMove(event.clientX));
  viewport.addEventListener("mouseup", pointerUp);
  viewport.addEventListener("mouseleave", pointerUp);

  viewport.addEventListener(
    "touchstart",
    (event) => pointerDown(event.touches[0].clientX),
    { passive: true }
  );
  viewport.addEventListener(
    "touchmove",
    (event) => pointerMove(event.touches[0].clientX),
    { passive: true }
  );
  viewport.addEventListener("touchend", pointerUp);

  window.addEventListener("resize", () => goTo(currentIndex, false));
  window.addEventListener("blur", stopAutoAdvance);
  window.addEventListener("focus", restartAutoAdvance);
}
