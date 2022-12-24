import data from './data.js';
const view = document.querySelector('.content');
const SortBy = document.querySelector('#sort-select');//сортировка
const arrData = data;
const arrFirst = data.slice();
let arrTemp = [];//для первого вызванного фильтра
let arrCurrient = arrData;//текущее состояние массива
let isTable = true;//текущее отображение страницы
let isList = false;//текущее отображение страницы
let arrSmartCheckbox = [];//массив smartfones
let isCheckOn = false; // состояние чекбокса

createTable(arrData)//запуск при первой загрузке со всеми товарами 

console.log(arrData[0].title)
/*----------------------отрисовка таблицой---------------------------- */

function createTable(Data) {
  arrTemp = [];
  arrCurrient = Data;//передача текущего состояния
  Sort2(); 
  let data = arrCurrient;
  let IdVerific = document.getElementsByClassName('item-image')
  
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
            <button class="btn-item" id="btn-add${data[i].id}">Добавить в корзину</button>
            <button class="btn-item" id="btn-del${data[i].id}">Удалить из корзины</button>
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
    
    const a = document.querySelector('.search-result');
    a.textContent = Data.length;
    noItems();
     PopupOn();
  
  }
  /*----------------------отрисовка таблицой-конец--------------------------- */
 

  /*-------------------------отрисовка списком------------------------------- */

  function createList(Data) {
    arrTemp = [];
    arrCurrient = Data;//передача текущего состояния
    Sort2();
     let data = Data;
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
        
        const a = document.querySelector('.search-result');
        a.textContent = Data.length;
        noItems();
         PopupOn();
       }
    }

/*-------------------------отрисовка-списком-конец----------------------------*/

/*----------------------------------------------------------------------------*/

/*------------------------------swich-table-list------------------------------*/

const List = document.getElementById("list");
List.addEventListener('click', function(){
    if(!isList && arrCurrient.length < 1) {
      createList(arrData)
      isList = true;
      isTable = false;
    }
    if(!isList && arrCurrient.length > 0) {
      createList(arrCurrient)
      isList = true;
      isTable = false;
    }
});

const Table = document.getElementById("table");
Table.addEventListener('click', function(){
  if(!isTable && arrCurrient.length < 1) {
    createTable(arrData)
    isList = false;
    isTable = true;
  }
  if(!isTable && arrCurrient.length > 0) {
    createTable(arrCurrient)
    isList = false;
    isTable = true;
  }
});

/*------------------------------swich-table-list-END-----------------------------*/
/*let o = document.querySelector('.text-cont')
console.log(o.childNodes[1].className)*/
/*-----------------------------------Ввод-инпут----------------------------------*/

const searchInput = document.querySelector('#input');

if (searchInput) {
  searchInput.oninput = function(event) {
 console.log(searchInput.value, 'введено')
    const ItemToDelete2  = document.querySelectorAll('.item-list');
    const ItemToDelete  = document.querySelectorAll('.item');
    let dataTA = arrData;
    const res = event.target.value
    
    const a = document.querySelector('.search-result')
   if(isCheckOn === true){dataTA = arrSmartCheckbox}//если включен чекбокс
   
    for (let i = 0; i < dataTA.length; i += 1) {
                                                           //все варианты для поиска в одну строку       
      let SearchString = dataTA[i].title + ' ' + dataTA[i].price.toString() + ' ' +  dataTA[i].brand + ' ' +  dataTA[i].stock.toString() + ' ' +  dataTA[i].rating.toString() + ' ' +  dataTA[i].category;
                    
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
const a = document.querySelector('.search-result')
const b = document.querySelector('.no-items')
if(a.textContent < 1){
  b.classList.remove('off')
}
else{
b.classList.add('off')  
}
}

/*-----------------------------Нет-товаров-конец-----------------------------*/

/*--------------------------------Сортировка---------------------------------*/

//const SortBy = document.querySelector('#sort-select'); переместил вверх

SortBy.addEventListener('change', Sort);
 
  function Sort() {
    console.log(SortBy.value,'текущая выбранная сортировка');
if ((SortBy).value == 'a-z') {
  arrCurrient.sort(function (a, b) {
    if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
    if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
    return 0;
  });
} else if ((SortBy).value == 'z-a') {
  arrCurrient.sort(function (a, b) {
    if (b.title.toLowerCase() < a.title.toLowerCase()) return -1;
    if (b.title.toLowerCase() > a.title.toLowerCase()) return 1;
    return 0;
  });
} else if ((SortBy).value == 'from-min') {
  arrCurrient.sort((a, b) => a.price*1 - b.price*1);
} else if ((SortBy).value == 'from-max') {
  arrCurrient.sort((a, b) => b.price*1 - a.price*1);
}
isTable?createTable(arrCurrient):createList(arrCurrient);
}
function Sort2() {//тоже что первая но без замыкания
  console.log(SortBy.value,'текущая выбранная сортировка');
if ((SortBy).value == 'a-z') {
arrCurrient.sort(function (a, b) {
  if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
  if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
  return 0;
});
} else if ((SortBy).value == 'z-a') {
arrCurrient.sort(function (a, b) {
  if (b.title.toLowerCase() < a.title.toLowerCase()) return -1;
  if (b.title.toLowerCase() > a.title.toLowerCase()) return 1;
  return 0;
});
} else if ((SortBy).value == 'from-min') {
arrCurrient.sort((a, b) => a.price*1 - b.price*1);
} else if ((SortBy).value == 'from-max') {
arrCurrient.sort((a, b) => b.price*1 - a.price*1);
}
}

/*--------------------------------Сортировка---------------------------------*/

/*---------------------------- -Чекбоксы-верхние-----------------------------*/
const BoxCategory = document.getElementById('category');//весь контейнер категории
const CheckSmart = document.getElementById('smart');
const CheckNout = document.getElementById('nout');
const CheckShirt = document.getElementById('shirt');
const CheckWatch = document.getElementById('watch');
let ArrAllCategory = [];
//console.log(CheckSmart.checked)
BoxCategory.addEventListener('click',() => {
  //console.log(CheckSmart.checked)
  arrSmartCheckbox = [];// все зажатые
  let arrTempBox = [];//для конката
  let arrSmart = [];
  let arrNout = [];
  let arrShirt = [];
  let arrWatch = []; 

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

/*--------------------------------Карточки попап--------------------------------*/

function PopupOn(){
  
  const itemPopup = document.getElementsByClassName('item-image');
  const itemPopupList = document.getElementsByClassName('item-image-list');
  const Left = document.querySelector('.left');
  const Right = document.querySelector('.right');
  const Footer = document.querySelector('.footer');
  const Popup = document.querySelector('.popup');

  
  let elements = [];
  if(isTable){elements = itemPopup}
  if(isList){elements = itemPopupList}

  for(let el of elements){
  el.addEventListener('click', function(event) {
  
  let elem = event.target
  let ID = elem.id;
 
  view.classList.add('off')
  Left.classList.add('off')
  Right.classList.add('off')
  Footer.classList.add('foot-down')

  Popup.classList.remove('off')

    Popup.innerHTML = '';
    Popup.innerHTML += `
    <div class="item-pop" id="${ID}}">
         <div class="exit">х</div>
         <h2 class="item-name-pop">${arrFirst[ID].title}</h2>
       <div class="cont-box-pop">
        <div class="img-box-pop">
        <img class="item-image-pop" id="i${arrFirst[ID].images[0]}" alt="${arrFirst[ID].title}" src="${arrFirst[ID].thumbnail}">
       </div>
       <div class="text-cont-pop">
        <li class="item-discr">Брэнд: ${arrFirst[ID].brand}</li>
        <li class="item-discr">Категория: ${arrFirst[ID].category}</li>
        <li class="item-discr">Рейтинг: ${arrFirst[ID].rating}</li>
        <li class="item-discr">Скидка: ${arrFirst[ID].discountPercentage} %</li>
        <li class="item-discr">Количество: ${arrFirst[ID].stock}</li>
        <li class="item-price">Цена: $ ${arrFirst[ID].price}</li>
       <div class="arrow" id="left-arrow">&#8644</div>
      </div>
      </div>
          <div class="opisanie">Описание: ${arrFirst[ID].description}</div>
        <div class="item-button-cont-pop">
          <button class="btn-item" id="btn-add${arrFirst[ID].id}">Добавить в корзину</button>
          <button class="btn-item" id="btn-del${arrFirst[ID].id}">Удалить из корзины</button>
        </div>
      </div>
    `
    const Mov = document.querySelector('.item-image-pop');
    const btnChange = document.getElementById('left-arrow');
       
    let arrImg = arrFirst[ID].images;
      
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
   
    const ZoomImg = document.querySelector('.item-image-pop');
    ZoomImg.addEventListener('mouseover', function(){
        ZoomImg.classList.add('item-image-pop-on');
     })
    ZoomImg.addEventListener('mouseout', function(){
         ZoomImg.classList.remove('item-image-pop-on');
     })
  
    const Exit = document.querySelector('.exit');
    Exit.addEventListener('click', function() {
      
      Left.classList.remove('off')
      Right.classList.remove('off')
      Footer.classList.remove('foot-down')
      view.classList.remove('off');
      Popup.classList.add('off');
      Popup.innerHTML = '';
   
  })
})
  }
}
  

