const qrBtn = document.getElementById("qr-btn");
const playBtn = document.getElementById("play-btn");
const listBtn = document.getElementById("list-btn");
const dialogAlert = document.getElementById("dialog");
var isDialogHidden = getComputedStyle(dialogAlert).display === "none";
let timer;

playBtn.addEventListener("click", () => {
  if (!canPlayToday()) {
    showDialog("playBtn");
  } else {
    setTimeout(function () {
      play();
    }, 10000);
  }
});

const startTimer = () => {
  timer = setTimeout(() => {
    longClickHandler();
  }, 1000);
};

const clearTimer = () => {
  clearTimeout(timer);
};

listBtn.addEventListener("mousedown", startTimer);
listBtn.addEventListener("mouseup", clearTimer);
listBtn.addEventListener("mouseleave", clearTimer);

listBtn.addEventListener("touchstart", startTimer);
listBtn.addEventListener("touchend", clearTimer);
listBtn.addEventListener("touchcancel", clearTimer);

listBtn.addEventListener("click", () => {
  if (getComputedStyle(dialogAlert).display === "none") {
    if (isPrizesWon()) {
      showDialog("listBtnNotEmpty");
    } else {
      showDialog("listBtnEmpty");
    }
  }
});

function longClickHandler() {
  if (getComputedStyle(dialogAlert).display === "none") {
    showDialog("listBtnLongClick");
  }
}

qrBtn.addEventListener("click", () => {
  if (getComputedStyle(dialogAlert).display === "none") {
    showDialog("qrBtn");
  }
});

function play(isResult) {
  var result = getResultGame();
  var isWinner = result !== "Ritenta";

  setWinnerPrize(isWinner ? result : "");
  qrBtn.style.backgroundColor = isWinner ? "#364C62" : "grey";

  if (isWinner) {
    setTimeout(function () {
      showDialog("winner");
    }, 1000);

    setTimeout(function () {
      qrBtn.disabled = !isWinner;
      qrBtn.style.backgroundColor = "#ff4500";
    }, 3000);
  } else {
    qrBtn.style.backgroundColor = "grey";
  }
  setLastPlayedDate();
}
