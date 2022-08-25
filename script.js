const form  = document.querySelector('.form');
const inputText = document.querySelector('.input-text');
const list = document.querySelector('.list');
const tabs = document.querySelector('.tabs');
const modal = document.querySelector('.modal');
const modalTabs = document.querySelector('.modal-tabs');
const btnAddTab = document.querySelector('.btn-addTab');

let c = 0;
let tab = 1;
let taskList = [];
let totalTabs = 1;

//  M O D A L,  T A B S 

const showTabs = () => {
    tabs.innerHTML = '';
    totalTabs = 0;
    for ( let i=1; i<taskList.length; i++) {
        (tab === i) 
        ? tabs.innerHTML += `
        <div id="tab${i}" class="active-tab">
            ${taskList[i][0]}
        </div>`
        : tabs.innerHTML += `
        <div id="tab${i}">
            ${taskList[i][0]}
        </div>`;
        totalTabs++;
    }
    for ( let i=1; i<taskList.length; i++) {
        document.getElementById(`tab${i}`).addEventListener('click',()=>setTab(i));
    }
    (totalTabs < 5)
    ? btnAddTab.setAttribute('class','btn-addTab')
    : btnAddTab.setAttribute('class','btn-addTab hidden')
}

const refreshModal = () => {
    modalTabs.innerHTML = '';
    for ( let i=1; i<taskList.length; i++) {
        (i === totalTabs && totalTabs > 1)
        ? modalTabs.innerHTML += `
        <div>
            <input type="text" id="tabName${i}" value="${taskList[i][0]}"></input>
            <button class="btn-delTab">
                <img src="svg/bx-minus.svg" alt="img-up">
            </button>
        </div>`
        : modalTabs.innerHTML += `
        <div>
            <input type="text" id="tabName${i}" value="${taskList[i][0]}"></input>
        </div>`
    }
}

const showTabsModal = () =>{
    refreshModal();
    modal.showModal();
}

const updateTabNames = () => {
    for ( let i=1; i<=totalTabs; i++) {
        let tabName = document.getElementById(`tabName${i}`).value.trim();
        if (tabName.length > 0) taskList[i][0] = tabName;
    }
}

const closeTabsModal = () => {
    modal.close();
    updateTabNames();
    save();
}

const delTab = (e) => {
    updateTabNames();
    if (e.target.tagName === 'IMG') {
        if (totalTabs > 1) {
            taskList.pop();
            if (tab === totalTabs) tab--;
            save();
            refreshModal();
        }
    }
}

const addTab = () => {
    updateTabNames();
    if (totalTabs < 5) {
        taskList.push(['New Tab']);
        save();
        refreshModal();
    }
}

const setTab = (t) =>{
    for ( let i=1; i<taskList.length; i++) {
        document.getElementById(`tab${i}`).classList.remove('active-tab');
    }
    document.getElementById(`tab${t}`).classList.add('active-tab');
    tab = t;
    load();
}

//  T A S K S

const getIndex = (id) => {
    return taskList[tab].findIndex((e,i) => (e.id == id))
}

const checked = (id) => {
    if (document.getElementById(`id${id}`).classList.contains('active')) end(id);
    document.getElementById(`id${id}`).classList.toggle('active');
    let i = getIndex(id);
    taskList[tab][i].status = !taskList[tab][i].status
    save();
}

const end = (id) => {
    let index = getIndex(id);
    let movingTask = {
        id : taskList[tab][index].id,
        value: taskList[tab][index].value,
        status: taskList[tab][index].status
    }
    taskList[tab].splice(index,1)
    taskList[tab].push(movingTask);
    save();
}

const del = (id) => {
    let index = getIndex(id);
    taskList[tab].splice(index,1)
    save();
}

const up = (id) => {
    let index = getIndex(id);
    if (index > 1) {
        let movingTask = {
            id : taskList[tab][index].id,
            value: taskList[tab][index].value,
            status: taskList[tab][index].status
        }
        taskList[tab].splice(index,1)
        taskList[tab].splice(index-1,0,movingTask)
        save();
    }
}

const down = (id) => {
    let index = getIndex(id);
    if (index < (taskList[tab].length - 1)) {
        let movingTask = {
            id : taskList[tab][index].id,
            value: taskList[tab][index].value,
            status: taskList[tab][index].status
        }
        taskList[tab].splice(index,1)
        taskList[tab].splice(index+1,0,movingTask)
        save();
    }
}

const onScreen = (item) => {
    (item.status) ? check = 'active' : check = ''

    list.innerHTML += `
    <div id="id${item.id}" class="item ${check}">
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
    </div>`;
}

//  M O D I F I N G   L O C A L   S T O R A G E   F I L E

const save = () => {
    taskList[0] = c;
    localStorage.setItem("taskListStoraged", JSON.stringify(taskList));
    load();
}

const load = () => {
    taskList = JSON.parse(localStorage.getItem("taskListStoraged")) || [0,['New Tab']];
    list.innerHTML = '';
    if (taskList[tab].length > 1) {
        for ( let i=1; i<taskList[tab].length; i++) {
            onScreen(taskList[tab][i])
        }
    }
    c = taskList[0];
    showTabs();
}

const add = (txt) => {
    c++;
    let itemToStorage = {};
    itemToStorage.id = c;
    itemToStorage.value = txt;
    itemToStorage.status = true;

    taskList[tab].splice(1,0,itemToStorage);
    save();
    form.reset();
}

form.addEventListener('submit', e=>{
    e.preventDefault();
    let txt = inputText.value.trim();
    if (txt != '') {
        inputText.focus();
        add(txt);
    }
})

btnAddTab.addEventListener('click', ()=> addTab());
document.querySelector('.modal-tabs').addEventListener('click', (e)=> delTab(e));
document.querySelector('.btn-closeModal').addEventListener('click', ()=> closeTabsModal());
document.querySelector('.btn-config').addEventListener('click', ()=> showTabsModal());
window.addEventListener('load', load());