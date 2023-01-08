/* eslint-disable prettier/prettier */
import './nouislider.css';
import './style.css';
import data from './data';
import * as noUiSlider from 'nouislider';
import { ForData } from './types/inter';
window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);

const view = document.querySelector('.content') as HTMLElement;
const SortBy = document.querySelector('#sort-select') as HTMLElement;//сортировка
const CartIcon = document.querySelector('.cart') as HTMLElement;// при клике на корзину
const Logo = document.querySelector('.logo-header') as HTMLElement;// для возврата на главную по клику
const PayOn = document.querySelector('.cont-pay') as HTMLElement;
const korz = document.querySelector('.cartscore') as HTMLElement;// число товаров в корзине
const summ = document.querySelector('.header-summ') as HTMLElement;//сумма в корзине
const Reset = document.querySelector('.reset-filter') as HTMLElement;//кнопка reset
//const Bread = document.querySelector('.item-bread-link') as HTMLElement;//хлебные возврат
const Table = document.getElementById("table") as HTMLElement;
const List = document.getElementById("list") as HTMLElement;
const sliderStock = document.getElementById('slider-copies') as noUiSlider.target;
const sliderStockCounterStart = document.querySelector('#slider-copies-counter-start');
const sliderStockCounterEnd = document.querySelector('#slider-copies-counter-end');

const arrData = data;
const arrFirst = data.slice();
let arrCart: ForData[] = [];//массив карзины
let arrTemp: ForData[] = [];//для первого вызванного фильтра
let arrCurrient = arrData;//текущее состояние массива
let isTable = true;//текущее отображение страницы
let isList = false;//текущее отображение страницы
let arrSmartCheckbox: ForData[] = [];//массив smartfones
let isCheckOn = false; // состояние чекбокса верх
let isCheckOn2 = false;// состояние чекбокса низ
let isInCart = false;
let suma = 0;//сумма товаров в корзине для header
let arrSliders: ForData[] = [];
let stockCounterStart = 5;
let stockCounterEnd = 150;

function LS(){ 

if(localStorage.getItem('List') === 'true'){
createList(arrData)//запуск при первой загрузке со всеми товарами 
  }
else{
createTable(arrData)//запуск при первой загрузке со всеми товарами 
  }
}
LS();
console.log(arrData[0].title)
console.log(isTable,'isTable')
/*----------------------отрисовка таблицой---------------------------- */

function createTable(Data: ForData[]) {
  arrTemp = [];
  arrCurrient = Data;//передача текущего состояния
  Sort2(); 
  const data = arrCurrient;
  //const IdVerific = document.getElementsByClassName('item-image');
  
    if(view) {
      view.innerHTML = '';
      
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
            <img class="item-image" id="${data[i].id - 1}" alt="${data[i].title}" src="${data[i].thumbnail}">
            <div class="item-button-cont">
            <div class="btn-item" id="btn-add${data[i].id}">Добавить в корзину</div>
            <div class="btn-item" id="btn-del${data[i].id}">Удалить из корзины</div>
            </div>
          </div>
        `
            }
      /*for(let j = 0;j<arrFirst.length;j+=1){ 
        for (let i = 0; i < data.length; i += 1) {
          if(arrFirst[j].title == data[i].title){
            data[i].id = arrFirst[j].id
        }}
      }
        console.log(arrFirst[0].id,'arrFirst')
      console.log(arrCurrient[0].id,'arrCurrient')
      */
    }
    isList = false;
    isTable = true;
    Table.className = 'now';
    
    //localStorage.setItem('List', JSON.stringify(false))
    //localStorage.setItem('Table', JSON.stringify(true))
    const a = document.querySelector('.search-result') as HTMLElement;
    a.textContent = Data.length.toString();
    noItems();
     PopupOn();
     AddItems();
     ItemInCart();
  
  }
  /*----------------------отрисовка таблицой-конец--------------------------- */
 

  /*-------------------------отрисовка списком------------------------------- */

  function createList(Data: ForData[]) {
    arrTemp = [];
    arrCurrient = Data;//передача текущего состояния
    Sort2();
     const data = Data;
      if(view) {
        view.innerHTML = '';
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
              <img class="item-image-list" id="${data[i].id-1}" alt="${data[i].title}" src="${data[i].thumbnail}">
              <div class="item-button-cont-list">
              <h2 class="item-name">${data[i].title}</h2>
              <button class="btn-item" id="btn-add${data[i].id}">Добавить в корзину</button>
              <button class="btn-item" id="btn-del${data[i].id}">Удалить из корзины</button>
              </div>
            </div>
          `
        }
        isList = true;
        isTable = false;
        List.className = 'now';
        //localStorage.setItem('List', JSON.stringify(true))
        //localStorage.setItem('Table', JSON.stringify(false))
        const a = document.querySelector('.search-result') as HTMLElement;
        a.textContent = Data.length.toString();
        noItems();
         PopupOn();
         AddItems();
         ItemInCart();
       }
    }

/*-------------------------отрисовка-списком-конец----------------------------*/

/*----------------------------------------------------------------------------*/

/*------------------------------swich-table-list------------------------------*/
//const Table = document.getElementById("table");
//const List = document.getElementById("list");
//Table.className = 'now';

List.addEventListener('click', function(){
    if(!isList && arrCurrient.length < 1) {
      createList(arrData)
      Table.className = '';
      List.className = 'now';
      isList = true;
      isTable = false;
      localStorage.setItem('List', JSON.stringify(true))
      localStorage.setItem('Table', JSON.stringify(false))
    }
    if(!isList && arrCurrient.length > 0) {
      createList(arrCurrient)
      Table.className = '';
      List.className = 'now';
      isList = true;
      isTable = false;
      localStorage.setItem('List', JSON.stringify(true))
      localStorage.setItem('Table', JSON.stringify(false))
    }
    ItemInCart();
});


Table.addEventListener('click', function(){
  if(!isTable && arrCurrient.length < 1) {
    createTable(arrData)
    Table.className = 'now';
    List.className = '';
    isList = false;
    isTable = true;
    localStorage.setItem('List', JSON.stringify(false))
    localStorage.setItem('Table', JSON.stringify(true))
  }
  if(!isTable && arrCurrient.length > 0) {
    createTable(arrCurrient)
    Table.className = 'now';
    List.className = '';
    isList = false;
    isTable = true;
    localStorage.setItem('List', JSON.stringify(false))
    localStorage.setItem('Table', JSON.stringify(true))
  }
  ItemInCart();
});

/*------------------------------swich-table-list-END-----------------------------*/
/*let o = document.querySelector('.text-cont')
console.log(o.childNodes[1].className)*/
/*-----------------------------------Ввод-инпут----------------------------------*/

const searchInput = document.querySelector('#input') as HTMLInputElement;

if (searchInput) {
  searchInput.oninput = function(event:Event) {
 console.log(searchInput.value, 'введено');
    //const ItemToDelete2  = document.querySelectorAll('.item-list');
    //const ItemToDelete  = document.querySelectorAll('.item');
    let dataTA = arrData;
    const { target } = event;
    const res = (target as HTMLInputElement).value;
    
    const a = document.querySelector('.search-result') as HTMLElement;
   if(isCheckOn === true){dataTA = arrSmartCheckbox}//если включен чекбокс
   
    for (let i = 0; i < dataTA.length; i += 1) {
                                                           //все варианты для поиска в одну строку       
      const SearchString = dataTA[i].title + ' ' + dataTA[i].price.toString() + ' ' +  dataTA[i].brand + ' ' +  dataTA[i].stock.toString() + ' ' +  dataTA[i].rating.toString() + ' ' +  dataTA[i].category;
                    
      if (SearchString.toLowerCase().includes(res.toLowerCase() || res) == true ) {
       
          arrTemp.push(dataTA[i])
       }
     }
     view.innerHTML = '';
    isTable?createTable(arrTemp):createList(arrTemp);
  }
}
/*-----------------------------------Ввод-инпут----------------------------------*/

/*-----------------------------------Нет-товаров---------------------------------*/

function noItems(){
const a = document.querySelector('.search-result') as HTMLElement;
const b = document.querySelector('.no-items') as HTMLElement;
//if(a.textContent < 1) {  // тут было убито 3 часа
  if(arrCurrient.length < 1) {
b.classList.remove('off')
}
else{
b.classList.add('off')  
}
}

/*-----------------------------Нет-товаров-конец-----------------------------*/

/*--------------------------------Сортировка---------------------------------*/

//const SortBy = document.querySelector('#sort-select'); переместил вверх

/*-----------------------------Нет-товаров-конец-----------------------------*/
/*--------------------------------Сортировка---------------------------------*/
//const SortBy = document.querySelector('#sort-select'); переместил вверх
SortBy.addEventListener('change', Sort);
 
  function Sort():void {
    //console.log(SortBy.value,'текущая выбранная сортировка');
   
if (((SortBy) as HTMLInputElement).value) {
  arrCurrient.sort(function (a, b) {
    if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
    if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
    return 0;
  });
} else if (((SortBy) as HTMLInputElement).value === 'z-a') {
  arrCurrient.sort(function (a, b) {
    if (b.title.toLowerCase() < a.title.toLowerCase()) return -1;
    if (b.title.toLowerCase() > a.title.toLowerCase()) return 1;
    return 0;
  });
} else if (((SortBy) as HTMLInputElement).value == 'from-min') {
  arrCurrient.sort((a, b) => a.price*1 - b.price*1);
} else if (((SortBy) as HTMLInputElement).value === 'from-max') {
  arrCurrient.sort((a, b) => b.price*1 - a.price*1);
}
isTable?createTable(arrCurrient):createList(arrCurrient);
}
function Sort2() {//тоже что первая но без замыкания
 // console.log(((SortBy) as HTMLInputElement).value,'текущая выбранная сортировка');
if (((SortBy) as HTMLInputElement).value === 'a-z') {
arrCurrient.sort(function (a, b) {
  if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
  if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
  return 0;
});
} else if (((SortBy) as HTMLInputElement).value === 'z-a') {
arrCurrient.sort(function (a, b) {
  if (b.title.toLowerCase() < a.title.toLowerCase()) return -1;
  if (b.title.toLowerCase() > a.title.toLowerCase()) return 1;
  return 0;
});
} else if (((SortBy) as HTMLInputElement).value === 'from-min') {
arrCurrient.sort((a, b) => a.price*1 - b.price*1);
} else if (((SortBy) as HTMLInputElement).value === 'from-max') {
arrCurrient.sort((a, b) => b.price*1 - a.price*1);
}
}

/*--------------------------------Сортировка---------------------------------*/

/*---------------------------- -Чекбоксы-верхние-----------------------------*/
const BoxCategory = document.getElementById('category') as HTMLElement;//весь контейнер категории
const CheckSmart = document.getElementById('smart') as HTMLInputElement;
const CheckNout = document.getElementById('nout') as HTMLInputElement;
const CheckShirt = document.getElementById('shirt') as HTMLInputElement;
const CheckWatch = document.getElementById('watch') as HTMLInputElement;
//let ArrAllCategory:Array<T> = [];
//console.log(CheckSmart.checked)
BoxCategory.addEventListener('click',() => {
  //console.log(CheckSmart.checked)
  arrSmartCheckbox = [];// все зажатые
  const arrTempBox: ForData[] = [];//для конката
  let arrSmart: ForData [] = [];
  let arrNout: ForData [] = [];
  let arrShirt: ForData [] = [];
  let arrWatch: ForData [] = []; 
 // let checked:boolean = false;
    if (CheckSmart.checked) {
      arrSmart = [];
      arrSmart = arrData.filter((el) => el.category.includes('smartphones'));
    }
    if (CheckNout.checked) {
      arrNout = [];
      arrNout = arrData.filter((el) => el.category.includes('laptops'));
    }
    if (CheckShirt.checked) {
      arrShirt = [];
      arrShirt = arrData.filter((el) => el.category.includes('mens-shirts'));
    }
    if (CheckWatch.checked) {
      arrWatch = [];
      arrWatch = arrData.filter((el) => el.category.includes('mens-watches'));
    }  
    if(CheckSmart.checked || CheckNout.checked || CheckShirt || CheckWatch) {
      searchInput.value = '';// очистка инпута при выкл чекбокса
      searchInput.placeholder = 'Введите запрос'
      isCheckOn = true;
        arrSmartCheckbox = arrTempBox.concat(arrSmart, arrNout, arrShirt, arrWatch);
        isTable?createTable(arrSmartCheckbox):createList(arrSmartCheckbox);
    }  
      if(arrSmartCheckbox.length < 1){
        isCheckOn = false;
        isTable?createTable(arrData):createList(arrData);
      }
  });

/*---------------------------------Чекбоксы-END---------------------------------*/

/*----------------------------Чекбоксы-нижние------------------------------*/

const BoxBrand = document.getElementById('brand') as HTMLInputElement;//весь контейнер брэндов
const CheckApple = document.getElementById('apple') as HTMLInputElement;
const CheckWarhouse = document.getElementById('warhouse') as HTMLInputElement;
const CheckSkmei = document.getElementById('skmei') as HTMLInputElement;
const CheckSamsung = document.getElementById('samsung') as HTMLInputElement;
//let ArrAllBrand = [];
//console.log(CheckSmart.checked)
BoxBrand.addEventListener('click',() => {
  //console.log(CheckSmart.checked)
  //console.log(arrCategoryCheckbox)
  let arrBrandCheckbox: ForData[] = [];// все зажатые
  let arrTempBox: ForData[] = [];//для конката
  let arrApple: ForData[] = [];
  let arrWarhouse: ForData[] = [];
  let arrSkmei: ForData[] = [];
  let arrSamsung: ForData[] = []; 

    if (CheckApple.checked) {
      arrApple = [];
      arrApple = arrData.filter((el) => el.brand.includes('Apple'));
    }
    if (CheckWarhouse.checked) {
      arrWarhouse = [];
      arrWarhouse = arrData.filter((el) => el.brand.includes('The Warehouse'));
    }
    if (CheckSkmei.checked) {
      arrSkmei = [];
      arrSkmei = arrData.filter((el) => el.brand.includes('SKMEI 9117'));
    }
    if (CheckSamsung.checked) {
      arrSamsung = [];
      arrSamsung = arrData.filter((el) => el.brand.includes('Samsung'));
    }  
    if(CheckApple.checked || CheckWarhouse.checked || CheckSkmei.checked || CheckSamsung.checked) {
      searchInput.value = '';// очистка инпута при выкл чекбокса
      searchInput.placeholder = 'Введите запрос'
      isCheckOn2 = true;
        arrBrandCheckbox = arrTempBox.concat(arrApple, arrWarhouse, arrSkmei, arrSamsung);
        isTable?createTable(arrBrandCheckbox):createList(arrBrandCheckbox);
    }  
      if(arrBrandCheckbox.length < 1){
        isCheckOn2 = false;
        isTable?createTable(arrData):createList(arrData);
      }
  });

/*--------------------------Чекбоксы-нижние-END----------------------------*/

/*------------------------------Слайдер------------------------------------*/


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
  sliderStock.noUiSlider.on('update', function (values, handle) {
    const inputs = [sliderStockCounterStart as HTMLInputElement, sliderStockCounterEnd as HTMLInputElement];
    stockCounterStart = Math.round(+values[0]);
    stockCounterEnd = Math.round(+values[1]);
    inputs[handle].value = `${Math.round(+values[handle])}`;
     
    arrSliders = arrFirst.filter((item) => +item.stock >= stockCounterStart && +item.stock <= stockCounterEnd);
    isTable ? createTable(arrSliders) : createList(arrSliders);
    
  });
}
/*----------------------------------Слайдер-END---------------------------------*/

/*--------------------------------Карточки попап--------------------------------*/

function PopupOn(): void{
  
  const itemPopup = document.getElementsByClassName('item-image');
  const itemPopupList = document.getElementsByClassName('item-image-list');
  const Left = document.querySelector('.left') as HTMLElement;
  const Right = document.querySelector('.right') as HTMLElement;
  const Footer = document.querySelector('.footer') as HTMLElement;
  const Popup = document.querySelector('.popup') as HTMLElement;
  
  
  let elements = itemPopup;
  if(isTable){elements = itemPopup}
  if(isList){elements = itemPopupList}

  for(const el of Array.from(elements)) {
  el.addEventListener('click', function(event: Event) {
  const { target } = event;
  const elem = target
  const ID = (elem as HTMLInputElement).id;
  
  view.classList.add('off')
  Left.classList.add('off')
  Right.classList.add('off')
  Footer.classList.add('foot-down')
  ItemInCart();
  Popup.classList.remove('off')
  ItemInCart();
    Popup.innerHTML = '';
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
        <img class="item-image-pop" id="i${arrFirst[+ID].images[0]}" alt="${arrFirst[+ID].title}" src="${arrFirst[+ID].thumbnail}">
       </div>
       <div class="text-cont-pop">
        <li class="item-discr">Брэнд: ${arrFirst[+ID].brand}</li>
        <li class="item-discr">Категория: ${arrFirst[+ID].category}</li>
        <li class="item-discr">Рейтинг: ${arrFirst[+ID].rating}</li>
        <li class="item-discr">Скидка: ${arrFirst[+ID].discountPercentage} %</li>
        <li class="item-discr">Количество: ${arrFirst[+ID].stock}</li>
        <li class="item-price">Цена: $ ${arrFirst[+ID].price}</li>
        <div class="buy-now" id="${arrFirst[+ID].id}">Купить</div>
       <div class="arrow" id="left-arrow">&#8644</div>
      </div>
      </div>
          <div class="opisanie">Описание: ${arrFirst[+ID].description}</div>
        <div class="item-button-cont-pop">
          <button class="btn-item" id="btn-add${arrFirst[+ID].id}">Добавить в корзину</button>
          <button class="btn-item" id="btn-del${arrFirst[+ID].id}">Удалить из корзины</button>
        </div>
      </div>
    `
    ItemInCart();
    const Mov = document.querySelector('.item-image-pop') as HTMLInputElement;
    const btnChange = document.getElementById('left-arrow') as HTMLElement;
    const Bread = document.querySelector('.item-bread-link') as HTMLElement;

    Bread.addEventListener('click',Hleb);
    ItemInCart();
    const arrImg = arrFirst[+ID].images;
      
    let count = 0;
   
    btnChange.addEventListener('click', function(){
   
      if(count === 0 ){
        Mov.src = arrImg[count];
        count += 1;
      }
      else if(count > 0 && count < arrImg.length){
        Mov.src = arrImg[count];
        count += 1;
       }
       else if(count > arrImg.length){
        count = 0
        Mov.src = arrImg[count];
        count += 1;
       }
       else if(count < 0){
        count = 0;
        count = arrImg.length-1
        Mov.src = arrImg[count];
        count += 1;
       }
       else if(count == arrImg.length){
        count = 0;
        Mov.src = arrImg[count];
        count += 1;
       }
       
    })
   
    const ZoomImg = document.querySelector('.item-image-pop') as HTMLElement;
    ZoomImg.addEventListener('mouseover', function(){
        ZoomImg.classList.add('item-image-pop-on');
     })
    ZoomImg.addEventListener('mouseout', function(){
         ZoomImg.classList.remove('item-image-pop-on');
     })

    
     /*----------------------------------Быстрая оплата---------------------------------*/
     const QuickPay = document.querySelector('.buy-now') as HTMLElement;
     QuickPay.addEventListener('click',Quick);

function Quick(){
  //console.log(QuickPay)
let TempQ = [];
const Qid = +QuickPay.id 
TempQ = arrCart.filter((tov:ForData)=> +QuickPay.id === +tov.id)
if(TempQ.length > 0){
  console.log('больше')
  OpenCart()
 
}
if(TempQ.length === 0){
  console.log('ноль')
  arrCart.push(arrFirst[Qid-1])

PayForm2()
  console.log(arrCart)
  
}

}     


/*-------------------------------- Быстрая оплата End------------------------------*/
  AddItems();
  ItemInCart();
    const Exit = document.querySelector('.exit') as HTMLElement;
    Exit.addEventListener('click', function() {
      ItemInCart();
      Left.classList.remove('off')
      Right.classList.remove('off')
      Footer.classList.remove('foot-down')
      view.classList.remove('off');
      Popup.classList.add('off');
      Popup.innerHTML = '';
      ItemInCart();
      isTable?createTable(arrCurrient):createList(arrCurrient);

  })
});
  }

  ItemInCart();
}

/*--------------------------------Карточки попап-End-------------------------------*/



/*-------------------------------------корзина-------------------------------------*/
CartIcon.addEventListener('click',OpenCart);

function OpenCart(){
  const CartPage = document.querySelector('.cart-page') as HTMLElement;
  const Left = document.querySelector('.left') as HTMLElement;
  const Right = document.querySelector('.right') as HTMLElement;
  const Footer = document.querySelector('.footer') as HTMLElement;
  const popup = document.querySelector('.popup') as HTMLElement;
  
   korz.textContent = arrCart.length.toString();// отображение товаров в корзине

  view.classList.add('off');
  Left.classList.add('off');
  Right.classList.add('off');
  Footer.classList.add('foot-down');
  CartPage.classList.remove('off');
  PayOn.classList.add('off');
  popup.classList.add('off')

    CartPage.innerHTML = '';
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
    `
    const CartItem = document.querySelector('.left-cart-content') as HTMLElement;
    
    
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
    `
    const RightHow = document.querySelector('.right-how') as HTMLElement;// товаров всего
    RightHow.textContent = arrCart.length.toString();
    const SM = document.querySelector('.SM') as HTMLElement;// товаров всего
    SM.textContent = summ.textContent;

   changePlusMinus();//функция кнопок +- в корзине
  }
   /**************************************кнопка купить  и пустая корзина********************************/
   //let disabled:boolean = false;
  (document.querySelector('.btn-buy') as HTMLInputElement).disabled = false;
  if(arrCart.length < 1){
    (document.querySelector('.btn-buy') as HTMLInputElement).disabled = true;
    CartItem.innerHTML += `
    <p class="header-cart-sum">В корзине не товаров</p>
    <p class="header-cart-sum">Кнопка оплаты активна только при наличии товара в корзине</p>
    `
  }
 /***********************************кнопка купить и пустая корзина END********************************/ 
  
 /*********************************оплата***************************/

const Pay = document.querySelector('.btn-buy') as HTMLElement;
Pay.addEventListener('click', PayForm)

function PayForm():void {
CartPage.classList.add('off');
PayOn.classList.remove('off');
const form = document.getElementById("form") as HTMLFormElement;
const username = document.getElementById("username") as HTMLInputElement;
const adress = document.getElementById("adress") as HTMLInputElement;
const email = document.getElementById("email") as HTMLInputElement;
const telepfone = document.getElementById("telepfone") as HTMLInputElement;
const cardnumber = document.getElementById("cardnumber") as HTMLInputElement;
const date = document.getElementById("date") as HTMLInputElement;
const cvv = document.getElementById("cvv") as HTMLInputElement;
//regExp
const eml = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const cv = /^[0-9]{3,4}$/; 
const mmyy = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/; 
const Validate = (item: HTMLElement, messageType: 'success' | 'error', message?: string) => {
    const formControl = item.parentElement as HTMLDivElement;
    formControl.className = messageType === "error" ? "form-control error" : "form-control success";
    if (messageType === "error" && !!message) {
        const small = formControl.querySelector("small");
        (small as HTMLInputElement).innerHTML = message;
       }
};
function checkUser(username: HTMLInputElement) {
    if (username.value.toLowerCase().split(' ').length === 2 && username.value.toLowerCase().split(' ')[0].length >=3 && username.value.toLowerCase().split(' ')[1].length >=3) {
        
        Validate(username, "success");
    }
    else {
       Validate(username, "error", "Введите два слова от 3 символов каждое ");
    }
}
function checkTelepfone(telepfone: HTMLInputElement) {
    const aNumber = +telepfone.value.toString().split('+').join('');
    if (telepfone.value.toString()[0] === '+' && telepfone.value.toString().length >= 10 && !isNaN(aNumber) ) {
        Validate(telepfone, "success");
   }
    else {
      Validate(telepfone, "error", "Формат ввода: +123456789(от 9 цифр после +)");
    }
}
function checkAdres(adress: HTMLInputElement) {
    if (adress.value.toString().trim().split(' ').length >= 3 && adress.value.toString().split(' ')[0].length >=5 && adress.value.toString().split(' ')[1].length >=5 && adress.value.toString().split(' ')[2].length >=5) {
      Validate(adress, "success");
    }
    else {
      Validate(adress, "error", "От 3-ёх слов от 5-ти символов каждое");
    }
}
function checkEmail(email: HTMLInputElement) {
    if (eml.test(email.value.toLowerCase())) {
       Validate(email, "success");
    }
    else {
       Validate(email, "error", "Формат ввода: email@gmail.com(ru)");
    }
}

function checkCard (cardnumber: HTMLInputElement) {
    const cardN:string = cardnumber.value.toString().trim().split(' ').join('');
    if (+cardN.length === 16 && !isNaN(+cardN)) {
              Validate(cardnumber, "success");
   }
    else {
      // console.log(cardnumber.value.toString().trim().split(' ').join('').length)
        Validate(cardnumber, "error", "Формат ввода:16 цифр");
    }
    
    cardnumber.oninput = function(event:Event){
      const visa = document.querySelector('.visa') as HTMLInputElement;
      const { target } = event;
      const inp = (target as HTMLInputElement).value
      if(+inp[0] === 4){visa.src = 'https://i.pinimg.com/474x/2e/85/de/2e85de7a272291a5f07d8f978a409fc3.jpg'}
      else if(+inp[0] === 5){visa.src = 'https://image.shutterstock.com/image-photo/image-260nw-277654622.jpg'}
      else if(+inp[0] === 6){visa.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEcv9Ysyc9Vxe6uHhZptfkRheSF-0zXDRfpn2-fPFK06kY0lgtoicgzGCaNcZFrhYplw&usqp=CAU'}
         else{visa.src='https://cdn.iconscout.com/icon/premium/png-128-thumb/shopping-payment-1950536-1647158.png'}
    }
  
}
function checkDate(date: HTMLInputElement) {
    if (mmyy.test(date.value) && +date.value.toString().length === 4) {
        const dm = date.value.toString().split('');
        date.value = dm[0]+dm[1]+'/'+ +dm[2]+dm[3]
        Validate(date, "success");
       }
    else {
         Validate(date, "error", "Формат ввода: 0723");
    }
}
function checkCvv(cvv: HTMLInputElement) {
    if (cv.test(cvv.value.toLowerCase()) && +cvv.value.toString().length === 3) {
        Validate(cvv, "success");
    }
    else {
      Validate(cvv, "error", "Введите: 3 цифры");
    }
}

const checkRequired = (items: HTMLInputElement[]) => {
  let schet = 0;
    items.forEach((item: HTMLInputElement) => {
        if (item.value.trim() === "") {
            Validate(item, "error", captializedNameOFInput(item) + " is required");
            }
        else {
            Validate(item, "success");
            schet += 1;
            if(+schet === 7){  
            
            setTimeout(() => Submit(), 2000);
            }
         }
    });
};

const captializedNameOFInput = (item: HTMLInputElement) => {
     return item.id[0].toUpperCase() + item.id.slice(1);
};

form.addEventListener("submit", function (e:Event) {
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




/*********************************оплата END***************************/

};
/*********************************корзина END***************************/
/**pf2 */
function PayForm2() {
 const Cp = document.querySelector('.popup') as HTMLElement;
 Cp.classList.add('off')
 PayOn.classList.remove('off');
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
 const eml = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 const cv = /^[0-9]{3,4}$/; 
 const mmyy = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/; 
 const Validate = (item: HTMLElement, messageType: 'success' | 'error', message?: string) => {
     const formControl = item.parentElement as HTMLDivElement;
     formControl.className = messageType === "error" ? "form-control error" : "form-control success";
     if (messageType === "error" && !!message) {
         const small = formControl.querySelector("small");
         (small as HTMLInputElement).innerHTML = message;
        }
 };
 function checkUser(username: HTMLInputElement) {
     if (username.value.toLowerCase().split(' ').length === 2 && username.value.toLowerCase().split(' ')[0].length >=3 && username.value.toLowerCase().split(' ')[1].length >=3) {
         
         Validate(username, "success");
     }
     else {
        Validate(username, "error", "Введите два слова от 3 символов каждое ");
     }
 }
 function checkTelepfone(telepfone: HTMLInputElement) {
     const aNumber = +telepfone.value.toString().split('+').join('');
     if (telepfone.value.toString()[0] === '+' && telepfone.value.toString().length >= 10 && !isNaN(aNumber) ) {
         Validate(telepfone, "success");
    }
     else {
       Validate(telepfone, "error", "Формат ввода: +123456789(от 9 цифр после +)");
     }
 }
 function checkAdres(adress: HTMLInputElement) {
     if (adress.value.toString().trim().split(' ').length >= 3 && adress.value.toString().split(' ')[0].length >=5 && adress.value.toString().split(' ')[1].length >=5 && adress.value.toString().split(' ')[2].length >=5) {
       Validate(adress, "success");
     }
     else {
       Validate(adress, "error", "От 3-ёх слов от 5-ти символов каждое");
     }
 }
 function checkEmail(email: HTMLInputElement) {
     if (eml.test(email.value.toLowerCase())) {
        Validate(email, "success");
     }
     else {
        Validate(email, "error", "Формат ввода: email@gmail.com(ru)");
     }
 }
 
 function checkCard (cardnumber: HTMLInputElement) {
     const cardN = cardnumber.value.toString().trim().split(' ').join('');
     if (+cardN.length === 16 && !isNaN(+cardN)) {
               Validate(cardnumber, "success");
    }
     else {
       // console.log(cardnumber.value.toString().trim().split(' ').join('').length)
         Validate(cardnumber, "error", "Формат ввода:16 цифр");
     }
     
     cardnumber.oninput = function(event:Event){
       const visa = document.querySelector('.visa') as HTMLInputElement;
       const { target } = event;
       const inp = (target as HTMLInputElement).value
       if(+inp[0] === 4){visa.src = 'https://i.pinimg.com/474x/2e/85/de/2e85de7a272291a5f07d8f978a409fc3.jpg'}
       else if(+inp[0] === 5){visa.src = 'https://image.shutterstock.com/image-photo/image-260nw-277654622.jpg'}
       else if(+inp[0] === 6){visa.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEcv9Ysyc9Vxe6uHhZptfkRheSF-0zXDRfpn2-fPFK06kY0lgtoicgzGCaNcZFrhYplw&usqp=CAU'}
          else{visa.src='https://cdn.iconscout.com/icon/premium/png-128-thumb/shopping-payment-1950536-1647158.png'}
     }
   
 }
 function checkDate(date: HTMLInputElement) {
     if (mmyy.test(date.value) && +date.value.toString().length === 4) {
         const dm = date.value.toString().split('');
         date.value = dm[0]+dm[1]+'/'+ +dm[2]+dm[3]
         Validate(date, "success");
        }
     else {
          Validate(date, "error", "Формат ввода: 0723");
     }
 }
 function checkCvv(cvv: HTMLInputElement) {
     if (cv.test(cvv.value.toLowerCase()) && +cvv.value.toString().length === 3) {
         Validate(cvv, "success");
     }
     else {
       Validate(cvv, "error", "Введите: 3 цифры");
     }
 }
 
 const checkRequired = (items: HTMLInputElement[]) => {
   let schet2 = 0;
     items.forEach((item: HTMLInputElement) => {
         if (item.value.trim() === "") {
             Validate(item, "error", captializedNameOFInput(item) + " is required");
             }
         else {
             Validate(item, "success");
             schet2 += 1;
             if(+schet2 === 7){  
             
             setTimeout(() => Submit(), 2000);
             }
          }
     });
 };
 
 const captializedNameOFInput = (item: HTMLInputElement) => {
      return item.id[0].toUpperCase() + item.id.slice(1);
 };
 
 form.addEventListener("submit", function (e:Event) {
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
/*pf2-end*

/*********************************добавить удалить товар внутри корзины**************************/
let itog = 0;
function changePlusMinus(){
const HowItem = document.querySelectorAll<HTMLInputElement>('.how-item');//между + и -
const BtnPlusMinus = document.querySelectorAll<HTMLInputElement>('.btn-item-cart');
const RightHow = document.querySelector('.right-how') as HTMLElement;// товаров всего
RightHow.textContent = arrCart.length.toString();

for(const how of Array.from(HowItem)){
  how.value = '1';//для исключения NAN
}

//let knopcount = 0;

for(const el of Array.from(BtnPlusMinus)){//перебор кнопок
  
  el.addEventListener('click', function(e:Event) {//по нажатию на кнопку +-

    
    //let knop = e.target;
    const { target } = e;
    
    let idBtn = +(target as HTMLElement).id.slice(7);//id кнопки только цифры
    //console.log(knop,'эта кнопка нажата')
    
    
    //if(knop.id.includes('add')){// цикл для кнопок +
    if((target as HTMLInputElement).id.includes('add')){// цикл для кнопок +
    //console.log(el.value,'knop value')
      let knopcount = +(el as HTMLInputElement).value;//присвоение в счетчик текущего значения
      ++knopcount;//увеличение на 1
      (el as HTMLInputElement).value = knopcount.toString(); //присвоение увеличенного
          for(const plus of Array.from(HowItem)){//перебор всех полей между между кнопок +-
            if(+plus.id === +el.id.slice(7)){
              plus.textContent = (el as HTMLInputElement).value;// отображение текущего Value в поле между +-
              (plus as HTMLInputElement).value = (el as HTMLInputElement).value;
      console.log(plus.id,'+id')
      console.log(el.id.slice(7),'el id slice')
      console.log((plus as HTMLInputElement).value,'plus value')
      
      itog = +summ.textContent + +arrFirst[idBtn-1].price;
      console.log(arrFirst[idBtn-1].price,'first cost')
      console.log(itog,'itog')
      console.log(summ.textContent,'cumma')
          
    }
  }
  
}

if((target as HTMLInputElement).id.includes('del')){// цикл для кнопок -
  for(const minus of Array.from(HowItem)){//перебор всех полей между между кнопок +-
    if(+minus.id === +el.id.slice(7)){
     // console.log(el.value,'до клика на минус')
      let knopcountM = +(minus as HTMLInputElement).value;//присвоение в счетчик текущего значения поля между + и -
      knopcountM = +knopcountM - 1;//уменьшение на 1
      (el as HTMLInputElement).value = knopcountM.toString(); //присвоение уменьшенного
      (minus as HTMLInputElement).value = knopcountM.toString();// присвоение текущего значение после вычета
      minus.textContent = knopcountM.toString();//отображение текущего значения после вычета
    }
 
   //console.log(el.value,'после клика на минус')
      if(+(el as HTMLInputElement).value === 0 || isNaN(+(el as HTMLInputElement).value)) {//удаление товара если 0
        let tempArr = [];
        tempArr = arrCart.filter((item: ForData)=> +item.id !== +el.id.slice(7));
        arrCart = tempArr;
        if(arrCart.length < 1){summ.textContent = '0'}
        OpenCart();

      }
 
  }
}
/******************************отображение итого товаров и суммы ********************************/

 const PriceItem = document.querySelectorAll('.price-cart-d');
 const RightHow = document.querySelector('.right-how') as HTMLElement;//между + и -
 const HSUMM = document.querySelector('.header-summ') as HTMLElement;
const SM = document.querySelector('.SM') as HTMLElement;

 RightHow.textContent = arrCart.length.toString();
 let Preitog = 0;
 for(const itog of Array.from(HowItem)){//перебор всех полей между между кнопок +-
 // console.log(itog.value)
  const transf = +(itog as HTMLInputElement).value;
  Preitog += transf;
  console.log(Preitog,'preitog')
  RightHow.textContent = Preitog.toString();

}

let PrePrice = 0;
 for(const price of Array.from(PriceItem)){//перебор всех полей между между кнопок +-
  //console.log(price.id*1)
  const priceC = +price.id*1;
  PrePrice += priceC;
 // console.log(PrePrice*1,'PrePrice')
 
  HSUMM.textContent = PrePrice.toString();
  SM.textContent = PrePrice.toString();
  //RightHow.textContent = Preitog
}
 




/******************************отображение итого товаров и суммы ********************************/



  })
  }
 
}

/*****************************добавить удалить товар внутри корзины END**************************/



/******************добавление/удаление товара в корзину END*************/

function AddItems(){
const BtnAddDel =  Array.from(document.querySelectorAll('.btn-item'));
//const MainCart = document.querySelector('.cart');
//let suma = 0; вынесенно вверх

for(const el of BtnAddDel){
el.addEventListener('click', function(e) {
  //const korz = document.querySelector('.cartscore');//вынесено вверх
 // const summ = document.querySelector('.header-summ');//вынесено вверх
  
  //let knop = e.target;
  const { target } = e;
  //console.log(knop,'эта кнопка нажата')
  const idBtn = +(target as HTMLInputElement).id.slice(7);

  let isDouble = [];
  isDouble = arrCart.filter((items: ForData) => +items.id == +idBtn);

if((target as HTMLInputElement).id.includes('add') && isDouble.length < 1){
    arrCart.push(arrFirst[idBtn-1])
    korz.textContent = arrCart.length.toString();
    suma += +arrFirst[idBtn-1].price;
    summ.textContent = suma.toString();
    let next = this.nextElementSibling
    //console.log(this.nextElementSibling)
    next.classList.add('btn-in');
}
    //const textId = (target as HTMLInputElement).id.slice(0,7)
    //console.log(textId,'textId')
    if((target as HTMLInputElement).id.includes('del') && arrCart.length>0) {
     // console.log(arrCart,'arrCart до фильтра')
     let temp = [];
     temp = arrCart.filter((items:ForData) => +items.id !== +idBtn)
     // console.log(arrTemp,'arrTemp')
     arrCart = temp; 
     //console.log(arrCart,'arrCart после фильтра')
     if(isDouble.length){
     suma = suma - +arrFirst[idBtn-1].price;
     korz.textContent = arrCart.length.toString();
     summ.textContent = suma.toString();
     this.classList.remove('btn-in');
     }
      }
      //}
})
}
}
/********************LOGO CLICK***************/
Logo.addEventListener('click',function(){
  const CartPage = document.querySelector('.cart-page') as HTMLElement;
  const Left = document.querySelector('.left') as HTMLElement;
  const Right = document.querySelector('.right') as HTMLElement;
  const Footer = document.querySelector('.footer') as HTMLElement;
  const Popup = document.querySelector('.popup') as HTMLElement;

  view.classList.remove('off')
  Left.classList.remove('off')
  Right.classList.remove('off')
  Footer.classList.remove('foot-down')
  CartPage.classList.add('off')
  Popup.classList.add('off')
  PayOn.classList.add('off');
  AddItems();
  ItemInCart();
      isTable?createTable(arrCurrient):createList(arrCurrient);
});

/********************LOGO CLICK***************/
function Hleb(){
  const CartPage = document.querySelector('.cart-page') as HTMLElement;
  const Left = document.querySelector('.left') as HTMLElement;
  const Right = document.querySelector('.right') as HTMLElement;
  const Footer = document.querySelector('.footer') as HTMLElement;
  const Popup = document.querySelector('.popup') as HTMLElement;

  view.classList.remove('off')
  Left.classList.remove('off')
  Right.classList.remove('off')
  Footer.classList.remove('foot-down')
  CartPage.classList.add('off')
  Popup.classList.add('off')
  PayOn.classList.add('off');
  AddItems()
  ItemInCart();
      isTable?createTable(arrCurrient):createList(arrCurrient);

}


/*****************bread click End**************/

/**********************кнопка rest *****************************/

function Submit(){
  
  const CartPage = document.querySelector('.cart-page') as HTMLElement;
  const Left = document.querySelector('.left') as HTMLElement;
  const Right = document.querySelector('.right') as HTMLElement;
  const Footer = document.querySelector('.footer') as HTMLElement;
  const Popup = document.querySelector('.popup') as HTMLElement;

  view.classList.remove('off')
  Left.classList.remove('off')
  Right.classList.remove('off')
  Footer.classList.remove('foot-down')
  CartPage.classList.add('off')
  Popup.classList.add('off')
  PayOn.classList.add('off');
  let arrCart = [];//массив карзины
  const arrTemp = [];//для первого вызванного фильтра
  
  isTable = true;//текущее отображение страницы
  isList = false;//текущее отображение страницы
  arrSmartCheckbox = [];//массив smartfones
  isCheckOn = false; // состояние чекбокса
  suma = 0;//сумма товаров в корзине для header
  korz.textContent = '0';
  summ.textContent = '0';
  searchInput.value = '';
  (SortBy as HTMLInputElement).value = '';
  CheckSmart.checked = false;
  CheckNout.checked = false;
  CheckShirt.checked = false;
  CheckWatch.checked = false;
  arrCart = [];
  createTable(arrFirst);
  location.href = './index.html';
  
}
Reset.addEventListener('click', function(){
  Submit();
})
/**********************кнопка reset *****************************/

/************************localStorag******************************/

/*--------------set-----local----storage----------- */

function setLocalStorage() {
  
    const a = isTable //текущее значение
    localStorage.setItem('Table', JSON.stringify(a));
    
   
    const b = isList
    localStorage.setItem('List', JSON.stringify(b));
   // console.log(isTable,'set isTable')
   // console.log(isList,'set isList')
}

/*-------------get--local--storage----------- */
function getLocalStorage() {
    
  const p = localStorage.getItem('Table');
  if(p){
  isTable = JSON.parse(p);
 // console.log(isTable,'get isTable')
  }
 else{
  isTable = JSON.parse(p!);
 // console.log(isTable,'get isTable')
  }

  const l = localStorage.getItem('List');
  if(l){
  isList = JSON.parse(l)
 // console.log(isList,'get isList')
  }
  else{
  isList = JSON.parse(l!)
 // console.log(isList,'get isList')
  } 
    }
   /*-------------------end--local--storage------ */

/************************localStorag******************************/

/*************************подсветка в корзине*********************/
function ItemInCart(){
  const BtnAddDel =  Array.from(document.querySelectorAll('.btn-item'));

  for(const el of BtnAddDel){
  for (let i = 0; i < arrCart.length; i += 1) {
if((el.id).includes(`${arrCart[i].id}`) && el.id.includes('del')){
  el.classList.add('btn-in');
//console.log(arrCart[i].id)
//console.log(el.id)
   }
  }
 }
}
/*********************подсветка в корзине END*********************/
function itogi(x:string){
  console.log(x,'xxxx')
  const tog = document.querySelector('.header-summ') as HTMLInputElement;
  const tog2 = document.querySelector('.SM') as HTMLElement;
  tog.innerText = x;
  tog2.innerText = x;

}
//itogi('4444444444444444')