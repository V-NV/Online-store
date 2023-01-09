import "./nouislider.css";
import "./style.css";
import data from "./data";
import * as noUiSlider from "nouislider";
import { ForData } from "./types/inter";
import score from "./score";
window.addEventListener("beforeunload", setLocalStorage);
window.addEventListener("load", getLocalStorage);
const view = document.querySelector(".content") as HTMLElement;
const SortBy = document.querySelector("#sort-select") as HTMLElement;
const CartIcon = document.querySelector(".cart") as HTMLElement;
const Logo = document.querySelector(".logo-header") as HTMLElement;
const PayOn = document.querySelector(".cont-pay") as HTMLElement;
const korz = document.querySelector(".cartscore") as HTMLElement;
const summ = document.querySelector(".header-summ") as HTMLElement;
const Reset = document.querySelector(".reset-filter") as HTMLElement;
const Table = document.getElementById("table") as HTMLElement;
const List = document.getElementById("list") as HTMLElement;
const sliderStock = document.getElementById(
  "slider-copies"
) as noUiSlider.target;
const sliderStockCounterStart = document.querySelector(
  "#slider-copies-counter-start"
);
const sliderStockCounterEnd = document.querySelector(
  "#slider-copies-counter-end"
);

const arrData = data;
const arrFirst = data.slice();
let arrCart: ForData[] = [];
let arrTemp: ForData[] = [];
let arrCurrient = arrData;
let isTable = true;
let isList = false;
let arrSmartCheckbox: ForData[] = [];
let isCheckOn = false;
let suma = 0;
let arrSliders: ForData[] = [];
let stockCounterStart = 5;
let stockCounterEnd = 150;
function LS() {
  if (localStorage.getItem("List") === "true") {
    createList(arrData);
  } else {
    createTable(arrData);
  }
}
LS();

function createTable(Data: ForData[]) {
  arrTemp = [];
  arrCurrient = Data;
  Sort2();
  const data = arrCurrient;
  if (view) {
    view.innerHTML = "";

    for (let i = 0; i < arrCurrient.length; i += 1) {
      view.innerHTML += `
          <div class="item" id="item${data[i].id}">
            <h2 class="item-name">${data[i].title}</h2>
            <div class="text-cont">
            <li class="item-discr">Брэнд: ${data[i].brand}</li>
            <li class="item-discr">Категория: ${data[i].category}</li>
            <li class="item-discr">Рейтинг: ${data[i].rating}</li>
            <li class="item-discr">Количество: ${data[i].stock}</li>
            <li class="item-price">Цена: $ ${data[i].price}</li>
            </div>
            <img class="item-image" id="${data[i].id - 1}" alt="${
        data[i].title
      }" src="${data[i].thumbnail}">
            <div class="item-button-cont">
            <div class="btn-item" id="btn-add${
              data[i].id
            }">Добавить в корзину</div>
            <div class="btn-item" id="btn-del${
              data[i].id
            }">Удалить из корзины</div>
            </div>
          </div>
        `;
    }
  }
  isList = false;
  isTable = true;
  Table.className = "now";
  const a = document.querySelector(".search-result") as HTMLElement;
  a.textContent = Data.length.toString();
  noItems();
  PopupOn();
  AddItems();
  ItemInCart();
}

function createList(Data: ForData[]) {
  arrTemp = [];
  arrCurrient = Data;
  Sort2();
  const data = Data;
  if (view) {
    view.innerHTML = "";
    for (let i = 0; i < Data.length; i += 1) {
      view.innerHTML += `
            <div class="item-list" id="${data[i].id}">
              <div class="text-cont-list">
              <li class="item-discr">Брэнд: ${data[i].brand}</li>
              <li class="item-discr">Категория: ${data[i].category}</li>
              <li class="item-discr">Рейтинг: ${data[i].rating}</li>
              <li class="item-discr">Количество: ${data[i].stock}</li>
              <li class="item-price">Цена: $ ${data[i].price}</li>
              </div>
              <img class="item-image-list" id="${data[i].id - 1}" alt="${
        data[i].title
      }" src="${data[i].thumbnail}">
              <div class="item-button-cont-list">
              <h2 class="item-name">${data[i].title}</h2>
              <button class="btn-item" id="btn-add${
                data[i].id
              }">Добавить в корзину</button>
              <button class="btn-item" id="btn-del${
                data[i].id
              }">Удалить из корзины</button>
              </div>
            </div>
          `;
    }
    isList = true;
    isTable = false;
    List.className = "now";
    const a = document.querySelector(".search-result") as HTMLElement;
    a.textContent = Data.length.toString();
    noItems();
    PopupOn();
    AddItems();
    ItemInCart();
  }
}

List.addEventListener("click", function () {
  if (!isList && arrCurrient.length < 1) {
    createList(arrData);
    Table.className = "";
    List.className = "now";
    isList = true;
    isTable = false;
    localStorage.setItem("List", JSON.stringify(true));
    localStorage.setItem("Table", JSON.stringify(false));
  }
  if (!isList && arrCurrient.length > 0) {
    createList(arrCurrient);
    Table.className = "";
    List.className = "now";
    isList = true;
    isTable = false;
    localStorage.setItem("List", JSON.stringify(true));
    localStorage.setItem("Table", JSON.stringify(false));
  }
  ItemInCart();
});

Table.addEventListener("click", function () {
  if (!isTable && arrCurrient.length < 1) {
    createTable(arrData);
    Table.className = "now";
    List.className = "";
    isList = false;
    isTable = true;
    localStorage.setItem("List", JSON.stringify(false));
    localStorage.setItem("Table", JSON.stringify(true));
  }
  if (!isTable && arrCurrient.length > 0) {
    createTable(arrCurrient);
    Table.className = "now";
    List.className = "";
    isList = false;
    isTable = true;
    localStorage.setItem("List", JSON.stringify(false));
    localStorage.setItem("Table", JSON.stringify(true));
  }
  ItemInCart();
});

const searchInput = document.querySelector("#input") as HTMLInputElement;

if (searchInput) {
  searchInput.oninput = function (event: Event) {
    let dataTA = arrData;
    const { target } = event;
    const res = (target as HTMLInputElement).value;

    if (isCheckOn === true) {
      dataTA = arrSmartCheckbox;
    }

    for (let i = 0; i < dataTA.length; i += 1) {
      const SearchString =
        dataTA[i].title +
        " " +
        dataTA[i].price.toString() +
        " " +
        dataTA[i].brand +
        " " +
        dataTA[i].stock.toString() +
        " " +
        dataTA[i].rating.toString() +
        " " +
        dataTA[i].category;

      if (
        SearchString.toLowerCase().includes(res.toLowerCase() || res) == true
      ) {
        arrTemp.push(dataTA[i]);
      }
    }
    view.innerHTML = "";
    isTable ? createTable(arrTemp) : createList(arrTemp);
  };
}

function noItems() {
  const b = document.querySelector(".no-items") as HTMLElement;
  if (arrCurrient.length < 1) {
    b.classList.remove("off");
  } else {
    b.classList.add("off");
  }
}

SortBy.addEventListener("change", Sort);

function Sort(): void {
  if ((SortBy as HTMLInputElement).value) {
    arrCurrient.sort(function (a, b) {
      if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
      if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
      return 0;
    });
  } else if ((SortBy as HTMLInputElement).value === "z-a") {
    arrCurrient.sort(function (a, b) {
      if (b.title.toLowerCase() < a.title.toLowerCase()) return -1;
      if (b.title.toLowerCase() > a.title.toLowerCase()) return 1;
      return 0;
    });
  } else if ((SortBy as HTMLInputElement).value == "from-min") {
    arrCurrient.sort((a, b) => a.price * 1 - b.price * 1);
  } else if ((SortBy as HTMLInputElement).value === "from-max") {
    arrCurrient.sort((a, b) => b.price * 1 - a.price * 1);
  }
  isTable ? createTable(arrCurrient) : createList(arrCurrient);
}
function Sort2() {
  if ((SortBy as HTMLInputElement).value === "a-z") {
    arrCurrient.sort(function (a, b) {
      if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
      if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
      return 0;
    });
  } else if ((SortBy as HTMLInputElement).value === "z-a") {
    arrCurrient.sort(function (a, b) {
      if (b.title.toLowerCase() < a.title.toLowerCase()) return -1;
      if (b.title.toLowerCase() > a.title.toLowerCase()) return 1;
      return 0;
    });
  } else if ((SortBy as HTMLInputElement).value === "from-min") {
    arrCurrient.sort((a, b) => a.price * 1 - b.price * 1);
  } else if ((SortBy as HTMLInputElement).value === "from-max") {
    arrCurrient.sort((a, b) => b.price * 1 - a.price * 1);
  }
}

const BoxCategory = document.getElementById("category") as HTMLElement;
const CheckSmart = document.getElementById("smart") as HTMLInputElement;
const CheckNout = document.getElementById("nout") as HTMLInputElement;
const CheckShirt = document.getElementById("shirt") as HTMLInputElement;
const CheckWatch = document.getElementById("watch") as HTMLInputElement;

BoxCategory.addEventListener("click", () => {
  arrSmartCheckbox = [];
  const arrTempBox: ForData[] = [];
  let arrSmart: ForData[] = [];
  let arrNout: ForData[] = [];
  let arrShirt: ForData[] = [];
  let arrWatch: ForData[] = [];

  if (CheckSmart.checked) {
    arrSmart = [];
    arrSmart = arrData.filter((el) => el.category.includes("smartphones"));
  }
  if (CheckNout.checked) {
    arrNout = [];
    arrNout = arrData.filter((el) => el.category.includes("laptops"));
  }
  if (CheckShirt.checked) {
    arrShirt = [];
    arrShirt = arrData.filter((el) => el.category.includes("mens-shirts"));
  }
  if (CheckWatch.checked) {
    arrWatch = [];
    arrWatch = arrData.filter((el) => el.category.includes("mens-watches"));
  }
  if (CheckSmart.checked || CheckNout.checked || CheckShirt || CheckWatch) {
    searchInput.value = "";
    searchInput.placeholder = "Введите запрос";
    isCheckOn = true;
    arrSmartCheckbox = arrTempBox.concat(arrSmart, arrNout, arrShirt, arrWatch);
    isTable ? createTable(arrSmartCheckbox) : createList(arrSmartCheckbox);
  }
  if (arrSmartCheckbox.length < 1) {
    isCheckOn = false;
    isTable ? createTable(arrData) : createList(arrData);
  }
});

const BoxBrand = document.getElementById("brand") as HTMLInputElement;
const CheckApple = document.getElementById("apple") as HTMLInputElement;
const CheckWarhouse = document.getElementById("warhouse") as HTMLInputElement;
const CheckSkmei = document.getElementById("skmei") as HTMLInputElement;
const CheckSamsung = document.getElementById("samsung") as HTMLInputElement;

BoxBrand.addEventListener("click", () => {
  let arrBrandCheckbox: ForData[] = [];
  const arrTempBox: ForData[] = [];
  let arrApple: ForData[] = [];
  let arrWarhouse: ForData[] = [];
  let arrSkmei: ForData[] = [];
  let arrSamsung: ForData[] = [];

  if (CheckApple.checked) {
    arrApple = [];
    arrApple = arrData.filter((el) => el.brand.includes("Apple"));
  }
  if (CheckWarhouse.checked) {
    arrWarhouse = [];
    arrWarhouse = arrData.filter((el) => el.brand.includes("The Warehouse"));
  }
  if (CheckSkmei.checked) {
    arrSkmei = [];
    arrSkmei = arrData.filter((el) => el.brand.includes("SKMEI 9117"));
  }
  if (CheckSamsung.checked) {
    arrSamsung = [];
    arrSamsung = arrData.filter((el) => el.brand.includes("Samsung"));
  }
  if (
    CheckApple.checked ||
    CheckWarhouse.checked ||
    CheckSkmei.checked ||
    CheckSamsung.checked
  ) {
    searchInput.value = "";
    searchInput.placeholder = "Введите запрос";
    arrBrandCheckbox = arrTempBox.concat(
      arrApple,
      arrWarhouse,
      arrSkmei,
      arrSamsung
    );
    isTable ? createTable(arrBrandCheckbox) : createList(arrBrandCheckbox);
  }
  if (arrBrandCheckbox.length < 1) {
    isTable ? createTable(arrData) : createList(arrData);
  }
});

if (sliderStock) {
  noUiSlider.create(sliderStock, {
    start: [5, 150],
    step: 5,
    connect: true,
    range: {
      min: [5],
      max: [150],
    },
  });
}
if (sliderStock.noUiSlider) {
  sliderStock.noUiSlider.on("update", function (values, handle) {
    const inputs = [
      sliderStockCounterStart as HTMLInputElement,
      sliderStockCounterEnd as HTMLInputElement,
    ];
    stockCounterStart = Math.round(+values[0]);
    stockCounterEnd = Math.round(+values[1]);
    inputs[handle].value = `${Math.round(+values[handle])}`;

    arrSliders = arrFirst.filter(
      (item) =>
        +item.stock >= stockCounterStart && +item.stock <= stockCounterEnd
    );
    isTable ? createTable(arrSliders) : createList(arrSliders);
  });
}

function PopupOn(): void {
  const itemPopup = document.getElementsByClassName("item-image");
  const itemPopupList = document.getElementsByClassName("item-image-list");
  const Left = document.querySelector(".left") as HTMLElement;
  const Right = document.querySelector(".right") as HTMLElement;
  const Footer = document.querySelector(".footer") as HTMLElement;
  const Popup = document.querySelector(".popup") as HTMLElement;

  let elements = itemPopup;
  if (isTable) {
    elements = itemPopup;
  }
  if (isList) {
    elements = itemPopupList;
  }

  for (const el of Array.from(elements)) {
    el.addEventListener("click", function (event: Event) {
      const { target } = event;
      const elem = target;
      const ID = (elem as HTMLInputElement).id;

      view.classList.add("off");
      Left.classList.add("off");
      Right.classList.add("off");
      Footer.classList.add("foot-down");
      ItemInCart();
      Popup.classList.remove("off");
      ItemInCart();
      Popup.innerHTML = "";
      Popup.innerHTML += `
    <div class="bread-cont">
       <p class="item-bread-link">STORE</p>
       <p class="item-bread-u">>></p>
       <p class="item-bread">${arrFirst[+ID].category}</p>
       <p class="item-bread-u">>></p>
       <p class="item-bread">${arrFirst[+ID].brand}</p>
       <p class="item-bread-u">>></p>
       <p class="item-bread">${arrFirst[+ID].title}</p>

    </div>
    <div class="item-pop" id="${+ID}}">
         <div class="exit">х</div>
         <h2 class="item-name-pop">${arrFirst[+ID].title}</h2>
       <div class="cont-box-pop">
        <div class="img-box-pop">
        <img class="item-image-pop" id="i${arrFirst[+ID].images[0]}" alt="${
        arrFirst[+ID].title
      }" src="${arrFirst[+ID].thumbnail}">
       </div>
       <div class="text-cont-pop">
        <li class="item-discr">Брэнд: ${arrFirst[+ID].brand}</li>
        <li class="item-discr">Категория: ${arrFirst[+ID].category}</li>
        <li class="item-discr">Рейтинг: ${arrFirst[+ID].rating}</li>
        <li class="item-discr">Скидка: ${
          arrFirst[+ID].discountPercentage
        } %</li>
        <li class="item-discr">Количество: ${arrFirst[+ID].stock}</li>
        <li class="item-price">Цена: $ ${arrFirst[+ID].price}</li>
        <div class="buy-now" id="${arrFirst[+ID].id}">Купить</div>
       <div class="arrow" id="left-arrow">&#8644</div>
      </div>
      </div>
          <div class="opisanie">Описание: ${arrFirst[+ID].description}</div>
        <div class="item-button-cont-pop">
          <button class="btn-item" id="btn-add${
            arrFirst[+ID].id
          }">Добавить в корзину</button>
          <button class="btn-item" id="btn-del${
            arrFirst[+ID].id
          }">Удалить из корзины</button>
        </div>
      </div>
    `;
      ItemInCart();
      const Mov = document.querySelector(".item-image-pop") as HTMLInputElement;
      const btnChange = document.getElementById("left-arrow") as HTMLElement;
      const Bread = document.querySelector(".item-bread-link") as HTMLElement;

      Bread.addEventListener("click", Hleb);
      ItemInCart();
      const arrImg = arrFirst[+ID].images;

      let count = 0;

      btnChange.addEventListener("click", function () {
        if (count === 0) {
          Mov.src = arrImg[count];
          count += 1;
        } else if (count > 0 && count < arrImg.length) {
          Mov.src = arrImg[count];
          count += 1;
        } else if (count > arrImg.length) {
          count = 0;
          Mov.src = arrImg[count];
          count += 1;
        } else if (count < 0) {
          count = 0;
          count = arrImg.length - 1;
          Mov.src = arrImg[count];
          count += 1;
        } else if (count == arrImg.length) {
          count = 0;
          Mov.src = arrImg[count];
          count += 1;
        }
      });

      const ZoomImg = document.querySelector(".item-image-pop") as HTMLElement;
      ZoomImg.addEventListener("mouseover", function () {
        ZoomImg.classList.add("item-image-pop-on");
      });
      ZoomImg.addEventListener("mouseout", function () {
        ZoomImg.classList.remove("item-image-pop-on");
      });

      const QuickPay = document.querySelector(".buy-now") as HTMLElement;
      QuickPay.addEventListener("click", Quick);

      function Quick() {
        let TempQ = [];
        const Qid = +QuickPay.id;
        TempQ = arrCart.filter((tov: ForData) => +QuickPay.id === +tov.id);
        if (TempQ.length > 0) {
          OpenCart();
        }
        if (TempQ.length === 0) {
          arrCart.push(arrFirst[Qid - 1]);
          summ.textContent = arrFirst[Qid - 1].price.toString();
          PayForm2();
        }
      }

      AddItems();
      ItemInCart();
      const Exit = document.querySelector(".exit") as HTMLElement;
      Exit.addEventListener("click", function () {
        ItemInCart();
        Left.classList.remove("off");
        Right.classList.remove("off");
        Footer.classList.remove("foot-down");
        view.classList.remove("off");
        Popup.classList.add("off");
        Popup.innerHTML = "";
        ItemInCart();
        isTable ? createTable(arrCurrient) : createList(arrCurrient);
      });
    });
  }

  ItemInCart();
}

CartIcon.addEventListener("click", OpenCart);

function OpenCart() {
  const CartPage = document.querySelector(".cart-page") as HTMLElement;
  const Left = document.querySelector(".left") as HTMLElement;
  const Right = document.querySelector(".right") as HTMLElement;
  const Footer = document.querySelector(".footer") as HTMLElement;
  const popup = document.querySelector(".popup") as HTMLElement;

  korz.textContent = arrCart.length.toString();

  view.classList.add("off");
  Left.classList.add("off");
  Right.classList.add("off");
  Footer.classList.add("foot-down");
  CartPage.classList.remove("off");
  PayOn.classList.add("off");
  popup.classList.add("off");

  CartPage.innerHTML = "";
  CartPage.innerHTML += `
    <div class="left-cart">
    <div class="left-cart-header">
        <p class="articl">Товаров в корзине</p>
          <div class="paginat-box">
             <div class="item-box">
                <p>items: <span> &#8734 </span></p>
             </div>
                <div class="item-box2">
                <p>page:<span> &#9664 </span><span>1</span><span> &#9654 </span></p>
            </div>      
            </div>
    </div>
      <div class="left-cart-content">
    </div>
</div>    
<div class="right-cart">
       <div class="right-cart-header">
           <p class="articl">Итого:</p>
       </div>
       <div class="right-cart-content">
         <p>Товаров:<span class=right-how>0</span></p>
         <p>Сумма: <span class="SM">0</span></p>
         <div class="sort">
         <div>
            <input class="promo-input" id="input" placeholder="Введите промо код" autofocus="">
         </div> 
            <p class="promotest">Тестовый код: 'Rss10' 'Rss15'</p>  
        </div>
        <button class="btn-buy">Купить</button>
       </div>       
    </div> 
    `;
  const CartItem = document.querySelector(".left-cart-content") as HTMLElement;

  for (let i = 0; i < arrCart.length; i += 1) {
    CartItem.innerHTML += `
           
    <div class="item-cart" id="${arrCart[i].id}">
                  
       <div class="img-box-cart">
        <img class="item-image-pop" id="i${arrCart[i].images[0]}" alt="${arrCart[i].title}" src="${arrCart[i].thumbnail}">
       </div>
       <div class="text-cont-cart">
        <h2 class="cart-name">${arrCart[i].title}</h2>
        <div class="opisanie-cart">Описание: ${arrCart[i].description}</div>
        <p class="discr-cart">Брэнд: ${arrCart[i].brand}</p>
        <p class="discr-cart">Категория: ${arrCart[i].category}</p>
       <div class="down-cart">
        <p class="discr-cart-d">Рейтинг: ${arrCart[i].rating}</p>
        <p class="discr-cart-d">Скидка: ${arrCart[i].discountPercentage} %</p>
       </div> 
      </div>
          
        <div class="item-button-cont-cart">
          <p class="discr-cart">Наличие: ${arrCart[i].stock}</p>
          <button class="btn-item-cart" id="btn-add${arrCart[i].id}" value="1"> + </button>
          <div class="how-item" id="${arrCart[i].id}" value="1">1</div>
          <button class="btn-item-cart" id="btn-del${arrCart[i].id}" value="1"> - </button>
          <p class="price-cart-d" id="${arrCart[i].price}">Цена: $ ${arrCart[i].price}</p>
        </div>
    </div>
    `;
    const RightHow = document.querySelector(".right-how") as HTMLElement;
    RightHow.textContent = arrCart.length.toString();
    const SM = document.querySelector(".SM") as HTMLElement;
    SM.textContent = summ.textContent;

    changePlusMinus();
    promokod();
  }

  (document.querySelector(".btn-buy") as HTMLInputElement).disabled = false;
  if (arrCart.length < 1) {
    (document.querySelector(".btn-buy") as HTMLInputElement).disabled = true;
    CartItem.innerHTML += `
    <p class="header-cart-sum">В корзине не товаров</p>
    <p class="header-cart-sum">Кнопка оплаты активна только при наличии товара в корзине</p>
    `;
  }

  const Pay = document.querySelector(".btn-buy") as HTMLElement;
  Pay.addEventListener("click", PayForm);

  function PayForm(): void {
    CartPage.classList.add("off");
    PayOn.classList.remove("off");
    const form = document.getElementById("form") as HTMLFormElement;
    const username = document.getElementById("username") as HTMLInputElement;
    const adress = document.getElementById("adress") as HTMLInputElement;
    const email = document.getElementById("email") as HTMLInputElement;
    const telepfone = document.getElementById("telepfone") as HTMLInputElement;
    const cardnumber = document.getElementById(
      "cardnumber"
    ) as HTMLInputElement;
    const date = document.getElementById("date") as HTMLInputElement;
    const cvv = document.getElementById("cvv") as HTMLInputElement;
    //regExp
    const eml =
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const cv = /^[0-9]{3,4}$/;
    const mmyy = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
    const Validate = (
      item: HTMLElement,
      messageType: "success" | "error",
      message?: string
    ) => {
      const formControl = item.parentElement as HTMLDivElement;
      formControl.className =
        messageType === "error" ? "form-control error" : "form-control success";
      if (messageType === "error" && !!message) {
        const small = formControl.querySelector("small");
        (small as HTMLInputElement).innerHTML = message;
      }
    };
    function checkUser(username: HTMLInputElement) {
      if (
        username.value.toLowerCase().split(" ").length === 2 &&
        username.value.toLowerCase().split(" ")[0].length >= 3 &&
        username.value.toLowerCase().split(" ")[1].length >= 3
      ) {
        Validate(username, "success");
      } else {
        Validate(username, "error", "Введите два слова от 3 символов каждое ");
      }
    }
    function checkTelepfone(telepfone: HTMLInputElement) {
      const aNumber = +telepfone.value.toString().split("+").join("");
      if (
        telepfone.value.toString()[0] === "+" &&
        telepfone.value.toString().length >= 10 &&
        !isNaN(aNumber)
      ) {
        Validate(telepfone, "success");
      } else {
        Validate(
          telepfone,
          "error",
          "Формат ввода: +123456789(от 9 цифр после +)"
        );
      }
    }
    function checkAdres(adress: HTMLInputElement) {
      if (
        adress.value.toString().trim().split(" ").length >= 3 &&
        adress.value.toString().split(" ")[0].length >= 5 &&
        adress.value.toString().split(" ")[1].length >= 5 &&
        adress.value.toString().split(" ")[2].length >= 5
      ) {
        Validate(adress, "success");
      } else {
        Validate(adress, "error", "От 3-ёх слов от 5-ти символов каждое");
      }
    }
    function checkEmail(email: HTMLInputElement) {
      if (eml.test(email.value.toLowerCase())) {
        Validate(email, "success");
      } else {
        Validate(email, "error", "Формат ввода: email@gmail.com(ru)");
      }
    }

    function checkCard(cardnumber: HTMLInputElement) {
      const cardN: string = cardnumber.value
        .toString()
        .trim()
        .split(" ")
        .join("");
      if (+cardN.length === 16 && !isNaN(+cardN)) {
        Validate(cardnumber, "success");
      } else {
        Validate(cardnumber, "error", "Формат ввода:16 цифр");
      }

      cardnumber.oninput = function (event: Event) {
        const visa = document.querySelector(".visa") as HTMLInputElement;
        const { target } = event;
        const inp = (target as HTMLInputElement).value;
        if (+inp[0] === 4) {
          visa.src =
            "https://i.pinimg.com/474x/2e/85/de/2e85de7a272291a5f07d8f978a409fc3.jpg";
        } else if (+inp[0] === 5) {
          visa.src =
            "https://image.shutterstock.com/image-photo/image-260nw-277654622.jpg";
        } else if (+inp[0] === 6) {
          visa.src =
            "https://www.centrinvest.ru/images/news/02032016/mir-logo.jpg";
        } else {
          visa.src =
            "https://cdn.iconscout.com/icon/premium/png-128-thumb/shopping-payment-1950536-1647158.png";
        }
      };
    }
    function checkDate(date: HTMLInputElement) {
      if (mmyy.test(date.value) && +date.value.toString().length === 4) {
        const dm = date.value.toString().split("");
        date.value = dm[0] + dm[1] + "/" + dm[2] + dm[3];
        Validate(date, "success");
      } else {
        Validate(date, "error", "Формат ввода: 0723");
      }
    }
    function checkCvv(cvv: HTMLInputElement) {
      if (
        cv.test(cvv.value.toLowerCase()) &&
        +cvv.value.toString().length === 3
      ) {
        Validate(cvv, "success");
      } else {
        Validate(cvv, "error", "Введите: 3 цифры");
      }
    }

    const checkRequired = (items: HTMLInputElement[]) => {
      let schet = 0;
      items.forEach((item: HTMLInputElement) => {
        if (item.value.trim() === "") {
          Validate(
            item,
            "error",
            captializedNameOFInput(item) + " is required"
          );
        } else {
          Validate(item, "success");
          schet += 1;
          if (+schet === 7) {
            setTimeout(() => Submit(), 2000);
          }
        }
      });
    };

    const captializedNameOFInput = (item: HTMLInputElement) => {
      return item.id[0].toUpperCase() + item.id.slice(1);
    };

    form.addEventListener("submit", function (e: Event) {
      e.preventDefault();
      checkRequired([
        username,
        adress,
        email,
        telepfone,
        cardnumber,
        date,
        cvv,
      ]);
      checkUser(username);
      checkAdres(adress);
      checkEmail(email);
      checkTelepfone(telepfone);
      checkCard(cardnumber);
      checkDate(date);
      checkCvv(cvv);
    });
  }
}

function PayForm2() {
  const Cp = document.querySelector(".popup") as HTMLElement;
  Cp.classList.add("off");
  PayOn.classList.remove("off");
  korz.textContent = arrCart.length.toString();
  const form = document.getElementById("form") as HTMLFormElement;
  const username = document.getElementById("username") as HTMLInputElement;
  const adress = document.getElementById("adress") as HTMLInputElement;
  const email = document.getElementById("email") as HTMLInputElement;
  const telepfone = document.getElementById("telepfone") as HTMLInputElement;
  const cardnumber = document.getElementById("cardnumber") as HTMLInputElement;
  const date = document.getElementById("date") as HTMLInputElement;
  const cvv = document.getElementById("cvv") as HTMLInputElement;
  //regExp
  const eml =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const cv = /^[0-9]{3,4}$/;
  const mmyy = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
  const Validate = (
    item: HTMLElement,
    messageType: "success" | "error",
    message?: string
  ) => {
    const formControl = item.parentElement as HTMLDivElement;
    formControl.className =
      messageType === "error" ? "form-control error" : "form-control success";
    if (messageType === "error" && !!message) {
      const small = formControl.querySelector("small");
      (small as HTMLInputElement).innerHTML = message;
    }
  };
  function checkUser(username: HTMLInputElement) {
    if (
      username.value.toLowerCase().split(" ").length === 2 &&
      username.value.toLowerCase().split(" ")[0].length >= 3 &&
      username.value.toLowerCase().split(" ")[1].length >= 3
    ) {
      Validate(username, "success");
    } else {
      Validate(username, "error", "Введите два слова от 3 символов каждое ");
    }
  }
  function checkTelepfone(telepfone: HTMLInputElement) {
    const aNumber = +telepfone.value.toString().split("+").join("");
    if (
      telepfone.value.toString()[0] === "+" &&
      telepfone.value.toString().length >= 10 &&
      !isNaN(aNumber)
    ) {
      Validate(telepfone, "success");
    } else {
      Validate(
        telepfone,
        "error",
        "Формат ввода: +123456789(от 9 цифр после +)"
      );
    }
  }
  function checkAdres(adress: HTMLInputElement) {
    if (
      adress.value.toString().trim().split(" ").length >= 3 &&
      adress.value.toString().split(" ")[0].length >= 5 &&
      adress.value.toString().split(" ")[1].length >= 5 &&
      adress.value.toString().split(" ")[2].length >= 5
    ) {
      Validate(adress, "success");
    } else {
      Validate(adress, "error", "От 3-ёх слов от 5-ти символов каждое");
    }
  }
  function checkEmail(email: HTMLInputElement) {
    if (eml.test(email.value.toLowerCase())) {
      Validate(email, "success");
    } else {
      Validate(email, "error", "Формат ввода: email@gmail.com(ru)");
    }
  }

  function checkCard(cardnumber: HTMLInputElement) {
    const cardN = cardnumber.value.toString().trim().split(" ").join("");
    if (+cardN.length === 16 && !isNaN(+cardN)) {
      Validate(cardnumber, "success");
    } else {
      Validate(cardnumber, "error", "Формат ввода:16 цифр");
    }

    cardnumber.oninput = function (event: Event) {
      const visa = document.querySelector(".visa") as HTMLInputElement;
      const { target } = event;
      const inp = (target as HTMLInputElement).value;
      if (+inp[0] === 4) {
        visa.src =
          "https://i.pinimg.com/474x/2e/85/de/2e85de7a272291a5f07d8f978a409fc3.jpg";
      } else if (+inp[0] === 5) {
        visa.src =
          "https://image.shutterstock.com/image-photo/image-260nw-277654622.jpg";
      } else if (+inp[0] === 6) {
        visa.src =
          "https://www.centrinvest.ru/images/news/02032016/mir-logo.jpg";
      } else {
        visa.src =
          "https://cdn.iconscout.com/icon/premium/png-128-thumb/shopping-payment-1950536-1647158.png";
      }
    };
  }
  function checkDate(date: HTMLInputElement) {
    if (mmyy.test(date.value) && +date.value.toString().length === 4) {
      const dm = date.value.toString().split("");
      date.value = dm[0] + dm[1] + "/" + dm[2] + dm[3];
      Validate(date, "success");
    } else {
      Validate(date, "error", "Формат ввода: 0723");
    }
  }
  function checkCvv(cvv: HTMLInputElement) {
    if (
      cv.test(cvv.value.toLowerCase()) &&
      +cvv.value.toString().length === 3
    ) {
      Validate(cvv, "success");
    } else {
      Validate(cvv, "error", "Введите: 3 цифры");
    }
  }

  const checkRequired = (items: HTMLInputElement[]) => {
    let schet2 = 0;
    items.forEach((item: HTMLInputElement) => {
      if (item.value.trim() === "") {
        Validate(item, "error", captializedNameOFInput(item) + " is required");
      } else {
        Validate(item, "success");
        schet2 += 1;
        if (+schet2 === 7) {
          setTimeout(() => Submit(), 2000);
        }
      }
    });
  };

  const captializedNameOFInput = (item: HTMLInputElement) => {
    return item.id[0].toUpperCase() + item.id.slice(1);
  };

  form.addEventListener("submit", function (e: Event) {
    e.preventDefault();
    checkRequired([username, adress, email, telepfone, cardnumber, date, cvv]);
    checkUser(username);
    checkAdres(adress);
    checkEmail(email);
    checkTelepfone(telepfone);
    checkCard(cardnumber);
    checkDate(date);
    checkCvv(cvv);
  });
}

function changePlusMinus() {
  const HowItem = document.querySelectorAll<HTMLInputElement>(".how-item");
  const BtnPlusMinus =
    document.querySelectorAll<HTMLInputElement>(".btn-item-cart");
  const RightHow = document.querySelector(".right-how") as HTMLElement;

  RightHow.textContent = arrCart.length.toString();

  for (const how of Array.from(HowItem)) {
    how.value = "1";
  }

  for (const el of Array.from(BtnPlusMinus)) {
    el.addEventListener("click", function (e: Event) {
      const { target } = e;
      if ((target as HTMLInputElement).id.includes("add")) {
        let knopcount = +(el as HTMLInputElement).value;
        ++knopcount;
        (el as HTMLInputElement).value = knopcount.toString();
        for (const plus of Array.from(HowItem)) {
          if (+plus.id === +el.id.slice(7)) {
            plus.textContent = (el as HTMLInputElement).value;
            (plus as HTMLInputElement).value = (el as HTMLInputElement).value;
          }
        }
      }

      if ((target as HTMLInputElement).id.includes("del")) {
        for (const minus of Array.from(HowItem)) {
          if (+minus.id === +el.id.slice(7)) {
            let knopcountM = +(minus as HTMLInputElement).value;
            knopcountM = +knopcountM - 1;
            (el as HTMLInputElement).value = knopcountM.toString();
            (minus as HTMLInputElement).value = knopcountM.toString();
            minus.textContent = knopcountM.toString();
          }

          if (
            +(el as HTMLInputElement).value === 0 ||
            isNaN(+(el as HTMLInputElement).value)
          ) {
            let tempArr = [];
            tempArr = arrCart.filter(
              (item: ForData) => +item.id !== +el.id.slice(7)
            );
            arrCart = tempArr;
            if (arrCart.length < 1) {
              summ.textContent = "0";
            }
            OpenCart();
          }
        }
      }
      const PriceItem = document.querySelectorAll(".price-cart-d");
      const RightHow = document.querySelector(".right-how") as HTMLElement;
      const SM = document.querySelector(".SM") as HTMLElement;

      RightHow.textContent = arrCart.length.toString();
      let Preitog = 0;
      for (const itog of Array.from(HowItem)) {
        const transf = +(itog as HTMLInputElement).value;
        Preitog += transf;
        RightHow.textContent = Preitog.toString();
      }

      let PrePrice = 0;
      for (const price of Array.from(PriceItem)) {
        const priceC = +price.id * 1;
        PrePrice += priceC;
        summ.textContent = PrePrice.toString();
        SM.textContent = PrePrice.toString();
      }
    });
  }
}

function AddItems() {
  const BtnAddDel = Array.from(document.querySelectorAll(".btn-item"));

  for (const el of BtnAddDel) {
    el.addEventListener("click", function (e) {
      const { target } = e;
      const idBtn = +(target as HTMLInputElement).id.slice(7);

      let isDouble = [];
      isDouble = arrCart.filter((items: ForData) => +items.id == +idBtn);

      if (
        (target as HTMLInputElement).id.includes("add") &&
        isDouble.length < 1
      ) {
        arrCart.push(arrFirst[idBtn - 1]);
        korz.textContent = arrCart.length.toString();
        suma += +arrFirst[idBtn - 1].price;
        summ.textContent = suma.toString();
        const next = (target as HTMLInputElement).nextElementSibling;
        next?.classList.add("btn-in");
      }
      if (
        (target as HTMLInputElement).id.includes("del") &&
        arrCart.length > 0
      ) {
        let temp = [];
        temp = arrCart.filter((items: ForData) => +items.id !== +idBtn);
        arrCart = temp;
        if (isDouble.length) {
          suma = suma - +arrFirst[idBtn - 1].price;
          korz.textContent = arrCart.length.toString();
          summ.textContent = suma.toString();
          (target as HTMLInputElement).classList.remove("btn-in");
        }
      }
    });
  }
}
Logo.addEventListener("click", function () {
  const CartPage = document.querySelector(".cart-page") as HTMLElement;
  const Left = document.querySelector(".left") as HTMLElement;
  const Right = document.querySelector(".right") as HTMLElement;
  const Footer = document.querySelector(".footer") as HTMLElement;
  const Popup = document.querySelector(".popup") as HTMLElement;

  view.classList.remove("off");
  Left.classList.remove("off");
  Right.classList.remove("off");
  Footer.classList.remove("foot-down");
  CartPage.classList.add("off");
  Popup.classList.add("off");
  PayOn.classList.add("off");
  AddItems();
  ItemInCart();
  isTable ? createTable(arrCurrient) : createList(arrCurrient);
});

function Hleb() {
  const CartPage = document.querySelector(".cart-page") as HTMLElement;
  const Left = document.querySelector(".left") as HTMLElement;
  const Right = document.querySelector(".right") as HTMLElement;
  const Footer = document.querySelector(".footer") as HTMLElement;
  const Popup = document.querySelector(".popup") as HTMLElement;

  view.classList.remove("off");
  Left.classList.remove("off");
  Right.classList.remove("off");
  Footer.classList.remove("foot-down");
  CartPage.classList.add("off");
  Popup.classList.add("off");
  PayOn.classList.add("off");
  AddItems();
  ItemInCart();
  isTable ? createTable(arrCurrient) : createList(arrCurrient);
}

function Submit() {
  const CartPage = document.querySelector(".cart-page") as HTMLElement;
  const Left = document.querySelector(".left") as HTMLElement;
  const Right = document.querySelector(".right") as HTMLElement;
  const Footer = document.querySelector(".footer") as HTMLElement;
  const Popup = document.querySelector(".popup") as HTMLElement;

  view.classList.remove("off");
  Left.classList.remove("off");
  Right.classList.remove("off");
  Footer.classList.remove("foot-down");
  CartPage.classList.add("off");
  Popup.classList.add("off");
  PayOn.classList.add("off");

  isTable = true;
  isList = false;
  arrSmartCheckbox = [];
  isCheckOn = false;
  suma = 0;
  korz.textContent = "0";
  summ.textContent = "0";
  searchInput.value = "";
  (SortBy as HTMLInputElement).value = "";
  CheckSmart.checked = false;
  CheckNout.checked = false;
  CheckShirt.checked = false;
  CheckWatch.checked = false;
  createTable(arrFirst);
  location.href = "./index.html";
}
Reset.addEventListener("click", function () {
  Submit();
});

function setLocalStorage() {
  const a = isTable;
  localStorage.setItem("Table", JSON.stringify(a));

  const b = isList;
  localStorage.setItem("List", JSON.stringify(b));
}

function getLocalStorage() {
  const p = localStorage.getItem("Table");
  if (p) {
    isTable = JSON.parse(p);
  }

  const l = localStorage.getItem("List");
  if (l) {
    isList = JSON.parse(l);
  }
}

function ItemInCart() {
  const BtnAddDel = Array.from(document.querySelectorAll(".btn-item"));

  for (const el of BtnAddDel) {
    for (let i = 0; i < arrCart.length; i += 1) {
      if (+el.id.slice(7) === +arrCart[i].id && el.id.includes("del")) {
        el.classList.add("btn-in");
      }
    }
  }
}

function promokod() {
  const promo = document.getElementById("input") as HTMLInputElement;
  promo.oninput = function (event: Event) {
    const SM = document.querySelector(".SM") as HTMLElement;
    let TempPromo = 0;
    const { target } = event;
    const inp = (target as HTMLInputElement).value;
    if (inp === "Rss10" || inp === "rss10") {
      if (summ.textContent) {
        TempPromo = +summ.textContent * 0.9;
      }
      SM.textContent = TempPromo.toFixed(2).toString();
    } else if (inp === "Rss15" || inp === "rss15") {
      if (summ.textContent) {
        TempPromo = +summ.textContent * 0.85;
      }
      SM.textContent = TempPromo.toFixed(2).toString();
    } else {
      SM.textContent = summ.textContent;
    }
  };
}
console.log(score);
