// DOM elements - cache them for better performance
const elements = {
  selects: document.querySelectorAll("select"),
  btn: document.querySelector("button"),
  fromCurr: document.querySelector("#fromSelect"),
  toCurr: document.querySelector("#toSelect"),
  msg: document.querySelector(".rate"),
  lastUpdated: document.querySelector(".last_updated"),
  icon: document.querySelector(".icon"),
  amountInput: document.querySelector('input[name="input"]'),
};

// Constants
const API_KEY = "b843cba7efa0f77737a10496";
const API_BASE_URL = "https://v6.exchangerate-api.com/v6";

// Update flag image
const updateFlag = (select) => {
  const countryCode = countryList[select.value];
  const img = select.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Initialize select options
const initializeSelects = () => {
  const options = Object.keys(countryList).map((currCode) => {
    const option = document.createElement("option");
    option.value = option.innerText = currCode;
    return option;
  });

  elements.selects.forEach((select) => {
    const isFromSelect = select.name === "from";
    const defaultCurrency = isFromSelect ? "USD" : "INR";

    // Clone options for each select
    const selectOptions = options.map((opt) => opt.cloneNode(true));
    selectOptions.forEach((opt) => {
      if (opt.value === defaultCurrency) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener("change", (e) => updateFlag(e.target));
  });
};

// Fetch exchange rate
const exchangeRate = async () => {
  const amount = validateAmount();
  const { fromCurr, toCurr, msg, lastUpdated, btn } = elements;

  updateUIForLoading();

  try {
    const url = `${API_BASE_URL}/${API_KEY}/latest/${fromCurr.value}`;
    const response = await fetch(url);
    const data = await response.json();

    const rate = data.conversion_rates[toCurr.value];
    const finalAmount = (amount * rate).toFixed(2);

    updateUIWithResults(amount, finalAmount, data.time_last_update_utc);
  } catch (error) {
    updateUIForError();
    console.error("Exchange rate fetch error:", error);
  }
};

// Validate and get amount
const validateAmount = () => {
  const { amountInput } = elements;
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount < 1) {
    amountInput.value = 1;
    return 1;
  }
  return amount;
};

// UI update functions
const updateUIForLoading = () => {
  const { msg, lastUpdated, btn } = elements;
  msg.innerText = "Please wait...";
  lastUpdated.innerText = "Fetching data.";
  btn.innerText = "Get Exchange Rate";
};

const updateUIWithResults = (amount, finalAmount, updateTime) => {
  const { msg, lastUpdated, fromCurr, toCurr } = elements;
  msg.innerText = `${amount} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  lastUpdated.innerText = `Rate at: ${updateTime}`;
};

const updateUIForError = () => {
  const { msg, lastUpdated, btn } = elements;
  msg.innerText = "You're offline.";
  lastUpdated.innerText = "Check your internet connection.";
  btn.innerText = "Retry";
};

// Swap currencies
const swapCurrencies = () => {
  const { fromCurr, toCurr, icon } = elements;
  [fromCurr.value, toCurr.value] = [toCurr.value, fromCurr.value];
  icon.classList.toggle("rotate");
  updateFlag(fromCurr);
  updateFlag(toCurr);
  exchangeRate();
};

// Event listeners
const initializeEventListeners = () => {
  const { btn, icon } = elements;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    exchangeRate();
  });
  icon.addEventListener("click", swapCurrencies);
  window.addEventListener("load", exchangeRate);
};

// Initialize the application
const initApp = () => {
  initializeSelects();
  initializeEventListeners();
};

initApp();
