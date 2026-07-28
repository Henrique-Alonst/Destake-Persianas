//Menu responsivo
const burger = document.getElementById("burger");
const menu = document.getElementById("nav");

burger.addEventListener("click", () => {
    menu.classList.toggle("active");
});

document.querySelectorAll("#nav a").forEach(link => {

    link.addEventListener("click", () => {

        menu.classList.remove("active");

    });

});

//Scroll 
const header = document.getElementById("header");
const produtos = document.getElementById("produtos");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});
/* Carrossel (depoimentos e projetos) */

function createCarousel({
    trackId,
    dotsId,
    prevId,
    nextId,
    viewDesktop,
    viewMobile,
    breakpoint,
    autoplayDelay
}) {

    const track = document.getElementById(trackId);
    const cards = Array.from(track.children);
    const dotsWrap = document.getElementById(dotsId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);

    let current = 0;
    let autoplayTimer = null;
    let currentOffset = 0;
    let rafId = null;

    function perView() {
        return window.innerWidth <= breakpoint ? viewMobile : viewDesktop;
    }

    function totalPages() {
        return Math.ceil(cards.length / perView());
    }

    function buildDots() {
        dotsWrap.innerHTML = "";
        for (let i = 0; i < totalPages(); i++) {
            const dot = document.createElement("button");
            if (i === current) dot.classList.add("active");
            dot.addEventListener("click", () => {
                goTo(i);
                restartAutoplay();
            });
            dotsWrap.appendChild(dot);
        }
    }

    function updateDots() {
        dotsWrap.querySelectorAll("button").forEach((dot, i) => {
            dot.classList.toggle("active", i === current);
        });
    }

    function updateActiveCards() {
        const view = perView();
        const start = current * view;
        const end = start + view;
        cards.forEach((card, i) => {
            card.classList.toggle("is-active", i >= start && i < end);
        });
    }

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function animateTrackTo(target, duration = 900) {
        cancelAnimationFrame(rafId);
        const start = currentOffset;
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            const eased = easeOutExpo(t);
            const value = start + (target - start) * eased;

            track.style.transform = `translateX(-${value}px)`;
            currentOffset = value;

            if (t < 1) rafId = requestAnimationFrame(step);
        }

        rafId = requestAnimationFrame(step);
    }

    function goTo(page, animate = true) {
        const pages = totalPages();
        const view = perView();

        current = ((page % pages) + pages) % pages;

        const targetIndex = Math.min(current * view, cards.length - 1);
        const offset = cards[targetIndex].offsetLeft;

        if (animate) {
            animateTrackTo(offset);
        } else {
            cancelAnimationFrame(rafId);
            currentOffset = offset;
            track.style.transform = `translateX(-${offset}px)`;
        }

        updateDots();
        updateActiveCards();
    }

    function next() {
        goTo(current + 1);
    }

    function prev() {
        goTo(current - 1);
    }

    function restartAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(next, autoplayDelay);
    }

    nextBtn.addEventListener("click", () => {
        next();
        restartAutoplay();
    });
    prevBtn.addEventListener("click", () => {
        prev();
        restartAutoplay();
    });

    track.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
    track.addEventListener("mouseleave", restartAutoplay);

    // Swipe (touch) com distinção entre gesto horizontal e scroll vertical
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isHorizontalSwipe = null; 

    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        isHorizontalSwipe = null;
        clearInterval(autoplayTimer);
    }, { passive: true });

    track.addEventListener("touchmove", (e) => {
        if (!isDragging) return;

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = startY - currentY;

        if (isHorizontalSwipe === null && (Math.abs(diffX) > 8 || Math.abs(diffY) > 8)) {
            isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
            track.classList.toggle("is-dragging", isHorizontalSwipe);
        }
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove("is-dragging");

        if (isHorizontalSwipe === false) {
            isHorizontalSwipe = null;
            return;
        }

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            diffX > 0 ? next() : prev();
        }

        isHorizontalSwipe = null;
        restartAutoplay();
    });

    let lastWidth = window.innerWidth;
    let resizeTimeout;

    window.addEventListener("resize", () => {
        const newWidth = window.innerWidth;

        if (newWidth === lastWidth) return;
        lastWidth = newWidth;

        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const pages = totalPages();
            current = Math.min(current, pages - 1);

            buildDots();
            goTo(current, false);
        }, 200);
    });

    buildDots();
    goTo(0, false);
    restartAutoplay();
}

createCarousel({
    trackId: "depoimentosTrack",
    dotsId: "depoimentosDots",
    prevId: "depoimentosPrev",
    nextId: "depoimentosNext",
    viewDesktop: 3,
    viewMobile: 1,
    breakpoint: 768,
    autoplayDelay: 6000
});

createCarousel({
    trackId: "projetosTrack",
    dotsId: "projetosDots",
    prevId: "projetosPrev",
    nextId: "projetosNext",
    viewDesktop: 3,
    viewMobile: 1,
    breakpoint: 768,
    autoplayDelay: 4000
});

// Animação Reveal (fade-in ao rolar a página)
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach(el => revealObserver.observe(el));

// Modal de imagem (projetos)
const imgModal = document.getElementById("imgModal");
const imgModalImg = document.getElementById("imgModalImg");
const imgModalClose = document.getElementById("imgModalClose");

document.querySelectorAll(".projeto-card").forEach(card => {
    card.addEventListener("click", () => {
        const img = card.querySelector("img");
        imgModalImg.src = img.src;
        imgModalImg.alt = img.alt;
        imgModal.classList.add("active");
        document.body.style.overflow = "hidden";
    });
});

function closeImgModal() {
    imgModal.classList.remove("active");
    document.body.style.overflow = "";
}

imgModalClose.addEventListener("click", closeImgModal);

imgModal.addEventListener("click", (e) => {
    if (e.target === imgModal) closeImgModal();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeImgModal();
});