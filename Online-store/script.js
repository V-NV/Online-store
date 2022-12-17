import data from './data.js';

const arrData = data;

createItemList(arrData)

function createItemList(Data) {
    const view = document.querySelector('.content');
    if(view) {
      view.innerHTML = '';
      for (let i = 0; i < Data.length; i += 1) {
        view.innerHTML += `
          <div class="item" id="item">
            <h2 class="item-name">${data[i].title}</h2>
            <div class="text-cont">
            <li class="item-discr">Брэнд: ${data[i].brand}</li>
            <li class="item-discr">Категория: ${data[i].category}</li>
            <li class="item-discr">Рейтинг: ${data[i].rating}</li>
            <li class="item-discr">Количество: ${data[i].stock}</li>
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
    }
  }

/*------------------------------swich-table-list------------------------------*/

let isTable= true;
let isList = false;

const List = document.getElementById("list");
List.addEventListener('click', function(){
    if(!isList){
let u = document.querySelectorAll(".item");
for(let el of u){
    el.classList.remove('item');
    el.classList.add('item-list');

    el.childNodes[1].className = 'off';
    el.childNodes[3].className = 'text-cont-list';
    el.childNodes[5].className = 'item-image-list';

}}
    isList = true;
    isTable = false;
});

const Table = document.getElementById("table");
Table.addEventListener('click', function(){
    if(!isTable){
let u = document.querySelectorAll(".item-list");
for(let el of u){
    el.classList.remove('item-list');
    el.classList.add('item');
   
    el.childNodes[1].className = 'item-name';
    el.childNodes[3].className = 'text-cont';
    el.childNodes[5].className = 'item-image';
}}




    isList = false;
    isTable = true;
    
   
});
/*------------------------------swich-table-list-END-----------------------------*/
let o = document.querySelector('.text-cont')
console.log(o.childNodes[1].className)
