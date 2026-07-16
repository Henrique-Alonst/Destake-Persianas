// Controle do efeito de mudança de estilo do Header ao rolar a página
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// Controle do Menu de Navegação responsivo (Mobile Burger Menu)
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// Fecha o menu móvel ao clicar em qualquer link de navegação
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
  });
});