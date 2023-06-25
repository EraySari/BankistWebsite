'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const sectionAll = document.querySelectorAll('.section');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // console.log('Current scroll(x/y)', window.pageXOffset, window.pageYOffset);
  // console.log(
  //   'height/width viewport: ',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // ); //verilen coords'a yollar

  //Oldschool
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //new
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Event Delegation
////////////////////////////////////////
//Page Navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//DOM TRAVERSING
///////////////////////////////////

// const h1a = document.querySelector('h1');
// console.log(h1a);

// // Going downwards: child
// console.log(h1a.querySelectorAll('.highlight'));
// console.log(h1a.childNodes);
// console.log(h1a.children);
// h1a.firstElementChild.style.color = 'white';
// h1a.lastElementChild.style.color = 'white';

// //Going upwards: parents
// console.log(h1a.parentNode.parentNode);
// h1a.closest('.header').style.background = 'var(--gradient-secondary)'; //girilen elementin en yakin olanini alir. Query selectorin tersi gibi dusunulebilir. O documente en yakin olanini bulurdu yani en yukardakinis

// //Going sideways: siblings
// console.log(h1a.previousElementSibling);
// console.log(h1a.nextElementSibling);

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Add active classes
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation

const handleHover = function (e) {
  const link = e.target;
  if (e.target.classList.contains('nav__link')) {
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation

// const initialCoords = section1.getBoundingClientRect;

// window.addEventListener('scroll', function () {
//   //scroll her kaydirmada ateslenecegi icin pek kullanisli degildir
//   if (window.pageYOffset >= initialCoords.top) {
//     document.querySelector('.nav').classList.add('sticky');
//   } else {
//     document.querySelector('.nav').classList.remove('sticky');
//   }
// });

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

const stickyNav = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
  } else {
    nav.classList.add('sticky');
  }
};
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: '-90px',
};

const headerObserver = new IntersectionObserver(stickyNav, obsOptions);
headerObserver.observe(header);

///////////////////////////////////////
// Reveal sections

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target); //ismiz bitti daha dinlemesine gerek yok
  }
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sectionAll.forEach(function (section) {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});

///////////////////////////////////////
// Lazy loading images

//data-src özelligine sahip tüm img secilir
const imgAll = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  console.log(entry);

  //lazy img degistiriliyor
  entry.target.src = entry.target.dataset.src;

  //blur kaldiriliyor
  entry.target.addEventListener('load', function () {
    //img ler yüklendiginde tetiklenir
    console.log(entry.target);
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgAll.forEach(function (img) {
  imgObserver.observe(img);
  img.classList.add('lazy-img');
});

///////////////////////////////////////
// Slider
const slider = function () {
  const sliders = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;

  const createDots = function () {
    sliders.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  createDots();

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    sliders.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  goToSlide(0); //0,100,200,300 konumuna ayarlar

  const nextSlide = function () {
    if (curSlide === sliders.length - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    activateDot(curSlide);
    goToSlide(curSlide);
  };
  const prevSlide = function () {
    if (curSlide != 0) {
      curSlide--;
    } else {
      curSlide = sliders.length - 1;
    }
    activateDot(curSlide);
    goToSlide(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  const init = function () {
    goToSlide(0);
    activateDot(0);
  };

  init();

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide(curSlide);
    e.key === 'ArrowRight' && nextSlide(curSlide);
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      goToSlide(e.target.dataset.slide);
      activateDot(e.target.dataset.slide);
      curSlide = e.target.dataset.slide;
    }
  });
};
slider();
///////////////////////////////////////
// Lifecycle DOM Events
// window.addEventListener('load', function (e) {
//   console.log(e);
// });

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log(e);
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = ' ';
// });

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSection = document.querySelectorAll('.section');
// console.log(allSection);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

//Creating and inserting elements

// .insertAdjacentHTML
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent =
// //   'We use cookied for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// // header.prepend(message);
// header.append(message); //ekleme, varsa hareket ettirme
// // header.append(message.cloneNode(true));

// // header.before(message);
// // header.after(message);

// //Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//     // message.parentElement.removeChild(message);
//   });

// //Styles
// // message.style.backgroundColor = '#37383d';
// // message.style.width = '120%';
// // console.log(message.style.height); //bos doner cünkü sadece inline attributes icin calisir
// // console.log(getComputedStyle(message)); //tüm özellikleri yazdirir

// message.style.height =
//   Number.parseInt(getComputedStyle(message).height) + 40 + 'px';
// console.log(getComputedStyle(message).height);

//custom property change - using setProperty
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo);

// // console.log(logo.designer); //standart propertyler(alt,class,id) harici(bizim ekledigimiz) undefined döner
// console.log(logo.getAttribute('designer')); //dondürür
// console.log(logo.setAttribute('company', 'Bankist')); //ekler

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// //Data attributes
// console.log(logo.dataset.versionNumber);

///////////////////////////////////////
// EVENTS
///////////////////////////////////////

//const h1 = document.querySelector('h1');
//console.log(getComputedStyle(h1).color);

// const alertH1 = function (e) {
//   h1.style.color = 'orangered';
//   console.log(h1.style.color);
//   h1.removeEventListener('mouseenter', alertH1);
// };

// h1.addEventListener('mouseenter', alertH1);

// h1.onmouseenter = function (e) {
//   h1.style.color = 'blue';
//   //console.log(h1.style.color);
// };

///////////////////////////////////////
// Event Propagation in Practice

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Link', e.target, e.currentTarget);
//   console.log(this === e.currentTarget);

//   //Stop propagation
//   //e.stopPropagation();

//   //addEventListener sadece bubbling asamasindaki eventsleri yakalar. Capturing asamasindakini degil. Eger capturingdeki olaylari yakalamak istersek ücüncü parametre olarak true veririz. Bu capturing deki eventsleri dinler
// });

// document.querySelector('.nav__links').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('Links', e.target, e.currentTarget);
//   },
//   true
// );

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// });

///////////////////////////////////////
// Sticky navigation: Intersection Observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(ent => console.log(ent));
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.5],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
