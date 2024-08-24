let winnerName = "";
let selectedLocation = "";
let passwordForRedeem = "";
document.getElementById("dialog-ok-btn").addEventListener("click", hideDialog);

function showDialog(dialogMode) {
  const dialogContent = document.querySelector(".dialog-content");

  switch (dialogMode) {
    case ("playBtn", ""):
      message = "È possibile giocare solo una volta al giorno.";
      dialogContent.innerHTML = `
            <p>${message}</p><br />
            <button id='dialog-ok-btn'>Accettare</button>`;
      break;
    case "qrBtn":
      const prize = getWinnerPrize();
      const currentDate = getCurrentDate();
      message = `Auguri! presentate questo codice QR alla sede centrale di ${selectedLocation}.`;
      dialogContent.innerHTML = `
            <p>${message}</p><br />
            <div id="qrcode"></div><br />
            <button id='dialog-ok-btn'>Accettare</button>`;
      const qrMessage = `Nome: ${winnerName} + Premio: ${prize} 
                + Località: ${selectedLocation} + Data: ${currentDate} + Partecify`;
      generateQRCode(qrMessage);
      break;
    case "winner":
      message = "Auguri, Hai vinto!";
      dialogContent.innerHTML = `
            <p>${message}</p><br />
            <label for="name-input">Nome e Cognome</label>
            <input type="text" id="name-input"><br />
            <p>Località</p>
            <select id="location-dropdown">
                <option value=""></option>
                <option value="Caresana">Caresana</option>
          <!--  <option value="Rozzano">Rozzano</option>
                <option value="Carpiano">Carpiano</option>
                <option value="Settala">Settala</option>
                <option value="Mozzate">Mozzate</option>
                <option value="Segrate">Segrate</option>
                <option value="Bellusco">Bellusco</option> -->
            </select><br />
            <button id='dialog-ok-btn'>Invia</button>`;
      break;
    case "listBtnEmpty":
      message = "Non ci sono premi per le richieste.";
      dialogContent.innerHTML = `
            <p>${message}</p><br />
            <button id='dialog-ok-btn'>Accettare</button>`;
      break;
    case "listBtnNotEmpty":
      let prizes = getPrizesWon();
      message = "Premi vinti";
      let prizeListHTML = prizes.map((prize) => `<li>${prize}</li>`).join("");
      dialogContent.innerHTML = `
            <p>${message}</p><br />
            <ul>${prizeListHTML}</ul><br />
            <button id='dialog-ok-btn'>Accettare</button>`;
      break;
    case "listBtnLongClick":
      message = "Inserisci la password per riscattare i premi.";
      dialogContent.innerHTML = `
            <p>${message}</p><br />
            <label for="password-input">Password</label>
            <input type="text" id="password-input"><br />
            <button id='dialog-ok-btn'>Accettare</button>`;
      break;
    default:
      message = "È possibile giocare solo una volta al giorno.";
      dialogContent.innerHTML = `<p>${message}</p><button id='dialog-ok-btn'>Accettare</button>`;
      break;
  }

  dialog.style.display = "block";
  document
    .getElementById("dialog-ok-btn")
    .addEventListener("click", function () {
      if (dialogMode === "winner") {
        selectedLocation = document.getElementById("location-dropdown").value;
        winnerName = document.getElementById("name-input").value;
        if (selectedLocation !== "" && winnerName !== "") {
          hideDialog();
        }
        addPrizeWon(getWinnerPrize());
        sendDataToSheet(winnerName, getWinnerPrize(), selectedLocation, getCurrentDate());
      } else {
        hideDialog();
        validateRedeemPassword();
      }
    });
}

function validateRedeemPassword() {
  passwordForRedeem = document.getElementById("password-input").value;
  if (passwordForRedeem == "2024") {
    clearPrizesWon();
    passwordForRedeem = "";
  }
}

function hideDialog() {
  dialog.style.display = "none";
}

function generateQRCode(text) {
  var qrcode = new QRCode("qrcode");
  qrcode.makeCode(text);
}