import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchInput = document.querySelector('.search-form__input');
const searchButton = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
let numberOfPage = 1;

const APISearching = {
  accesKey: '33087074-fea826eb02b341782481a92ce',
  perPage: 40,
  safeSearch: true,
  type: 'image',
  orientation: 'horizontal',
};

const lightbox = new SimpleLightbox('.gallery a');

const createPhotos = image => {
  gallery.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
      <a href="${image.largeImageURL}">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${image.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${image.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${image.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${image.downloads}
      </p>
    </div>
  </div>`
  );
};

const getPhotos = async (searchValue, pageNumber) => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${APISearching.accesKey}&q=${searchValue}&image_type=${APISearching.type}&orientation=${APISearching.orientation}&safesearch=${APISearching.safeSearch}&per_page=${APISearching.perPage}&page=${pageNumber}`
    );
    const data = response.data.hits;
    data.forEach(image => {
      createPhotos(image);
    });
    lightbox.refresh();
    if (response.data.hits.length > 0) {
      Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    }
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 0.5,
      behavior: 'smooth',
    });
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

searchButton.addEventListener('submit', event => {
  gallery.innerHTML = '';
  event.preventDefault();
  if (searchInput.value == '') {
    return;
  } else {
    numberOfPage = 1;
    getPhotos(searchInput.value.trim(), numberOfPage);
  }
});

window.addEventListener('scroll', () => {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    numberOfPage++;
    getPhotos(searchInput.value.trim(), numberOfPage);
  }
});
