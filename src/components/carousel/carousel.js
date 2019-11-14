import Flickity from 'flickity';
import 'flickity/dist/flickity.min.css';
import './carousel.scss';

class Carousel {
    constructor(container) {
        this.container = container;
        this.carouselItem = document.querySelector('[data-carousel]');
    }
    init() {
        window.addEventListener('load', () => {
            const flkty = new Flickity(this.container, {
                // options
                autoPlay: true
            });
        });
    }
}
 
export default Carousel;