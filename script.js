const form  = document.querySelector('.form');
const text = document.querySelector('.text');
const list = document.querySelector('.list');
const tabs = document.querySelector('.tabs');
const tab1 = document.getElementById('tab1');
const tab2 = document.getElementById('tab2');
const tab3 = document.getElementById('tab3');
let c = 0;
let tab = 1;
let taskList = [0,[],[],[]];

const setTab = (t) =>{
    tab1.classList.remove('activeTab');
    tab2.classList.remove('activeTab');
    tab3.classList.remove('activeTab');
    document.getElementById(`tab${t}`).classList.add('activeTab');
    tab = t;
    load();
}

const checked = (id) => {
    if (document.querySelector(`#id${id}`).classList.contains('active')) end(id);
    document.getElementById(`id${id}`).classList.toggle('active');
    let i = taskList[tab].findIndex((e,i) => {
        if (e.id == id) return i
    })
    taskList[tab][i].status = !taskList[tab][i].status
    save();
}

const del = (id) => {
    let index = taskList[tab].findIndex((e,i) => {
        if (e.id == id) return i
    })
    taskList[tab].splice(index,1)
    save();
    load();
}

const up = (id) => {
    let index = taskList[tab].findIndex((e,i) => {
        if (e.id == id) return i
    })
    if (index > 1) {
        let movingTask = {
            id : taskList[tab][index].id,
            value: taskList[tab][index].value,
            status: taskList[tab][index].status
        }
        taskList[tab].splice(index,1)
        taskList[tab].splice(index-1,0,movingTask)
        save();
        load();
    }
}

const down = (id) => {
    let index = taskList[tab].findIndex((e,i) => {
        if (e.id == id) return i
    })
    if (index < (taskList[tab].length - 1)) {
        let movingTask = {
            id : taskList[tab][index].id,
            value: taskList[tab][index].value,
            status: taskList[tab][index].status
        }
        taskList[tab].splice(index,1)
        taskList[tab].splice(index+1,0,movingTask)
        save();
        load();
    }
}

const end = (id) => {
    let index = taskList[tab].findIndex((e,i) => {
        if (e.id == id) return i
    })
    let movingTask = {
        id : taskList[tab][index].id,
        value: taskList[tab][index].value,
        status: taskList[tab][index].status
    }
    taskList[tab].splice(index,1)
    taskList[tab].push(movingTask);
    save();
    load();
}

const onScreen = (item) => {
    (item.status) ? check = 'active' : check = ''
    div = document.createElement("DIV");
    div.setAttribute('class',`item ${check}`);
    div.setAttribute('id',`id${item.id}`)
	div.innerHTML = `
    <div class='move'>
        <button onclick='up(${item.id})'>
            <img src="svg/chevron-up.svg" alt="img-up">
        </button>
        <button onclick='down(${item.id})'>
            <img src="svg/chevron-down.svg" alt="img-down">
        </button>
    </div>

    <div class="task">
        ${item.value}
    </div>

    <button onclick='checked(${item.id})'>
        <img src="svg/check.svg" alt="img-check">
    </button>
    <button onclick='del(${item.id})'>
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
    taskList = JSON.parse(localStorage.getItem("taskListStoraged")) || [0,['A'],['B'],['C']];
    list.innerHTML = '';
    if (taskList[tab].length > 1) {
        for ( let i=1; i<taskList[tab].length; i++) {
            onScreen(taskList[tab][i])
        }
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
    taskList[tab].push(itemToStorage);
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

tab1.addEventListener('click',()=>setTab(1));
tab2.addEventListener('click',()=>setTab(2));
tab3.addEventListener('click',()=>setTab(3));
window.addEventListener('load', load());