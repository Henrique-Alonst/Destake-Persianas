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

const header = document.getElementById("header");
const produtos = document.getElementById("produtos");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});

/* =========================
   CARROSSEL DEPOIMENTOS
========================= */

const track = document.getElementById("depoimentosTrack");
const cards = Array.from(track.children);
const dotsWrap = document.getElementById("depoimentosDots");
const prevBtn = document.getElementById("depoimentosPrev");
const nextBtn = document.getElementById("depoimentosNext");

let current = 0;
let autoplayTimer = null;
const AUTOPLAY_DELAY = 6000;


/* quantos cards aparecem por vez */

function perView(){
    return window.innerWidth <= 768 ? 1 : 3;
}


/* quantas páginas o carrossel tem no total */

function totalPages(){
    return Math.ceil(cards.length / perView());
}


/* cria os dots do zero, sempre em número correto */

function buildDots(){

    dotsWrap.innerHTML = "";

    for(let i = 0; i < totalPages(); i++){

        const dot = document.createElement("button");

        if(i === current){
            dot.classList.add("active");
        }

        dot.addEventListener("click", () => {
            goTo(i);
            restartAutoplay();
        });

        dotsWrap.appendChild(dot);

    }

}


function updateDots(){

    dotsWrap.querySelectorAll("button").forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
    });

}


/* aplica destaque (opacidade/escala) só nos cards da página atual */

function updateActiveCards(){

    const view = perView();
    const start = current * view;
    const end = start + view;

    cards.forEach((card, i) => {
        card.classList.toggle("is-active", i >= start && i < end);
    });

}


/* move o track até a posição REAL do card no DOM (offsetLeft em px).
   Isso é o que garante o encaixe perfeito, sem cortes, não importa
   o gap ou o número de cards por página */

function goTo(page){

    const pages = totalPages();
    const view = perView();

    current = ((page % pages) + pages) % pages;

    const targetIndex = Math.min(current * view, cards.length - 1);
    const offset = cards[targetIndex].offsetLeft;

    track.style.transform = `translateX(-${offset}px)`;

    updateDots();
    updateActiveCards();

}


function next(){
    goTo(current + 1);
}

function prev(){
    goTo(current - 1);
}


/* autoplay */

function restartAutoplay(){
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
}


/* setas */

nextBtn.addEventListener("click", () => {
    next();
    restartAutoplay();
});

prevBtn.addEventListener("click", () => {
    prev();
    restartAutoplay();
});


/* pausa ao passar o mouse */

track.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
track.addEventListener("mouseleave", restartAutoplay);


/* swipe no mobile */

let startX = 0;
let isDragging = false;

track.addEventListener("touchstart", (e) => {

    startX = e.touches[0].clientX;
    isDragging = true;

    clearInterval(autoplayTimer);

}, { passive: true });


track.addEventListener("touchend", (e) => {

    if(!isDragging) return;

    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if(Math.abs(diff) > 40){
        diff > 0 ? next() : prev();
    }

    restartAutoplay();

});


/* redimensionamento — a posição em pixels muda com o tamanho
   da tela, então recalcula tudo do zero */

let resizeTimeout;

window.addEventListener("resize", () => {

    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {

        current = 0;
        buildDots();
        goTo(0);

    }, 200);

});


/* inicialização */

buildDots();
goTo(0);
restartAutoplay();