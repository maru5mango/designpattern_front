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
  new InfoToolTip();
  new StateToolTip();
  const makeCatClass = new makeCatButton();
  const callCatFunc = callCat(makeCatClass);
  new callCatBtn(callCatFunc);

  makeCatClass.click();
}

function makeCat() {
  const $parent = document.getElementById("playground");
  const randomAge = getRandomNumber(1, 14);
  const randomName = CAT_NAME_LIST[randomAge % 6];
  const idx = getRandomNumber(0, 4);
  const catType = [
    Cat,
    RussianBlue,
    koreanShorthairCat,
    BengalCat,
    NorwegianForestCat,
  ];
  return new catType[idx]($parent, {
    name: `${randomName}${new Date().getTime()}`,
    age: randomAge,
  });
}

// cat class
class Cat {
  constructor($parent, data) {
    const idx = getRandomNumber(1, 100) % 6;
    this._dataController = new CatData({ profile: data, state: CAT_ACT[idx] });
    this._domController = new CatDom($parent, this);
    this.create();
  }

  create() {
    this._domController.createDom(`<div class="cat">길냥이</div>`);
    this._domController.setEvent("cat");
  }

  getName() {
    return this._dataController.getProfile().name;
  }

  callState() {
    const state = this._dataController.getState();
    trigger("onCatClick", { state });
  }

  callProfile() {
    const info = this._dataController.getProfile();
    trigger("onCatHover", { info });
  }

  fireProfile() {
    trigger("onCartLeave");
  }

  call() {
    console.log("그냥 온다.");
  }
}

class CatData {
  constructor({ profile, state }) {
    this.profile = profile;
    this.state = state;
    setInterval(this.randomAct.bind(this), CAT_RANDOM_TIMER);
  }

  getProfile() {
    return this.profile;
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
  constructor($parent, event) {
    this.$parent = $parent;
    this.event = event;
  }

  createDom(template) {
    const [, , , , className, , text] = template.split(/<|>|"|div|=/);
    const node = document.createElement("div");
    node.classList.add(className);
    node.innerText = text;
    this.$parent.append(node);
  }

  setEvent(targetClassName) {
    const $targetEl = Array.from(
      this.$parent.getElementsByClassName(targetClassName)
    );
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
    this.event.callState();
  }

  hover() {
    this.event.callProfile();
  }

  leave() {
    this.event.fireProfile();
  }
}

class RussianBlue extends Cat {
  constructor($parent, data) {
    super($parent, {
      ...data,
      type: "러시안 블루",
    });
    this._dataController;
  }

  /*
   * @override
   */
  create() {
    this._domController.createDom(
      `<div class="russianBlueCat">러시안 블루</div>`
    );
    this._domController.setEvent("russianBlueCat");
  }

  /*
   * @override
   */
  call() {
    console.log("원을 2번 그리고 나에게 온다");
  }
}

class koreanShorthairCat extends Cat {
  constructor($parent, data) {
    super($parent, {
      ...data,
      type: "코숏",
    });
    this._dataController;
  }

  /*
   * @override
   */
  create() {
    this._domController.createDom(`<div class="koreanSortHair">코숏</div>`);
    this._domController.setEvent("koreanSortHair");
  }

  /*
   * @override
   */
  call() {
    console.log("물끄러미 바라만 본다");
  }
}

class BengalCat extends Cat {
  #callCount;

  constructor($parent, data) {
    super($parent, {
      ...data,
      type: "뱅갈",
    });
    this._dataController;
    this.#callCount = 0;
  }

  /*
   * @override
   */
  create() {
    this._domController.createDom(`<div class="bengalCat">뱅갈</div>`);
    this._domController.setEvent("bengalCat");
  }

  /*
   * @override
   */
  call() {
    this.#callCount += 1;
    if (this.#callCount >= 2) {
      console.log("나에게 온다.");
    } else {
      console.log("2번 이상 불러야 나에게 온다");
    }
  }
}

class NorwegianForestCat extends Cat {
  constructor($parent, data) {
    super($parent, {
      ...data,
      type: "노르웨이숲",
    });
    this._dataController;
  }

  /*
   * @override
   */
  create() {
    this._domController.createDom(
      `<div class="norwegianForestCat">노르웨이숲</div>`
    );
    this._domController.setEvent("norwegianForestCat");
  }

  /*
   * @override
   */
  call() {
    console.log("박스 속으로 들어간다.");
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
      const { name, age, type } = info;
      this.$el.classList.remove("hide");
      this.$el.innerHTML = `이름: ${name}, 나이: ${age} ${
        type ? `종류: ${type}` : ""
      }`;
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

class callCatBtn {
  constructor(clickFunc) {
    this.$el = document.getElementById("catCallBtn");
    this.clickFunc = clickFunc;
    this.setEvent();
  }

  setEvent() {
    this.$el.addEventListener("click", () => {
      this.clickFunc();
    });
  }
}

// makeCatButton
class makeCatButton {
  #result;
  #maxNum;

  constructor() {
    this.$el = document.getElementById("makeCatBtn");
    this.#result = [];
    this.#maxNum = 6;
    this.#setEvent();
  }

  getCatBox() {
    return this.#result.map((catClass) => {
      return catClass.getName();
    });
  }

  getCatClass(name) {
    const catNameList = this.getCatBox();
    const idx = catNameList.findIndex((catName) => catName === name);
    return this.#result[idx];
  }

  #setEvent() {
    this.$el.addEventListener("click", () => {
      if (this.#result.length === this.#maxNum) {
        alert("고양이를 더 이상 추가할 수 없어요!!!");
      } else {
        this.#result.push(makeCat());
      }
    });
  }

  click() {
    this.$el.click();
  }
}

function callCat(makeCatClass) {
  const $input = document.getElementById("catCallName");

  return function () {
    const name = $input.value;
    if (name === "") return alert("이름을 입력해주세요");
    const nameList = makeCatClass.getCatBox();
    if (!nameList.includes(name))
      return alert("고양이 이름을 다시 확인해주세요.");
    const catClass = makeCatClass.getCatClass(name);
    catClass?.call();
  };
}

main();
