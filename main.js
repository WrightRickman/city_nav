const navContainer = document.getElementById('nav__list');
const activeLine = document.getElementById('line--active');

// Append list of cities from JSON

async function fetchCities() {
  let url = './navigation.json';

  try {
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error(error);
  }
}

async function buildCitiesNav() {
  const citiesData = await fetchCities();
  const cities = citiesData['cities'];

  let html = '';

  cities.forEach(city => {
    let navItem = `<li class="nav__item">
                     <a href="#" class="nav__link">${ city.label }</a>
                   </li>`;

    html += navItem;
  });

  navContainer.innerHTML = html;
}

const changeSize = element => {
  const textWidth = element.clientWidth;
  activeLine.style.width = `${ textWidth }px`;
};

const changePosition = element => {
  const elementCoords = element.offsetLeft;
  activeLine.style.transform = `translateX(${ elementCoords }px)`;
}

async function setUpEvents() {
  navContainer.addEventListener('click', event => {
    const element = event.target;

    if (element.classList.contains('nav__link')) {
      changeSize(element);
      changePosition(element);

      // Remove active class and aria-selected from other elements and add to selected element
      for (el of document.getElementsByClassName('active')) {
        el.classList.remove('active');
        el.ariaSelected = false;
      }

      element.classList.add('active');
      element.ariaSelected = true;
    }
  });

  window.addEventListener('resize' , event => {
    const active = document.getElementsByClassName('active')[0];

    if (active) {
      changeSize(active);
      changePosition(active);
    }

    // Reset the menu when enlarging the screen
    if (window.innerWidth > 834) {
      nav.classList.remove('opened');
      navToggle.classList.remove('opened');
      navToggle.innerText = 'Menu';
    }
  });

  // Handle mobile nav open/close
  const navToggle = document.getElementById('nav-toggle');

  navToggle.addEventListener('click', event => {
    if (navToggle.classList.contains('opened')) {
      navToggle.classList.remove('opened');
      navToggle.innerText = 'Menu';

      navContainer.classList.remove('opened');
      navContainer.ariaExpanded = false;
      navContainer.ariaHidden = true;
    } else {
      navToggle.classList.add('opened');
      navToggle.innerText = 'Close';

      navContainer.classList.add('opened');
      navContainer.ariaExpanded = true;
      navContainer.ariaHidden = false;
    }
  });
}

buildCitiesNav().then(setUpEvents);