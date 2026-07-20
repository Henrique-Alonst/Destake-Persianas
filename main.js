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

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});