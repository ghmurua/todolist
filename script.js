const form  = document.querySelector('.form');
const text = document.querySelector('.text');
const list = document.querySelector('.list');
let c = 0;
let taskList = [];

const checked = (id) => {
    document.querySelector(`#id${id}`).classList.toggle('active');

    let i = taskList.findIndex(x => x.id === id)
    taskList[i].status = !taskList[i].status;

    save();
}

const del = (id) => {
    taskList = taskList.filter(tsk => tsk.id != id)

    save();
    load();
}

const up = (id) => {
    let i = taskList.findIndex(x => x.id === id)

    if (i > 1) {
        let auxId = taskList[i-1].id;
        let auxValue = taskList[i-1].value;
        let auxStatus = taskList[i-1].status;

        taskList[i-1].id = taskList[i].id;
        taskList[i-1].value = taskList[i].value;
        taskList[i-1].status = taskList[i].status;

        taskList[i].id = auxId;
        taskList[i].value = auxValue;
        taskList[i].status = auxStatus;

        save();
        load();
    }
}

const down = (id) => {
    let i = taskList.findIndex(x => x.id === id)

    if (i < (taskList.length - 1)) {
        let auxId = taskList[i+1].id;
        let auxValue = taskList[i+1].value;
        let auxStatus = taskList[i+1].status;

        taskList[i+1].id = taskList[i].id;
        taskList[i+1].value = taskList[i].value;
        taskList[i+1].status = taskList[i].status;

        taskList[i].id = auxId;
        taskList[i].value = auxValue;
        taskList[i].status = auxStatus;

        save();
        load();
    }
}

const onScreen = (item) => {
    (item.status) ? check = 'active' : check = ''
    div = document.createElement("DIV");
    div.setAttribute('class','item');
	div.innerHTML = `
    <div class='move'>
        <button onclick='up(${item.id})'>
            <img src="svg/chevron-up.svg" alt="img-up">
        </button>
        <button onclick='down(${item.id})'>
            <img src="svg/chevron-down.svg" alt="img-down">
        </button>
    </div>

    <div id='id${item.id}' class="task ${check}"> ${item.value} </div>

    <button onclick='checked(${item.id})'>
        <img src="svg/check.svg" alt="img-check">
    </button>
    <button onclick='del("${item.id}")'>
        <img src="svg/close.svg" alt="img-delete">
    </button>
    `;
    list.appendChild(div);
}

const save = () => {
    taskList[0] = c;
    localStorage.setItem("taskListStoraged", JSON.stringify(taskList));
}

const load = () => {
    taskList = JSON.parse(localStorage.getItem("taskListStoraged")) || [0];
    list.innerHTML = '';

    for ( let i=1; i<taskList.length; i++) {
        onScreen(taskList[i]);
    }

    c = taskList[0];

    return taskList;
}

const add = (txt) => {
    c++;
    let itemToStorage = {};
    itemToStorage.id = c;
    itemToStorage.value = txt;
    itemToStorage.status = true;

    taskList.push(itemToStorage);

    onScreen(itemToStorage);
    save();
    form.reset();
}

form.addEventListener('submit', e=>{
    e.preventDefault();
    let txt = text.value.trim();

    if (txt != '') {
        text.focus();
        add(txt);
    }
})

window.addEventListener("load",	load())