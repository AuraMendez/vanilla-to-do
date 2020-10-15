/* Todo app javascript */

const form = document.querySelector('#form');
const list = document.querySelector('ul#list');
const emptyMessage = document.querySelector('#empty');
const tasks = [];

function isEmpty() {
  if (tasks.length === 0) {
    emptyMessage.style.display = 'block';
  } else {
    emptyMessage.style.display = 'none';
  }
}

function newId() {
  return `i${Math.random().toString(36).substr(2, 9)}`;
}

function toggleCard(id) {
  tasks.forEach(card => {
    if (card.id === id) {
      if (card.done) {
        delete card.done;
      } else {
        card.done = true;
      }
    }
  });
}

function removeCard(id) {
  let index = -1;
  tasks.forEach(task => {
    if (task.id === id) {
      index = tasks.indexOf(task);
    }
  });
  if (index > -1) {
    tasks.splice(index, 1);
  }
}

function createNewTask(title, description) {
  const newTask = {
    title,
    description,
    id: newId(),
  };
  tasks.push(newTask);
}

// Create LI
function createNewLi(newTask, state) {
  const newLi = document.createElement('li');
  newLi.className = state;
  newLi.setAttribute('id', newTask.id);
  let htmlString = `<div><i class="far fa-circle"></i></div><div class="content"><h3>${newTask.title}</h3>`;
  if (newTask.description) { htmlString += `<p>${newTask.description}</p>`; }
  htmlString += '</div><button class="remove"><i class="fas fa-minus-circle"></i></button>';
  newLi.innerHTML = htmlString;

  // event listener for LI
  newLi.addEventListener('click', event => {
    const id = event.currentTarget.getAttribute('id');
    toggleCard(id);
    renderList();
  }, false);

  // event listener for remove
  newLi.lastChild.addEventListener('click', event => {
    event.preventDefault();
    const button = event.currentTarget;
    const id = button.parentElement.getAttribute('id');
    removeCard(id);
    renderList();
  }, false);

  list.appendChild(newLi);
}


function renderList() {
  isEmpty();
  list.innerHTML = '';
  tasks.forEach(task => {
    if (task.done) {
      createNewLi(task, 'done');
    } else {
      createNewLi(task, 'pending');
    }
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const formTitle = document.querySelector('#formTitle');
  const formDescription = document.querySelector('#formDescription');
  createNewTask(formTitle.value, formDescription.value);
  formTitle.value = '';
  formDescription.value = '';
  renderList();
});