const cities = document.querySelector('.header__cities');
const citiesInput = document.querySelector('.header__cities-input');
const citiesList = document.querySelector('.header__cities-list');
const citiesItems = [];
let updatedItems = [];
let checkedItems = [];
const preloader = document.querySelector('.preloader');
const citiesSave = document.querySelector('.header__cities-save');
const citiesChecked = document.querySelector('.header__cities-checked');
const clearInput = document.querySelector('.header__cities-clear');

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
            if (e.toLowerCase().includes(citiesInput.value.toLowerCase())) {
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

function clearingInput() {
    citiesInput.value = '';
    clearInput.classList.remove('header__cities-clear--active');
    hasCity();
}

function showOrHideClearInput() {
    console.log(citiesInput.value.length)
    if (citiesInput.value.length > 0) {
        clearInput.classList.add('header__cities-clear--active');
    } else {
        clearInput.classList.remove('header__cities-clear--active');
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
        e.addEventListener('click', (event) => {
            event.target.classList.toggle('header__cities-item--active');
            if (document.querySelector('.header__cities-item--active') && !document.querySelector('.header__cities-save--active')) {
                citiesSave.classList.add('header__cities-save--active');
                citiesSave.removeAttribute('disabled');
            } else if (!document.querySelector('.header__cities-item--active') && document.querySelector('.header__cities-save--active')) {
                citiesSave.classList.remove('header__cities-save--active');
                citiesSave.setAttribute('disabled', 'disabled');
            }
            document.querySelectorAll('.header__cities-item--checked').forEach((j) => {
                if (j.textContent.toLowerCase() === event.target.textContent.toLowerCase()) {
                    j.remove();
                }
            })
        })
    })
    addToChecked();
}

function addToChecked() {
    document.querySelectorAll('.header__cities-item').forEach((e) => {
        e.addEventListener('click', (e) => {
            document.querySelectorAll('.header__cities-item--active').forEach((event) => {
                if (event.textContent.toLowerCase() === e.target.textContent.toLowerCase()) {
                    const checkedItem = document.createElement('li');
                    checkedItem.classList.add('header__cities-item');
                    checkedItem.classList.add('header__cities-item--checked');
                    checkedItem.textContent = e.target.textContent;
                    checkedItems.push(checkedItem.textContent);
                    citiesChecked.append(checkedItem);
                    checkedItem.addEventListener('click', (event) => {
                        document.querySelectorAll('.header__cities-item').forEach((e) => {
                            if (checkedItem.textContent.toLowerCase() === e.textContent.toLowerCase()) {
                                e.classList.remove('header__cities-item--active');
                            }
                        })
                        event.target.remove();
                        if (!document.querySelector('.header__cities-item--checked')) {
                            citiesSave.classList.remove('header__cities-save--active');
                            citiesSave.setAttribute('disabled', 'disabled');
                        }
                    })
                }
            })
        })
    })    
}

async function sendAPI() {
    const resp = await fetch('https://studika.ru/api/areas', {
        method: 'POST',
        body: JSON.stringify(updatedItems),
        headers: {
            Authorization: '',
            'Content-type': 'application/json',
        }
    });
    const answer = await resp.json();
    return answer;
}

function sendCookie() {
    document.cookie = `cities=${updatedItems}`;
}

clearInput.addEventListener('click', clearingInput);
citiesInput.addEventListener('input', showOrHideClearInput);
citiesInput.addEventListener('input', stopTimeout);
citiesInput.addEventListener('input', startTimeout);