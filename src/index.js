//// INDEX
//
// - CSS - Variables
// - CSS - Normalize.css
// - JS - Add js class to html
// - Component - Navigation menu button
// - Component - Sticky Header
// - Component - Carousels
// - JS - Smooth scroll
// - JS - Load images
// - CSS - All other custom css
// - CSS - IE Fixes
// - CSS - Print styles

// CSS - normalize.css - import vendor css
import 'normalize.css/normalize.css';
// CSS - Variables this needs to be imported before bootstrap in order to override variables
import './components/variables.scss';

// Bootstrap framework import plugins individually as needed https://getbootstrap.com/docs/4.3/
// Import bootstrap
import 'bootstrap/scss/bootstrap.scss';
import 'bootstrap/js/dist/dropdown.js'
import 'bootstrap/js/dist/collapse.js';
// import 'bootstrap/js/dist/util';
// import 'bootstrap/js/dist/dropdown';



//Material Ic
// JS - Add js class to html
document.querySelector('html.no-js').className = 'js';

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

// CSS - Import all custom CSS style
import './components/base/general.scss';
import './components/mixins/scrollbars.scss';
import './components/header/header.scss';
import './components/nav/nav.scss';
import './components/topnav/topnav.scss';
import './components/footer/footer.scss';
import './components/cards/cards.scss';
import './components/banner/banner.scss';
import './components/odometer/odometer.scss';

// CSS - IE Fixes
import './components/ie/ie.scss';

// CSS - Print styles
import './components/base/print.scss';

