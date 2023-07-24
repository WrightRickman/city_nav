
// Set global variables for container/line
const navContainer = document.getElementById('nav__list');
const activeLine = document.getElementById('line--active');

let timezones = [];

// Fetch list of cities in JSON format
async function fetchData() {
  const citiesUrl = './navigation.json';

  // List if IANA timeones
  const timezoneUrl = 'http://worldtimeapi.org/api/timezone';

  try {
    const responses = await Promise.all([fetch(citiesUrl), fetch(timezoneUrl)]);

    const citiesData = await responses[0].json();
    const timezoneData = await responses[1].json();

    return [citiesData, timezoneData];
  } catch (error) {
    console.error(error);
  }
}

function setTime(label) {
  let timezone = '';

  switch(label) {
    case 'Cupertino':
      timezone = 'America/Los_Angeles';
      break;
    case 'Amsterdam':
      timezone = 'CET';
      break;
    default:
      timezone = timezones.filter((str) => str.includes(label))[0];
  }

  const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: timezone });

  return time;
}

function updateTime() {
  const clocks = document.getElementsByClassName('clock');

  for (clock of clocks) {
    let section = clock.getAttribute('data-label');
    let newTime = setTime(section);

    clock.innerText = newTime;
  };
}

// Build navigation based on JSON list of cities
async function buildCitiesNav() {
  const data = await fetchData();

  const cities = data[0]['cities'];
  timezones = data[1];

  let html = '';

  cities.forEach((city) => {
    let cleanLabel = city['label'].replace(/\s/g, '_').replace('_City', '');

    let time = setTime(cleanLabel);

    let navItem = `<li class="nav__item">
                     <a href="#" class="nav__link">${ city.label }</a>
                     <span class="clock" data-label="${ cleanLabel }">${ time }</span>
                   </li>`;

    html += navItem;
  });

  navContainer.innerHTML = html;
}

const changeSize = (element) => {
  const textWidth = element.clientWidth;
  activeLine.style.width = `${ textWidth }px`;
};

const changePosition = (element) => {
  const elementCoords = element.offsetLeft;
  activeLine.style.transform = `translateX(${ elementCoords }px)`;
}

async function setUpEvents() {
  navContainer.addEventListener('click', (event) => {
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

  window.addEventListener('resize' , (event) => {
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

  navToggle.addEventListener('click', (event) => {
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

buildCitiesNav()
  .then(setUpEvents)
  .then(() => { 
    window.setInterval(updateTime, 1000); 
  });