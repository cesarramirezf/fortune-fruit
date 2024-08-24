const keyPrizesWon = "prizesWon";
const keyResultGame = "resultGame";
const keyWinnerPrize = "winnerPrize";
const keyLastPlayedDate = "lastPlayedDate";
const urlTimeSheetGoogle =
  "https://script.google.com/macros/s/AKfycbx4yfWo1L4pRaQBoFRrKIfduHxNbLvSJd1q0tOzBIxVZX-AdlAyOiH6wW9pZJea-FVr/exec";

function canPlayToday() {
  const lastPlayedDateStr = getLastPlayedDate();
  if (!lastPlayedDateStr) {
    return true;
  }

  const lastPlayedDate = new Date(lastPlayedDateStr);
  const today = new Date();

  lastPlayedDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return lastPlayedDate.getTime() !== today.getTime();
}

function isPrizesWon() {
  let prizes = getPrizesWon();
  return prizes.length != 0;
}

function sendDataToSheet(winnerName, prize, selectedLocation, currentDate) {
  const data = new URLSearchParams({
    winnerName: winnerName,
    prize: prize,
    selectedLocation: selectedLocation,
    currentDate: currentDate,
  });

  fetch(urlTimeSheetGoogle, {
    method: "POST",
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const resultElement = document.getElementById("result");
      if (resultElement) {
        resultElement.innerHTML = data.result;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      const resultElement = document.getElementById("result");
      if (resultElement) {
        resultElement.innerHTML = "An error occurred while sending data";
      }
    });
}

function getLastPlayedDate() {
  return localStorage.getItem(keyLastPlayedDate);
}

function setLastPlayedDate() {
  localStorage.setItem(keyLastPlayedDate, getCurrentDate());
}

function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}

function setWinnerPrize(isWinnerPrize) {
  localStorage.setItem(keyWinnerPrize, isWinnerPrize);
}

function getWinnerPrize() {
  return localStorage.getItem(keyWinnerPrize);
}

function setResultGame(isResultGame) {
  localStorage.setItem(keyResultGame, isResultGame);
}

function getResultGame() {
  return localStorage.getItem(keyResultGame);
}

function addPrizeWon(prizeWon) {
  let prizes = JSON.parse(localStorage.getItem(keyPrizesWon)) || [];
  prizes.push(prizeWon);
  localStorage.setItem(keyPrizesWon, JSON.stringify(prizes));
}

function clearPrizesWon() {
  localStorage.removeItem(keyPrizesWon);
}

function getPrizesWon() {
  return JSON.parse(localStorage.getItem(keyPrizesWon)) || [];
}
