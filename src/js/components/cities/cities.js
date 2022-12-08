const cities = document.querySelector('.header__cities');
const citiesInput = document.querySelector('.header__cities-input');
const citiesList = document.querySelector('.header__cities-list');
const citiesItems = [];
let updatedItems = [];
const preloader = document.querySelector('.preloader');
const citiesSave = document.querySelector('.header__cities-save');

async function getCities() {
    const resp = await fetch('https://studika.ru/api/areas', {
        method: 'POST'
    });
    const data = await resp.json();
    data.map((item) => {
        if (item.cities) {
            item.cities.map((city) => citiesItems.push(city.name))
        } else {
            citiesItems.push(item.name);
        }
    });
    preloader.remove();
    makeCities();
    startListenerItems();
}

function makeCities() {
    citiesItems.map((e) => {
        const city = document.createElement('li');
        city.textContent = e;
        city.classList.add('header__cities-item');
        citiesList.append(city);
    })
}

function hasCity() {
    clearUpdatedItems();
    if (citiesInput.value) {
        citiesItems.forEach((e) => {
            if (e.toLowerCase().includes(citiesInput.value)) {
                updatedItems.push(e);
            }
        })
        clearList();
        updatedItems.map((item) => {
            const newItem = document.createElement('li');
            newItem.textContent = item;
            newItem.classList.add('header__cities-item');
            citiesList.append(newItem);
        })
        startListenerItems();
    } else {
        clearList();
        citiesItems.map((item) => {
            const oldItem = document.createElement('li');
            oldItem.classList.add('header__cities-item');
            oldItem.textContent = item;
            citiesList.append(oldItem);
        });
        startListenerItems();
    }
}

function clearList() {
    while (citiesList.firstChild) {
        citiesList.removeChild(citiesList.firstChild);
    }
}

function clearUpdatedItems() {
    updatedItems = [];
}

let timeOut = null;

function startTimeout() {
    timeOut = setTimeout(hasCity, 300);
}

function stopTimeout() {
    clearTimeout(timeOut);
}

function startListenerItems() {
    document.querySelectorAll('.header__cities-item').forEach((e) => {
        e.addEventListener('click', (e) => {
            e.target.classList.toggle('header__cities-item--active');
            if (document.querySelector('.header__cities-item--active') && !document.querySelector('.header__cities-save--active')) {
                citiesSave.classList.add('header__cities-save--active');
                citiesSave.removeAttribute('disabled');
            } else if (!document.querySelector('.header__cities-item--active') && document.querySelector('.header__cities-save--active')) {
                citiesSave.classList.remove('header__cities-save--active');
                citiesSave.setAttribute('disabled', 'disabled');
            }
        })
    })
}

cities.addEventListener('input', stopTimeout);
cities.addEventListener('input', startTimeout);