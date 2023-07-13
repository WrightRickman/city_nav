const timezones = {
  'cupertino': {
    'timezone': 'America/Los_Angeles'
  },
  'new-york-city': {
    'timezone': 'America/New_York'
  },
  'london': {
    'timezone': 'Europe/London'
  },
  'amsterdam': {
    'timezone': 'Europe/Amsterdam'
  },
  'tokyo': {
    'timezone': 'Asia/Tokyo'
  },
  'hong-kong': {
    'timezone': 'Asia/Hong_Kong'
  },
  'sydney': {
    'timezone': 'Australia/Sydney'
  }
};

// Append list of cities from JSON

async function fetchJSON() {
  const response = await fetch('./navigation.json', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  const jsonData = await response.json();
  const cities = jsonData['cities'];

  return cities;
}

function buildNav(cities) {
  const nav = document.getElementById('nav__list');
  const activeLine = document.getElementById('line--active');

  for (let i = 0; i < cities.length; i++) {
    let time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: timezones[cities[i].section].timezone });

    // let navItem = `<li class="nav__item">
    //                  <a href="#" class="nav__link">${ cities[i].label }</a>
    //                  <span class="time">${ time }</span>
    //                </li>`;

    let navItem = `<li class="nav__item">
                     <a href="#" class="nav__link">${ cities[i].label }</a>
                   </li>`;

    nav.insertAdjacentHTML('beforeend', navItem);

    nav.addEventListener('click', event => {
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

    const changeSize = element => {
      const textWidth = element.offsetWidth;
      activeLine.style.width = `${ textWidth }px`;
    };

    const changePosition = element => {
      // Get coordinates for clicked element and compensate for nav max-width
      const elementCoords = element.getBoundingClientRect();
      const navCoords = document.getElementById('nav').getBoundingClientRect();
      const lineCoords = elementCoords.left - navCoords.left;

      console.log(element.getBoundingClientRect());

      activeLine.style.transform = `translateX(${ lineCoords }px)`;
    }

    // Handle resize event (updates the active line size/position)
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
  }

  // Handle mobile nav open/close
  const navToggle = document.getElementById('nav-toggle');

  navToggle.addEventListener('click', event => {

    if (navToggle.classList.contains('opened')) {
      navToggle.classList.remove('opened');
      navToggle.innerText = 'Menu';

      nav.classList.remove('opened');
      nav.ariaExpanded = false;
      nav.ariaHidden = true;
    } else {
      navToggle.classList.add('opened');
      navToggle.innerText = 'Close';

      nav.classList.add('opened');
      nav.ariaExpanded = true;
      nav.ariaHidden = false;
    }
  });
}

fetchJSON().then(cities => {
  console.log(cities);
});