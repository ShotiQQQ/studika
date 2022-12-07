const burger = document.querySelector('.header__burger');
const mobileMenu = document.querySelector('.header__mobile');
const closeMobileMenu = document.querySelector('.header__mobile-close');
const listOfLinks = document.querySelectorAll('.header__link-mobile');

burger.addEventListener('click', () => {
    mobileMenu.classList.add('header__mobile-active');
});

closeMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('header__mobile-active');
});

listOfLinks.forEach((e) => {
    e.addEventListener('click', () => {
        mobileMenu.classList.remove('header__mobile-active');
    })
});

