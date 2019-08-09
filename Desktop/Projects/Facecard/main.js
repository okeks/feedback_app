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

const fetchBill = () => {
  const apiHost = "https://randomapi.com/api";
  const apiKey = "006b08a801d82d0c9824dcfdfdfa3b3c";
  const apiEndpoint = `${apiHost}/${apiKey}`;
};

const startApp = () => {};

startApp();
