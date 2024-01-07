// accessing 
const selects = document.querySelectorAll("select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector("#fromSelect");
const toCurr = document.querySelector("#toSelect");
const msg = document.querySelector(".rate");
const last_updated = document.querySelector(".last_updated")
const icon = document.querySelector(".icon");


// flag updating function

const updateFlag = (select) => {
    let currCode = select.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = select.parentElement.querySelector("img");
    img.src = newSrc;
};

// adding options in select

for(let select of selects){
    for(currCode in countryList){
        let newOption = document.createElement("option")
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name === "from" && currCode === "USD"){
            newOption.selected = "selected";
        }
        else if(select.name === "to" && currCode === "INR"){
            newOption.selected = "selected"; 
        }
        select.append(newOption);
    }
    // handling change in select

    select.addEventListener("change", (e) => {
        updateFlag(e.target);
    });
}


// fetching exchange rate function

const exchangeRate = async () => {

    // setting amount to 1 for invalid input

    let amt = document.querySelector("input");
    let amtVal = amt.value;
    if(amtVal === "" || amtVal < 1){
        amt.value = 1;
        amtVal = 1;
    }
    console.log(fromCurr.value,"to",toCurr.value);
    const url = `https://v6.exchangerate-api.com/v6/b843cba7efa0f77737a10496/latest/${fromCurr.value}`;

    // calling api for exchange rate

    msg.innerText = "Please wait...";
    last_updated.innerText = "Fetching data.";
    btn.innerText = "Get Exchange Rate"
    try{
    let response = await fetch(url);
    let data = await response.json(); 
    console.log(data)  
    let rate = data.conversion_rates[toCurr.value];
    console.log("Exchange rate = ",rate);
    let finalAmt = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmt} ${toCurr.value}`;
    let rateAt = data.time_last_update_utc;
    last_updated.innerText = ("Rate at: "+ rateAt);
    }
    catch{
        msg.innerText = "You're offline.";
        last_updated.innerText = "Check your internet connection."
        btn.innerText = "Retry";
    }  
};




// handling click on button

btn.addEventListener("click", (e) => {
    e.preventDefault();
    updateFlag(fromCurr);
    updateFlag(toCurr);
    exchangeRate();
    
});

// handling click on icon

icon.addEventListener("click", () => {
    let temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;
    updateFlag(fromCurr);
    updateFlag(toCurr);
    exchangeRate();
})

window.addEventListener("load", () => {
    exchangeRate();
  });
