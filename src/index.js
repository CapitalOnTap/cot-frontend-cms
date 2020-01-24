import './scss/main.scss';

// Bootstrap framework import plugins individually as needed https://getbootstrap.com/docs/4.3/
import 'bootstrap/js/dist/dropdown.js'
import 'bootstrap/js/dist/collapse.js';

//Component - FAQ Search
import FAQSearch from './components/faq/faq-search';
FAQSearch();

// Component - Navigation menu button
import Navigation from './components/nav/nav';
const nav = new Navigation();
nav.init();

// Component - Sticky Header - Adds js-is-sticky class on scroll
import StickyHeader from './components/header/sticky';
const sticky = new StickyHeader();
sticky.init();

// Odometer https://github.hubspot.com/odometer
import '../node_modules/odometer/odometer.min.js';
import '../node_modules/odometer/themes/odometer-theme-car.css';
import COTOdometer from './components/odometer/odometer';
const odometer = new COTOdometer();
odometer.init();

// Component - Carousels
import CarouselStart from './components/carousel/carousel';
const carousels = document.querySelectorAll('[data-carousel]');
for (let carouselEl of carousels) {
  const carousel = new CarouselStart(carouselEl);
  carousel.init();
}

// JS - Smooth scroll
import SmoothScroll from 'smooth-scroll';
var scroll = new SmoothScroll('a[href*="#"]', {
    speed: 400,
    easing: 'easeOutQuad',
    offset: function (anchor, toggle) {
        const headerHeight = document.getElementById('header').getBoundingClientRect().height;
        return headerHeight;
    }
});

// JS - Load images
import LazyLoad from "vanilla-lazyload";
const lazyLoadOptions = {
  use_native: true,
  elements_selector: ".img-fluid"
};
const pageLazyLoad = new LazyLoad(lazyLoadOptions);
if(pageLazyLoad){
  pageLazyLoad.update();
}

// https://michalsnik.github.io/aos/
import AOS from 'aos';
import '../node_modules/aos/dist/aos.css'
AOS.init()

// https://daneden.github.io/animate.css/
import '../node_modules/animate.css/animate.min.css';
