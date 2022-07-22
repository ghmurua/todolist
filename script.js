const form  = document.querySelector('.form');
const text = document.querySelector('.text');
const list = document.querySelector('.list');
let c = 0;
let taskList = [];

const checked = (id) => {
    // console.log('id',id);
    document.querySelector(`#id${id}`).classList.toggle('active');

    let index = taskList.findIndex(x => x.id === id)
    taskList[index].status = !taskList[index].status;

    save();
}

const del = (id) => {
    taskList = taskList.filter(paq => paq.id != id)
    console.error(taskList);
    save();
    load();
}

const onScreen = (item) => {
    (item.status) ? check = 'active' : check = ''
    div = document.createElement("DIV");
	div.innerHTML = `
	<div id='id${item.id}' class="item ${check}"> ${item.value} </div>
    <button onclick='checked(${item.id})'>V</button>
    <button onclick='del("${item.id}")'>X</button>
    `;
    list.appendChild(div);
}

const counter = () => {
    c++;
    console.log('sumando',c);
}

const destroy = () => {
    localStorage.clear();
    console.error('todo borrado --x');
    load();
}

const save = () => {
    taskList[0] = c;
    localStorage.setItem("taskListStoraged", JSON.stringify(taskList));
    console.warn('enviando a localstorage -->');
}

const load = () => {
    taskList = JSON.parse(localStorage.getItem("taskListStoraged")) || [0];
    list.innerHTML = '';

    for ( let i=1; i<taskList.length; i++) {
        onScreen(taskList[i]);
    }

    c = taskList[0];
    console.warn('trayendo desde localstorage <--',taskList);
    return taskList;
}

const seeStorage = () => {
    console.error('que hay en storage?',JSON.parse(localStorage.getItem("taskListStoraged")));
}

const seeApp = () => {
    console.log('mirando contenido ._.',taskList);
}

const add = (txt) => {
    c++;
    let itemToStorage = {};
    itemToStorage.id = c;
    itemToStorage.value = txt;
    itemToStorage.status = true;
    console.log('itemToStorage',itemToStorage)

    taskList.push(itemToStorage);

    onScreen(itemToStorage);
    save();
    form.reset();
}

form.addEventListener('submit', e=>{
    e.preventDefault();
    add(text.value);
})

window.addEventListener("load",	load())