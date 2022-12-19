import data from './data.js';
const view = document.querySelector('.content');
const arrData = data;
let arrTemp = [];//для первого вызванного фильтра
let arrCurrient = [];//текущее состояние массива
let isTable = true;//текущее отображение страницы
let isList = false;//текущее отображение страницы

createTable(arrData)//запуск при первой загрузке со всеми товарами 


/*----------------------отрисовка таблицой---------------------------- */

function createTable(Data) {
  arrTemp = [];
  arrCurrient = Data;//передача текущего состояния
   let data = Data;
    if(view) {
      view.innerHTML = '';
      for (let i = 0; i < Data.length; i += 1) {
        view.innerHTML += `
          <div class="item" id="${data[i].id}">
            <h2 class="item-name">${data[i].title}</h2>
            <div class="text-cont">
            <li class="item-discr">Брэнд: ${data[i].brand}</li>
            <li class="item-discr">Категория: ${data[i].category}</li>
            <li class="item-discr">Рейтинг: ${data[i].rating}</li>
            <li class="item-discr">Количество: ${data[i].stock}</li>
            <li class="item-price">Цена: $ ${data[i].price}</li>
            </div>
            <img class="item-image" src="${data[i].images[0]}">
            <div class="item-button-cont">
            <button class="btn-item" id="btn-add">Добавить в корзину</button>
            <button class="btn-item" id="btn-del">Удалить из корзины</button>
            </div>
          </div>
        `
      }
        const a = document.querySelector('.search-result')
      a.textContent = Data.length;
      noItems();
     }
  }
  
  /*----------------------отрисовка таблицой-конец--------------------------- */


  /*-------------------------отрисовка списком------------------------------- */

  function createList(Data) {
    arrTemp = [];
    arrCurrient = Data;//передача текущего состояния
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
              <img class="item-image-list" src="${data[i].images[0]}">
              <div class="item-button-cont-list">
              <h2 class="item-name">${data[i].title}</h2>
              <button class="btn-item" id="btn-add">Добавить в корзину</button>
              <button class="btn-item" id="btn-del">Удалить из корзины</button>
              </div>
            </div>
          `
        }
        isList = true;
        isTable = false;
        
        const a = document.querySelector('.search-result');
        a.textContent = Data.length;
        noItems(); 
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

const searchInput = document.querySelector('#input');

if (searchInput) {
  searchInput.oninput = function(event) {
 
    const ItemToDelete2  = document.querySelectorAll('.item-list');
    const ItemToDelete  = document.querySelectorAll('.item');

    const res = event.target.value
    let count = 0;
    const a = document.querySelector('.search-result')
    a.textContent = arrData.length;
    for (let i = 0; i < arrData.length; i += 1) {
                                                           //все варианты для поиска в одну строку       
      let SearchString = arrData[i].title + arrData[i].price.toString() + arrData[i].brand + arrData[i].stock.toString() + arrData[i].rating.toString() + arrData[i].category;
                    
      if (SearchString.toLowerCase().includes(res.toLowerCase() || res) == true ) {
        count += 1
          arrTemp.push(arrData[i])
       }
     }
     view.innerHTML = '';
    isTable?createTable(arrTemp):createList(arrTemp);
  }
}

/*-----------------------------Нет-товаров-----------------------------------*/

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