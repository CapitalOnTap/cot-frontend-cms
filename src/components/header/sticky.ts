class StickyHeader {
  header: HTMLElement;
  body: HTMLElement;
  navbarContent: HTMLElement;

  constructor() {
      this.header = document.getElementById("header");
      this.body = document.getElementById("body");
      this.navbarContent = document.getElementById('navbarContent');
  }

    isNavOpen() {
      return this.navbarContent.classList.contains('show')
    }

    init() {
        let scrollpos = this.header.offsetHeight;
        window.addEventListener('scroll',() => {
          if(!this.isNavOpen()){
            if ((document.body.getBoundingClientRect()).top > scrollpos) {
              this.header.classList.add("animated","fadeInDown");
              this.header.classList.remove("fadeOutUp");
            }
            else {
              this.header.classList.add("animated","fadeOutUp");
              this.header.classList.remove("fadeInDown");
            }
            scrollpos = (document.body.getBoundingClientRect()).top;
          }
        });
    }
}
export default StickyHeader;
