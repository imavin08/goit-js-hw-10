import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

const refs = {
  inputRef: document.querySelector('#search-box'),
  country: document.querySelector('.country-list'),
  countryBox: document.querySelector('.country-info'),
};

refs.inputRef.addEventListener('input', debounce(OnInput, DEBOUNCE_DELAY));

function OnInput(e) {
  const inputValue = e.target.value.trim();
  if (!inputValue) {
    refs.countryBox.innerHTML = '';
    refs.country.innerHTML = '';
    return;
  }
  fetchCountries(inputValue)
    .then(countries => {
      if (countries.length > 10) {
        return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (countries.length < 10 && countries.length > 1) {
        return renderListCountry(countries);
      } else {
        renderBoxCountryInfo(countries);
      }
    })
    .catch(onFetchError)
    .finally();
}

function renderListCountry(countries) {
  const countryIfo = countries
    .map(({ name, flags }) => {
      return `<li class = "country-item"> <img src="${flags.svg}" alt="флаг страны" width = 25px>  ${name.official}</li>`;
    })
    .join('');
  refs.countryBox.innerHTML = '';
  refs.country.innerHTML = countryIfo;
}

function renderBoxCountryInfo(countries) {
  const boxContent = countries.map(({ name, capital, population, languages, flags }) => {
    const languagesValue = Object.values(languages);
    return `<ul class="box-list">
      <li class="box-item"><img src="${flags.svg}" alt="флаг страны" width = 40><h1>  ${name.official}</h1></li>
      <li class="box-item">Capital: ${capital}</li>
      <li class="box-item">Population: ${population}</li>
      <li class="box-item">Languages: ${languagesValue}</li>
    </ul>`;
  });
  refs.country.innerHTML = '';
  refs.countryBox.innerHTML = boxContent;
}

function onFetchError() {
  return Notiflix.Notify.failure('Oops, there is no country with that name');
}
