class Nav {
  body: HTMLElement;
  button: HTMLElement;
  animatedIcon: HTMLElement;
  navbarMobile: HTMLElement;
  header: HTMLElement;
  constructor() {
      this.body = document.getElementById("body");
      this.button = document.getElementById('nav-button');
      this.animatedIcon = document.getElementById('animated')
      this.navbarMobile = document.getElementById('navbarContent')
      this.header = document.getElementById("header");
  }
  init() {
    this.button.addEventListener('click', () => {
      this.animatedIcon.classList.toggle("open");
      this.navbarMobile.classList.toggle("show");
      this.header.classList.remove('animated');
    })
  }
}
export default Nav;
