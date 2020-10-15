/* Todo app javascript */

/* NOTE TO INSTRUCTORS:
I struggled a bit to decide in which way to solve this exercise. I don't
clearly understand what was meant with "Keep state in a object and NOT in the DOM"
So I made two versions... On 'todo-other.js' you'll find a solution that erases and
re-render
s the whole list of tasks everytime an action happens (a button is pushed).
I later thought that'd probably make it slow if there are many elements on the list
so I made another version (the current one) that updates both the object and the DOM
individually for each task. No idea which one is better practice.
I had two linting errors that I couldn't get around: two functions calling each oter,
and no-param-reassign (to change an object property). */

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

// === ACTONS IN THE OBJECT ===
// Toggle
/* eslint-disable no-param-reassign */
function cardToggleObject(id) {
  tasks.forEach(card => {
    if (card.id === id) {
      if (card.state === 'pending') {
        card.state = 'done';
      } else {
        card.state = 'pending';
      }
    }
  });
}
// Remove
function removeCardObject(id) {
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
// ++++++++++++++++++++++++++++++++++++++++++++++++++

// ==== ACTIONS IN THE DOM ===
// Toggle
function cardToggleDOM(id) {
  const li = document.querySelector(`#${id}`);
  const icon = document.querySelector(`#${id} div i`);
  if (li) {
    if (li.className === 'pending') {
      li.className = 'done';
      icon.className = 'fas fa-check-circle';
    } else {
      li.className = 'pending';
      icon.className = 'far fa-circle';
    }
  }
}
// Remove
function removeCardDOM(id) {
  const liToRemove = document.querySelector(`#${id}`);
  liToRemove.remove();
}
// Create LI
function createNewLi(newTask) {
  const newLi = document.createElement('li');
  newLi.className = newTask.state;
  newLi.setAttribute('id', newTask.id);
  let htmlString = `<div><i class="far fa-circle"></i></div><div class="content"><h3>${newTask.title}</h3>`;
  if (newTask.description) { htmlString += `<p>${newTask.description}</p>`; }
  htmlString += '</div><button class="remove"><i class="fas fa-minus-circle"></i></button>';
  newLi.innerHTML = htmlString;

  // event listener for LI
  newLi.addEventListener('click', event => {
    const li = event.currentTarget;
    const id = li.getAttribute('id');
    cardToggleDOM(id);
    cardToggleObject(id);
    isEmpty();
  }, false);

  // event listener for remove
  newLi.lastChild.addEventListener('click', event => {
    event.preventDefault();
    const button = event.currentTarget;
    const id = button.parentElement.getAttribute('id');
    removeCardDOM(id);
    removeCardObject(id);
    isEmpty();
  }, false);

  list.appendChild(newLi);
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++

function newId() {
  return `i${Math.random().toString(36).substr(2, 9)}`;
}

function createNewTask(title, description) {
  const newTask = {
    title,
    description,
    state: 'pending',
    id: newId(),
  };
  //= ==Add to Object===
  tasks.push(newTask);
  //= ==Add to DOM===
  createNewLi(newTask);
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const formTitle = document.querySelector('#formTitle');
  const formDescription = document.querySelector('#formDescription');
  createNewTask(formTitle.value, formDescription.value);
  formTitle.value = '';
  formDescription.value = '';
  isEmpty();
});
