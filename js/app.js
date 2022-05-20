var eventCaptureSelect = document.querySelector("#laptopSelected");
var elementFeatures = document.querySelector("#features");
var elementItemSelected = document.querySelector("#item-title-selected");
var elementItemDescriptionSelected = document.querySelector("#item-description-selected");
var imgElementItemSelected = document.querySelector("#img-item");
var priceItem = document.querySelector("#value-buy");
var loanAmount = document.querySelector("#loanAmount");
var btnLoanModal = document.querySelector("#btnLoanModal");
var valueBalance = document.querySelector("#value-balance");
var btnWork = document.querySelector("#work-button");
var valuePayForWork = document.querySelector("#value-pay");
var btnBankTransffer = document.querySelector("#bank-button");
var btnBuyItem = document.querySelector("#buy-button");


//variables to retrieve data from json
//to use them later on the logic side
let itemPrice = 0.0;
// variables for the logic side
let balance = 0.0;
let loan = 0.0;
let amountWork = 0.0;
let tempLoan = 0.0;

const startEndPoint = 'https://noroff-komputer-store-api.herokuapp.com/computers';
const idEndPoint = 'https://noroff-komputer-store-api.herokuapp.com/computers/';
const imgEndPoint = 'https://noroff-komputer-store-api.herokuapp.com/';
//variable to retrieve computers title
let computerDescription = [{}];
let computerFeatures = [];
// json data that need to be loaded at the begining of the app
// fetch full end point
fetch(startEndPoint)
.then(response => response.json())
.then(data => {
    // work with json 
    for(let i = 0; i < data.length; i++){
        //assigning computer names and ids
        //at the beggining of the program workflow
        
        computerDescription[i] = {
            id: data[i].id,       //javascript object id and name
            name: data[i].title
        }
    }
    for(let i = 0; i < data.length; i++){
        eventCaptureSelect.innerHTML += 
        `<option value='${computerDescription[i].id}'>${computerDescription[i].name}</option>`
    }
})
.catch( err => console.error(err));

//select box event
eventCaptureSelect.addEventListener('change', e => {
    // when click select box event is triggered then 
    //Features element will be populated
        
    //restarting elementFeatures before adding list of computers description
    elementFeatures.innerHTML = `<span class="fs-4 fw-bolder" id="features">Features:</span>`;
    //restarting elementItemDescriptionSelected before adding name and description
    elementItemDescriptionSelected.innerHTML = " ";

    fetch(idEndPoint + `${e.target.value}`)
    .then(response => response.json())
    .then(data => {
        //retrieving features in a array
        let features = data.specs;
        // retrieve item price to use it later 
        //it need to be parsed into a float to avoid 
        //string contatination
        itemPrice = parseFloat(data.price, 10);
        //restaring features element on each iteration
        elementFeatures.innerHTML = 'Features:';
        //looping through array features
        for(let i = 0; i < features.length; i++){
            //populatin features
            elementFeatures.innerHTML += 
            `<p class='fw-normal text-start' style='font-size: 10px; height: 8px;'> ${features[i]} </p>` 
        }

        //populating item selected name and description
        elementItemSelected.innerHTML = `<div class='d-block fs-4 fw-bolder text-start'> ${data.title}: 
        <span class='d-block fw-normal text-start' style='font-size: 14px;'> ${data.description}</span> 
        </div>`;

        // pupolating computer price element
        //if item selected is the item number 5 or 6 then
        if(data.id === 5){
            // splitting img name by . to change file extension instead .jpg then .png
            let newName = data.image.split('.');
            // parsing new name img with extension .png
            imgElementItemSelected.innerHTML = 
        `<img width='150' src='${imgEndPoint + newName[0] + '.png'}'>`;
        // returning so the code it does not continue and output the wrong name img again
        return;
        }
        //populating item img
        imgElementItemSelected.innerHTML = 
        `<img width='150' src='${imgEndPoint + data.image}'>`;

        priceItem.textContent = `${data.price} kr`
    })
})

// event for get loan button modal
btnLoanModal.addEventListener('click', e => {
    // process value for loan
    // first check that value entered is not null or invalid
    if(loanAmount.value != 0){
    //assing new value to loan for later uses
    //but first loanAmount value must be parsed into a float
    //to avoid string concatenation
    // first apply taxes to 10%
    let taxes = parseFloat(loanAmount.value, 10) * 0.1.toFixed(2);
    loan += parseFloat(loanAmount.value, 10) - taxes.toFixed(2);
    balance = loan.toFixed(2);
    // then update frontend
    valueBalance.textContent = loan.toFixed(2) + ' kr';
    valueBalance.value = 0;
    loanAmount.value = 0;
    loanAmount.textContent = '';
    }
})

//event for work button
btnWork.addEventListener('click', e => {
    //increment by 100 on each click
    amountWork += 100;
    valuePayForWork.textContent = amountWork + ' kr';
})

// event for bank transffer button
btnBankTransffer.addEventListener('click', e => {
    //first add amountWork to loan
    //check if client has been working before transfer
    if(amountWork != 0){
    //+ operation in tempLoan    
    tempLoan = loan + amountWork;
    //re-assingning new temp value to loan
    //and applying taxes to 10%
    let tax = tempLoan * 0.1;
    loan = tempLoan - tax;
    //converting loan to float to validate value
    balance = parseFloat(loan, 10);
    }
    //populating frontend as well
    valueBalance.textContent = loan.toFixed(2) + ' kr';
    //restart amountWork value to 0 after transffer
    amountWork = 0;
    //restart tempLoan 
    tempLoan = 0;
    //restart frontend as well
    valuePayForWork.textContent = '0 kr';
    valuePayForWork.value = 0;
    loanAmount.value = 0;
    valueBalance.value = 0;
})

//event buy button
btnBuyItem.addEventListener('click', e => {
    //price is already retrieved from json data 

    //first check if balance is less or equal to current item price
    if(balance < itemPrice || balance === 0 || itemPrice === 0){
        //can not purchase item
        window.alert('not enough money, item can not be purchase, take a loan !\nYou can not afford this item');
        return;
    }
    //pop window to warn user if succefull
    if(balance >= itemPrice && balance > 0 && itemPrice > 0){
    window.alert('Congratulations\nitem purchesed successfully\nNow you are the owner of this item');
    //applying operation on bank balance
    balance = balance - itemPrice;
    //updating frontend
    valueBalance.textContent = balance.toFixed(2) + ' kr';
    }
})