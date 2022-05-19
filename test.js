// const
const CAT_NAME_LIST = ["냐옹", "하늘", "여름", "나비", "봄이", "사랑"];
const CAT_ACT = ["eat", "walk", "wake", "sleep", "shower", "drink"];
const CAT_RANDOM_TIMER = 5000;

// util
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function trigger(eventType, data) {
  const event = new CustomEvent(eventType, { detail: data });
  document.dispatchEvent(event);
}

function addEventListener(eventType, listener) {
  document.addEventListener(eventType, listener);
}

// main
function main() {
  const $parent = document.getElementById("playground");
  const randomAge = getRandomNumber(1, 14);
  const randomName = CAT_NAME_LIST[randomAge % 6];
  new Cat($parent, {
    name: randomName,
    age: randomAge,
  });
  new InfoToolTip();
  new StateToolTip();
}

// cat class
class Cat {
  constructor($parent, data) {
    const idx = getRandomNumber(1, 100) % 6;
    const dataController = new CatData({ ...data, state: CAT_ACT[idx] });
    this._domController = new CatDom($parent, dataController);
  }
}

class CatData {
  constructor({ name, age, state }) {
    this.name = name;
    this.age = age;
    this.state = state;
    setInterval(this.randomAct.bind(this), CAT_RANDOM_TIMER);
  }

  getProfile() {
    return {
      name: this.name,
      age: this.age,
    };
  }

  getState() {
    return this.state;
  }

  randomAct() {
    const state = getRandomNumber(1, 100) % 6;
    const actName = CAT_ACT[state];
    this[actName]();
  }

  eat() {
    this.state = "eat";
  }

  walk() {
    this.state = "walk";
  }

  wake() {
    this.state = "wake";
  }

  sleep() {
    this.state = "sleep";
  }

  shower() {
    this.state = "shower";
  }

  drink() {
    this.state = "drink";
  }
}

class CatDom {
  constructor($parent, dataController) {
    this.$parent = $parent;
    this.dataController = dataController;
    this.createDom();
    this.setEvent();
  }

  createDom() {
    this.$parent.innerHTML += `<div class="cat">고양이</div>`;
  }

  setEvent() {
    const $targetEl = Array.from(this.$parent.getElementsByClassName("cat"));
    $targetEl.forEach(($el) => {
      if (!$el) return;
      $el.addEventListener("click", () => {
        this.click();
      });
      $el.addEventListener("mouseover", () => {
        this.hover();
      });
      $el.addEventListener("mouseleave", () => {
        this.leave();
      });
    });
  }

  click() {
    const state = this.dataController.getState();
    trigger("onCatClick", { state });
  }

  hover() {
    const info = this.dataController.getProfile();
    trigger("onCatHover", { info });
  }

  leave() {
    trigger("onCartLeave");
  }
}

// infoToolTip
class InfoToolTip {
  constructor() {
    this.$el = document.getElementById("info");
    this.setEvent();
  }

  setEvent() {
    addEventListener("onCatHover", (e) => {
      const { info } = e.detail;
      const { name, age } = info;
      this.$el.classList.remove("hide");
      this.$el.innerHTML = `이름: ${name}, 나이: ${age}`;
    });

    addEventListener("onCartLeave", (e) => {
      this.$el.classList.add("hide");
    });
  }
}
// stateToolTip
class StateToolTip {
  constructor() {
    this.$el = document.getElementById("state");
    this.setEvent();
  }

  setEvent() {
    addEventListener("onCatClick", (e) => {
      const { state } = e.detail;
      this.$el.classList.remove("hide");
      this.$el.innerHTML = `고양이가 ${state}하고 있습니다.`;
      setTimeout(() => {
        this.$el.classList.add("hide");
      }, 700);
    });
  }
}

main();
