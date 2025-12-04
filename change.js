// flags
let modalFlag = false;
let isDeleteMode = false;

// Elements
const addBtn = document.querySelector(".add-btn");
const removeBtn = document.querySelector(".remove-btn");
const trashIcon = removeBtn.children[0];
console.log(trashIcon);
const modalCont = document.querySelector(".modal-cont");
const taskArea = document.querySelector(".textArea-cont");
const contOfTicket = document.querySelector(".main-cont");
const colorPriority = document.querySelectorAll(".priority-color");
const filterColor = document.querySelectorAll(".color");
const clearFilter = document.querySelector(".clearFilter");

let ticketColor = "lightpink";
let colorArray = ["lightpink", "lightgreen", "lightblue", "black"];

const ticketsFromLS = JSON.parse(localStorage.getItem("myTickets")) || [];
const ticketsArray = ticketsFromLS;

function init() {
  ticketsFromLS.forEach(function (ticket) {
    createTicket(ticket.ticketTask, ticket.ticketId, ticket.ticketColor);
  });
}
init();

//-------------eventListeners

addBtn.addEventListener("click", function () {
  if (modalFlag == false) {
    modalCont.style.display = "flex";
    modalFlag = true;
  } else {
    modalCont.style.display = "none";
    modalFlag = false;
  }
});

modalCont.addEventListener("keydown", function (e) {
  if (e.key == "Enter") {
    let text = taskArea.value;
    let id = shortid();
    let color = ticketColor;
    createTicket(text, id, color);
    taskArea.value = "";
    modalCont.style.display = "none";
    modalFlag = false;

    ticketsArray.push({ ticketTask: text, ticketId: id, ticketColor: color });
    localStorage.setItem("myTickets", JSON.stringify(ticketsArray));
  }
});

removeBtn.addEventListener("click", function () {
  if (isDeleteMode == false) {
    isDeleteMode = true;
    removeBtn.style.backgroundColor = "#ef4444";
    trashIcon.classList.remove("fa-regular");
    trashIcon.classList.add("fa-solid");
  } else {
    isDeleteMode = false;
    removeBtn.style.background = "linear-gradient(135deg, #f87171, #ef4444)";
    trashIcon.classList.remove("fa-solid");
    trashIcon.classList.add("fa-regular");
  }
});

// Create Ticket function
function createTicket(text, ticketid, ticket_color) {
  const ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `
        <div style="background-color: ${ticket_color}" class="ticket-color"></div>
        <div class="ticket-id">${ticketid}</div>
        <div class="task-area">${text}</div>
        <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
        </div>
        <div class="ticket-done">
            <i class="fa-regular fa-circle-check"></i>
        </div>`;

  contOfTicket.appendChild(ticketCont);
  handleLock(ticketCont, ticketid);
  handleColor(ticketCont, ticketid);
  handleDone(ticketCont);
  handleDelete(ticketCont, ticketid);
}

// Priority color change
colorPriority.forEach(function (colorElem) {
  colorElem.addEventListener("click", function () {
    colorPriority.forEach(function (prioColor) {
      prioColor.classList.remove("active");
    });
    colorElem.classList.add("active");
    let color = colorElem.classList[0];
    ticketColor = color;
  });
});

// Handle Lock
function handleLock(ticket, ticketId) {
  const ticketLockCont = ticket.querySelector(".ticket-lock");
  const ticketLock = ticketLockCont.children[0];
  const textArea = ticket.querySelector(".task-area");
  ticketLock.addEventListener("click", function () {
    if (ticketLock.classList.contains("fa-lock")) {
      ticketLock.classList.remove("fa-lock");
      ticketLock.classList.add("fa-lock-open");
      textArea.setAttribute("contenteditable", "true");
    } else {
      ticketLock.classList.remove("fa-lock-open");
      ticketLock.classList.add("fa-lock");
      textArea.setAttribute("contenteditable", "false");

      //  Update Task Text In Localstorage Whhen Locked
      let updatedText = textArea.innerText;
      let ticketIdx = ticketsArray.findIndex(function (ticketObj) {
        return ticketObj.ticketId == ticketId;
      });

      if (ticketIdx != -1) {
        ticketsArray[ticketIdx].ticketTask = updatedText;
        localStorage.setItem("myTickets", JSON.stringify(ticketsArray));
      }
    }
  });
}

// Handle Color
function handleColor(ticket, ticketId) {
  let ticketColor = ticket.querySelector(".ticket-color");
  ticketColor.addEventListener("click", function () {
    let currColor = ticketColor.style.backgroundColor;
    let currColorIdx = colorArray.findIndex(function (color) {
      return color == currColor;
    });
    let newColor = colorArray[(currColorIdx + 1) % colorArray.length];
    ticketColor.style.backgroundColor = newColor;

    //  Update Color in Localstorage
    let ticketIdx = ticketsArray.findIndex(function (ticketObj) {
      return ticketObj.ticketId == ticketId;
    });

    if (ticketIdx != -1) {
      ticketsArray[ticketIdx].ticketColor = newColor;
      localStorage.setItem("myTickets", JSON.stringify(ticketsArray));
    }
  });
}

// Handle Done
function handleDone(ticket) {
  const doneDiv = ticket.querySelector(".ticket-done");
  const doneIcon = doneDiv.children[0];

  doneDiv.addEventListener("click", function () {
    if (doneIcon.classList.contains("fa-regular")) {
      doneIcon.classList.remove("fa-regular");
      doneIcon.classList.add("fa-solid");
      ticket.classList.add("done");

      const dingSound = new Audio("ding.mp3");
      dingSound.currentTime = 0;
      dingSound.play();
    } else {
      doneIcon.classList.remove("fa-solid");
      doneIcon.classList.add("fa-regular");
      ticket.classList.remove("done");

      const dingSound = new Audio("ding.mp3");
      dingSound.currentTime = 0;
      dingSound.play();
    }
  });
}

// Filter
for (let i = 0; i < filterColor.length; i++) {
  filterColor[i].addEventListener("click", function () {
    let selectedFilterColor = filterColor[i].classList[0];

    let allTickets = document.querySelectorAll(".ticket-cont");

    for (let j = 0; j < allTickets.length; j++) {
      let ticket = allTickets[j];
      let ticketColorDiv = ticket.querySelector(".ticket-color");
      let ticketColor = ticketColorDiv.style.backgroundColor;

      if (ticketColor === selectedFilterColor) {
        ticket.style.display = "block";
      } else {
        ticket.style.display = "none";
      }
    }
  });
}

clearFilter.addEventListener("click", function () {
  let allTickets = document.querySelectorAll(".ticket-cont");
  for (let i = 0; i < allTickets.length; i++) {
    let ticket = allTickets[i];
    ticket.style.display = "block";
  }
});

// Handle Delete
function handleDelete(ticket, ticketId) {
  ticket.addEventListener("click", function () {
    if (isDeleteMode == true) {
      ticket.remove();

      let ticketIdx = ticketsArray.findIndex(function (ticketObj) {
        return ticketObj.ticketId == ticketId;
      });

      if (ticketIdx != -1) {
        ticketsArray.splice(ticketIdx, 1);
      }

      localStorage.setItem("myTickets", JSON.stringify(ticketsArray));
    }
  });
}
