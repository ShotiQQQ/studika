document.addEventListener('DOMContentLoaded', () => {
    const city = document.querySelector('.header__geo');
    const citySpan = document.querySelector('.header__geo-text');
    let isLoaded = false;
    let cityText = '';

    function openListCities() {
        city.addEventListener('click', () => {
            cities.classList.toggle('header__cities-active');
            if (!isLoaded) {
                getCities();
                isLoaded = true;
            }
        })
    }

    function clickSave() {
        citiesSave.addEventListener('click', () => {
            cityText = '';
            citySpan.textContent = cityText;
            updatedItems = [];
            document.querySelectorAll('.header__cities-item--checked').forEach((e) => {
                cityText += `${e.textContent}, `;
                updatedItems.push(e.textContent);
            });
            cityText = cityText.slice(0, -2);
            citySpan.textContent = cityText;
            if (!document.querySelector('.header__cities-item--checked')) {
                citySpan.textContent = 'Любой регион';
            }
            cities.classList.remove('header__cities-active');
            sendCookie();
            sendAPI();
        })
    }

    openListCities();
    clickSave();
})