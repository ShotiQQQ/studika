const city = document.querySelector('.header__geo');
let isLoaded = false;

function openListCities() {
    city.addEventListener('click', () => {
        cities.classList.toggle('header__cities-active');
        if (!isLoaded) {
            getCities();
            isLoaded = true;
        }
    })
}

openListCities();