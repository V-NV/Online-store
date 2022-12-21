import data from './data.js';
const view = document.querySelector('.content');
const arrData = data;
let arrTemp = [];//для первого вызванного фильтра
let arrCurrient = arrData;//текущее состояние массива
let isTable = true;//текущее отображение страницы
let isList = false;//текущее отображение страницы
let arrSmartCheckbox = [];//массив smartfones
let isCheckOn = false; // состояние чекбокса

createTable(arrData)//запуск при первой загрузке со всеми товарами 


/*----------------------отрисовка таблицой---------------------------- */

function createTable(Data) {
  arrTemp = [];
  arrCurrient = Data;//передача текущего состояния
   let data = arrCurrient;
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

const SortBy = document.querySelector('#sort-select');

SortBy.addEventListener('change', () => {
 
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
});

/*--------------------------------Сортировка---------------------------------*/

/*---------------------------------Чекбоксы----------------------------------*/
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


