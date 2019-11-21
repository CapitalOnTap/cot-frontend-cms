import '../../../node_modules/odometer/odometer';

class COTOdometer {
  constructor(){
    this.storageKey = "incrementVal";
    this.storageSetKey = "incrementValSet";
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

  shouldResetOdometer() {
    const incrementVal = this.get(this.storageKey);
    if (
      incrementVal &&
      Number.isInteger &&
      incrementVal < this.counter
    ) {
      return true;
    }
    return false;
  }

  resetOdometer() {
    this.remove(this.storageKey);
    this.remove(this.storageSetKey);
    this.add(this.storageKey, this.counter);
    this.add(this.storageSetKey, this.counter);
  }

  init(){
    window.addEventListener('load', () => {

      if (this.shouldResetOdometer()) {
        this.resetOdometer();
      }

      this.odometerEl.innerHTML = this.get(this.storageKey) || this.counter;

      setInterval(() => {
        const valSet = this.get(this.storageSetKey);

        if (valSet == this.counter) {
          
          if (!this.get(this.storageKey)) {
            this.add(this.storageKey, this.counter);
          } else {
            const currentIncrementVal = this.get(this.storageKey);
            const incrementVal = parseInt(currentIncrementVal) + parseInt(this.kk);
            this.odometerEl.innerHTML = incrementVal;
            this.add(this.storageKey, incrementVal);
          }
        } else {
          this.add(this.storageSetKey, this.counter);
          this.add(this.storageKey, this.counter);
        }
      }, 1000);

    })
  }
}

export default COTOdometer;
