const addBtn = document.querySelector("#add-btn");
const removeBtn = document.querySelector("#remove-btn");
const closeBtn = document.querySelector("#close-btn");
const modalCont = document.querySelector(".modal-cont");
const mainCont = document.querySelector(".main-cont");
const taskDetail = document.querySelector(".textArea-cont");
const taskCont = document.querySelector(".task-container");
const submitBtn = document.querySelector("#submit-btn");
const priorityTaskColors = document.querySelectorAll(".priority-color");
const toolboxColors = document.querySelectorAll(".color");

// Local Variables
let ogTickets = [];
let DEFAULT_COLOR = "lightpink";
let activePriorityTaskColor = DEFAULT_COLOR;
let activeToolboxColor = "all";
const colors = ["lightpink", "lightblue", "lightgreen", "black"];
let deleteMode = false;

const ticketFromLS = localStorage.getItem("ogTickets");
if (ticketFromLS) {
  ogTickets = JSON.parse(ticketFromLS);
  refreshMainContainer();
}

function getFilteredTickets() {
  if (activeToolboxColor === "all") {
    return ogTickets;
  }
  return ogTickets.filter(({ color }) => color === activeToolboxColor);
}

function refreshMainContainer() {
  mainCont.innerHTML = "";

  const filteredTickets = getFilteredTickets();

  filteredTickets.forEach((ticket) => {
    const { id, color, task } = ticket;
    createTicket({ ticketTask: task, ticketColor: color, ticketId: id });
  });
}

function createTicket({ ticketTask, ticketColor, ticketId }) {
  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">#${ticketId}</div>
        <div class="ticket-area">${ticketTask}</div>
        <div class="ticket-lock">
          <i class="fa-solid fa-lock"></i>
        </div>`;

  mainCont.append(ticketCont);

  handleLock(ticketId, ticketCont);
  handleColor(ticketId, ticketCont);
  handleDelete(ticketId, ticketCont);
}

function handleLock(ticketId, ticketElem) {
  const lockClass = "fa-lock";
  const unlockClass = "fa-lock-open";
  const ticketLockElem = ticketElem.querySelector(".ticket-lock i");
  const ticketTaskArea = ticketElem.querySelector(".ticket-area");
  ticketLockElem.addEventListener("click", (event) => {
    if (ticketLockElem.classList.contains(lockClass)) {
      ticketLockElem.classList.remove(lockClass);
      ticketLockElem.classList.add(unlockClass);

      ticketTaskArea.setAttribute("contenteditable", "true");
    } else {
      ticketLockElem.classList.remove(unlockClass);
      ticketLockElem.classList.add(lockClass);

      ticketTaskArea.setAttribute("contenteditable", "false");
      let index = ogTickets.findIndex((ticket) => {
        return ticket.id === ticketId;
      });

      ogTickets[index].task = ticketTaskArea.textContent;
      updateLocalStorage();
    }
  });
}

function handleColor(ticketId, ticketElem) {
  const ticketColorElem = ticketElem.querySelector(".ticket-color");
  ticketColorElem.addEventListener("click", function () {
    const currentColor = ticketColorElem.classList[1];
    let currentColorIdx = colors.findIndex((color) => color === currentColor);

    const newColorIdx = ++currentColorIdx % colors.length;
    const newColor = colors[newColorIdx];

    ticketColorElem.classList.remove(currentColor);
    ticketColorElem.classList.add(newColor);

    let index = ogTickets.findIndex((ticket) => {
      return ticket.id === ticketId;
    });

    ogTickets[index].color = newColor;
    updateLocalStorage();
  });
}

function handleDelete(ticketId, ticketElem) {
  ticketElem.addEventListener("click", () => {
    if (deleteMode) {
      ticketElem.remove();
      ogTickets = ogTickets.filter((ticket) => {
        return ticket.id !== ticketId;
      });
      updateLocalStorage();
    } else {
      console.log("Ignore");
    }
  });
}

function handleSubmit() {
  if (taskDetail.value && activePriorityTaskColor) {
    ogTickets.push({
      task: taskDetail.value,
      color: activePriorityTaskColor,
      id: shortid(),
    });

    closeModal();
    clearSelectedPriorityColor();
    taskDetail.value = "";
    activePriorityTaskColor = DEFAULT_COLOR;

    updateLocalStorage();
    refreshMainContainer();
  }
}

function clearSelectedPriorityColor() {
  priorityTaskColors.forEach((elem) => {
    if (elem.classList.contains("active")) {
      elem.classList.remove("active");
    }
  });
}

function onPriorityColorClickInModal(event) {
  clearSelectedPriorityColor();
  const elem = event.target;
  activePriorityTaskColor = elem.classList[0];
  elem.classList.add("active");
}

function clearSelectedToolboxColor() {
  toolboxColors.forEach((elem) => {
    if (elem.classList.contains("active")) {
      elem.classList.remove("active");
    }
  });
}

function onClickToolboxColors(event) {
  clearSelectedToolboxColor();
  const elem = event.target;
  activeToolboxColor = elem.classList[0];
  elem.classList.add("active");

  refreshMainContainer();
}

// Open/Close Modal
function openModal() {
  modalCont.style.display = "flex";
  priorityTaskColors.forEach((elem) => {
    if (elem.classList.contains(activePriorityTaskColor)) {
      elem.classList.add("active");
    }
  });
}

function closeModal() {
  modalCont.style.display = "none";
}

function toggleDeleteMode() {
  deleteMode = !deleteMode;

  if (deleteMode === true) {
    alert("Delete Mode Activated");
    removeBtn.style.color = "red";
  } else {
    alert("Delete Mode Deactivated");
    removeBtn.style.color = "white";
  }
}

function updateLocalStorage() {
  localStorage.setItem("ogTickets", JSON.stringify(ogTickets));
}

addBtn.addEventListener("click", openModal);
removeBtn.addEventListener("click", toggleDeleteMode);
closeBtn.addEventListener("click", closeModal);
submitBtn.addEventListener("click", handleSubmit);
priorityTaskColors.forEach(function (elem) {
  elem.addEventListener("click", onPriorityColorClickInModal);
});
toolboxColors.forEach(function (elem) {
  elem.addEventListener("click", onClickToolboxColors);
});
