const supportedCards = {
  visa,
  mastercard
};

const countries = [
  {
    code: "US",
    currency: "USD",
    currencyName: "",
    country: "United States"
  },
  {
    code: "NG",
    currency: "NGN",
    currencyName: "",
    country: "Nigeria"
  },
  {
    code: "KE",
    currency: "KES",
    currencyName: "",
    country: "Kenya"
  },
  {
    code: "UG",
    currency: "UGX",
    currencyName: "",
    country: "Uganda"
  },
  {
    code: "RW",
    currency: "RWF",
    currencyName: "",
    country: "Rwanda"
  },
  {
    code: "TZ",
    currency: "TZS",
    currencyName: "",
    country: "Tanzania"
  },
  {
    code: "ZA",
    currency: "ZAR",
    currencyName: "",
    country: "South Africa"
  },
  {
    code: "CM",
    currency: "XAF",
    currencyName: "",
    country: "Cameroon"
  },
  {
    code: "GH",
    currency: "GHS",
    currencyName: "",
    country: "Ghana"
  }
];

const billHype = () => {
  const billDisplay = document.querySelector(".mdc-typography--headline4");
  if (!billDisplay) return;

  billDisplay.addEventListener("click", () => {
    const billSpan = document.querySelector("[data-bill]");
    if (
      billSpan &&
      appState.bill &&
      appState.billFormatted &&
      appState.billFormatted === billSpan.textContent
    ) {
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance(appState.billFormatted)
      );
    }
  });
};
const appState = {};
const formatAsMoney = (amount, buyerCountry) => {
  let country = countries.find(function(f) {
    return f.country === buyerCountry;
  });
  if (country) {
    let { code, currency } = country;
    return amount.toLocaleString(`en-${code}`, {
      style: "currency",
      currency: currency
    });
  } else {
    let [{ code, currency }] = countries;
    return amount.toLocaleString(`en-${code}`, {
      style: "currency",
      currency: currency
    });
  }
};
const flagIfInvalid = (field, isValid) => {
  if (isValid) {
    return field.classList.remove("is-invalid");
  } else {
    return field.classList.add("is-invalid");
  }
};
const expiryDateFormatIsValid = field => {
  return RegExp(/^[\d]{2}\/[\d]{2}$/.test(field.value));
};
const detectCardType = first4Digits => {
  const first4Digit = first4Digits[0];
  const cardType =
    first4Digit == 4 ? "is-visa" : firstDigit == 5 ? "is-mastercard" : "";
  const creditCard = document.querySelector("[data-credit-card]");
  const cardTypeField = document.querySelector("[data-card-type]");
  if (cardType === "is-visa") {
    creditCard.classList.add("is-visa");
    creditCard.classList.remove("is-mastercard");
    cardTypeField.src = supportedCards.visa;
  } else if (cardType === "is mastercard") {
    creditCard.classList.add("is-mastercard");
    creditCard.classList.remove("is-visa");
    cardTypeField.src = supportedCards.mastercard;
  } else {
    creditCard.classList.remove("is-mastercard");
    creditCard.classList.remove("is-visa");
    cardTypeField.src = "https://placehold.it/120x60.png/text=Card";
  }
  return cardType;
};

const validateCardExpiryDate = () => {
  const field = document.querySelector("[data-cc-info] input:nth-child(2)"); // check date  here
  const currentDate = new Date();
  const fieldsplit = field.value.split("/");
  const userDate = new Date(
    `20${Number(fieldsplit[1])}`,
    Number(fieldsplit[0] - 1) + 2
  );
  const valid = expiryDateFormatIsValid(field) && userDate >= currentDate;
  flagIfInvalid(field, valid);
  return valid;
};
// Validate Card Holder Name
const validateCardHolderName = () => {
  const field = document.querySelector("[data-cc-info] input:nth-child(1)");
  const { value } = field;
  const valid = /^[a-zA-Z]{3,} +[a-zA-Z]{3,}$/.test(value);
  flagIfInvalid(field, valid);
  return valid;
};
// Validate with Luhn
const validateWithLuhn = digits => {
  let value = digits.join("");
  if (/[^0-9-\s]+/.test(value)) return false;
  let noCheck = 0,
    noDigit = 0,
    bEven = false;
  value = value.replace(/\D/g, "");
  for (let i = value.length - 1; i >= 0; i--) {
    const cDigit = value.charAt(i);
    let noDigit = parseInt(cDigit, 10);
    if (bEven) {
      if ((noDigit *= 2) > 9) noDigit -= 9;
    }
    noCheck += noDigit;
    bEven = !bEven;
  }
  return noCheck % 10 === 0;
};

// Validate Card Number
const validateCardNumber = () => {
  const cardInputs = appState.cardDigits.flat();
  const valid = validateWithLuhn(cardInputs);
  const creditCardField = document.querySelector("[data-cc-digits]");
  if (valid) {
    creditCardField.classList.remove("is-invalid");
  } else {
    creditCardField.classList.add("is-invalid");
  }
  return valid;
};
// Validate Payment
const validatePayment = () => {
  validateCardNumber();
  validateCardHolderName();
  validateCardExpiryDate();
};

const smartCursor = (event, fieldIndex, fields) => {};
const enableSmartTyping = () => {
  const allInput = document.querySelectorAll("input");
  allInput.forEach((field, index, fields) => {
    field.addEventListener("keydown", event => {
      smartInput(event, index, fields);
    });
  });
};
// Smart Input
const smartInput = (event, fieldIndex, fields) => {
  const e = event.key;
  const validCharacters =
    e == "Backspace" ||
    e == "Tab" ||
    e == "Shift" ||
    e == "ArrowUp" ||
    e == "ArrowDown";
  if (fieldIndex < 4) {
    if (!isFinite(e) && !validCharacters) {
      event.preventDefault();
    } else {
      const cardInputField = document.querySelector(
        "[data-cc-digits] input:nth-child(`${fieldIndex + 1}`)"
      );
      let cardValue = cardInputField.value;
      const firstField = document.querySelector(
        "[data-cc-digits] input:nth-child(1)"
      ).value.length;
      if (appState.cardDigits[fieldIndex] === undefined && isFinite(e)) {
        appState.cardDigits[fieldIndex] = [];
        appState.cardDigits[fieldIndex].push(e);
        const digits = appState.cardDigits[0];
        detectCardType(digits);
      } else if (isFinite(e)) {
        appState.cardDigits[fieldIndex].push(e);
      }
      setTimeout(() => {
        if (fieldIndex < 3 && isFinite(e)) {
          cardInputField.value = cardInputField.value.substr(
            0,
            cardValue.length
          );
          cardInputField.value += "#";
        }
        if (fieldIndex === 0) {
          detectCardType(appState.cardDigits[0]);
        }
      }, 500);
      smartCursor(event, fieldIndex, fields);
    }
  } else if (fieldIndex == 4) {
    if (!validCharacters && !/^[a-zA-Z]$/.test(e) && event.code != "Space") {
      event.preventDefault();
    } else {
      smartCursor(event, fieldIndex, fields);
    }
  } else if (fieldIndex == 5) {
    if (!validCharacters && !/^[0-9]$/.test(e)) {
      event.preventDefault();
    } else {
      smartCursor(event, fieldIndex, fields);
    }
  }
};

const uiCanInteract = () => {
  const firstNum = document.querySelector(
    "[data-cc-digits] input:nth-child(1)"
  );
  const btn = document.querySelector("[data-pay-btn]");
  firstNum.focus();
  btn.addEventListener("click", validatePayment);
  billHype();
  enableSmartTyping();
};

const displayCartTotal = ({ results }) => {
  const [data] = results;
  const { itemsInCart, buyerCountry } = data;
  appState.items = itemsInCart;
  appState.country = buyerCountry;
  appState.bill = itemsInCart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
  appState.billFormatted = formatAsMoney(appState.bill, appState.country);
  const screen = document.querySelector("span[data-bill]");
  screen.textContent = appState.billFormatted;
  appState.cardDigits = [];
  uiCanInteract();
};

const fetchBill = () => {
  const apiHost = "https://randomapi.com/api";
  const apiKey = "006b08a801d82d0c9824dcfdfdfa3b3c";
  const apiEndpoint = `${apiHost}/${apiKey}`;
  fetch(apiEndpoint)
    .then(
      response => response.json(),
      networkError => console.log(networkError.message)
    )
    .then(data => displayCartTotal(data));
};

const startApp = () => {
  fetchBill();
};

startApp();
