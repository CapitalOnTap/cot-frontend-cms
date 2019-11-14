import '../../../node_modules/odometer/odometer';

class COTOdometer {


  constructor(){
    this.odometerEl = document.querySelector('.odometer');
    this.counter = 1000000000;
    this.kk = 1302;
    this.localStorageSupported = typeof window['localStorage'] != "undefined" && window['localStorage'] != null;
  }

  add(key, item) {
    if(this.localStorageSupported) {
      localStorage.setItem(key, item);
    }
  }

  get(key) {
    if(this.localStorageSupported) {
      const item = localStorage.getItem(key);
      return item;
    } else {
      return null;
    }
  }

  remove(key) {
    if(this.localStorageSupported) {
      localStorage.removeItem(key);
    }
  }

  clear(){
    if(this.localStorageSupported) {
      localStorage.clear();
    }
  }

  init(){
    window.addEventListener('load', () => {
      let incrementVal = this.get("increment_val");
      this.odometerEl.innerHTML = incrementVal;
      // od = new Odometer({
      //   el: el,
      //   value: 80,
      //   format: '',
      //   theme: 'default'
      // })
       // odometer.render();
      // window.odometerOptions = {
      //   auto: false, // Don't automatically initialize everything with class 'odometer'
      //   selector: '.my-numbers', // Change the selector used to automatically find things to be animated
      //   format: '(,ddd).dd', // Change how digit groups are formatted, and how many digits are shown after the decimal point
      //   duration: 3000, // Change how long the javascript expects the CSS animation to take
      //   theme: 'car', // Specify the theme (if you have more than one theme css file on the page)
      //   animation: 'count' // Count is a simpler animation method which just increments the value,
      //                      // use it when you're looking for something more subtle.
      // }
      // let increment_val = localStorage.getItem("increment_val");
      // this.odometerEl.innerHTML = increment_val;
      // $(".odometer").text(increment_val);
      // var kk = 1302;

      //alert(localStorage.getItem('increment_val_set'))

      //$('.odometer').text(localStorage.getItem('increment_val'));

      setInterval(() => {

        // var counter = 1000000000;
        //localStorage.setItem('increment_val_set', counter);
        const setVal = this.get("increment_val_set");
        // const val_set = localStorage.getItem("increment_val_set");
        // if (setVal === this.counter) {
        // if (val_set === this.counter) {
          if (this.get("increment_val") === null) {
          // if (localStorage.getItem("increment_val") === null) {
            this.add("increment_val", this.counter);
            // localStorage.setItem("increment_val", this.counter);
          } else {
            // let increment_val = localStorage.getItem("increment_val");
            // var increment_val = localStorage.getItem("increment_val");
            incrementVal = parseInt(incrementVal) + parseInt(this.kk);
            console.log(incrementVal)
            this.odometerEl.innerHTML = incrementVal;
            this.add("increment_val", incrementVal);
            // localStorage.setItem("increment_val", incrementVal);
          }
        // } else {
        //   this.add("increment_val_set", this.counter);
        //   this.add("increment_val", this.counter);
          // localStorage.setItem("increment_val_set", this.counter);
          // localStorage.setItem("increment_val", this.counter);
        // }
        // od.update(incrementVal++)
      }, 10000);
    })
  }
}

export default COTOdometer;
