order = JSON.parse(localStorage.getItem('order'));
const checkout = document.getElementById('checkbod');
const checkfoot = document.getElementById('checkfoot');
const isKgArr = JSON.parse(localStorage.getItem('isKgArr')) || [];
const creditoption = document.querySelectorAll("input[name=pay-meth]")
const card = document.getElementById("carddeets")
const submitbtn = document.getElementById("payport")
const body = document.getElementById("EvWrapper")
const form = document.getElementById("form")
const CardNo = document.getElementById("CardNo")
const CVno = document.getElementById("CvNo")
const ExpDate = document.getElementById("ExpDate")
const timeSelector = document.getElementById("time-selector");

function generateBookingReference() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
function creditCard(){
    if(this.value=="card"){
        card.classList.add("show")
        CardNo.required = true;
        CVno.required = true;
        ExpDate.required = true;
        
    }
    else{
        card.classList.remove("show")
        CardNo.required = false;
        CVno.required = false;
        ExpDate.required = false;
    }
}

creditoption.forEach(radio=>radio.addEventListener('change',creditCard))

//alternate version of display function
function DisplayOrderCheckOut(){
    for(i=0;i<order.length;i++){
        let tr= document.createElement('tr')
        const info=['<img src="'+order[i].img +'" alt="">',order[i].itemName, order[i].quantity,order[i].price] //pulls the items from order array
        for(let x=0;x<info.length;x++){
            let td= tr.appendChild(document.createElement('td'));
            td.innerHTML = info[x]
            if(x==2){
                if(isKgArr[i]){
                    const kg =document.createTextNode(" KG")
                    td.appendChild(kg)
                }
            }
        }
        checkout.appendChild(tr)
    }
    
    // After displaying the order, update the seating grid if it exists
    if (window.updateSeatingGrid) {
        window.updateSeatingGrid();
    }
}   

function calculatePrice(tf){
    let totalPrice = 0;
    let rows = checkout.childNodes;
    
    console.log("Number of rows:", rows.length);
    
    // Skip any non-element nodes at the beginning if needed
    for(let i=0; i<rows.length; i++){
        // Make sure it's an actual table row element
        if (rows[i].nodeType !== 1) continue;
        
        let quantityCell = rows[i].childNodes[2];
        let priceCell = rows[i].childNodes[3];
        
        if (quantityCell && priceCell) {
            // Get quantity - parse it carefully
            let quantityText = quantityCell.innerText || quantityCell.textContent;
            let quantityValue = parseFloat(quantityText.split(" ")[0]);
            
            // Get price - parse it carefully
            let priceText = priceCell.innerText || priceCell.textContent;
            let priceValue = parseFloat(priceText);
            
            console.log("Row", i, "Quantity:", quantityValue, "Price:", priceValue);
            
            if (!isNaN(quantityValue) && !isNaN(priceValue)) {
                let rowTotal = quantityValue * priceValue;
                totalPrice += rowTotal;
                console.log("Row total:", rowTotal, "Running total:", totalPrice);
            }
        }
    }
    
    console.log("Final total price:", totalPrice);
    tf.innerHTML = totalPrice.toFixed(2); // Format to 2 decimal places
}

function OrderConfirmation(){
    // Get the selected seats if available
    let selectedSeatsText = '';
    if (window.getSelectedSeats && window.getSelectedSeats().length > 0) {
        selectedSeatsText = `<br>Your selected seats: ${window.getSelectedSeats().join(', ')}`;
    }
    // Include seat selection info in the confirmation message
    const bookingRef = generateBookingReference(); // booking ref
    const selectedTime = timeSelector.value;
    const message = `Thank you for Ordering! <br> You have selected the time: ${selectedTime} and your booking reference is : ${bookingRef}${selectedSeatsText}`
    body.innerHTML = message;
    body.classList.add("after")
    console.log(message)
}

// Before submitting the form, validate that the correct number of seats were selected
form.addEventListener('submit', function(e) {
    if (window.getSelectedSeats) {
        const totalQuantity = getTotalOrderQuantity();
        const selectedSeatsCount = window.getSelectedSeats().length;
        
        if (selectedSeatsCount < totalQuantity) {
            e.preventDefault();
            alert(`Please select ${totalQuantity} seats. You've only selected ${selectedSeatsCount}.`);
            return false;
        }
    }
    OrderConfirmation();
    e.preventDefault(); // Prevent default form submission
});

// Function to get total quantity from order
function getTotalOrderQuantity() {
    let total = 0;
    if (checkout && checkout.childNodes.length > 0) {
        for (let i = 0; i < checkout.childNodes.length; i++) {
            const quantityCell = checkout.childNodes[i].childNodes[2];
            if (quantityCell) {
                const quantityText = quantityCell.innerText.split(" ")[0];
                const quantity = parseInt(quantityText);
                if (!isNaN(quantity)) {
                    total += quantity;
                }
            }
        }
    }
    return total;
}

// Run the main functions
DisplayOrderCheckOut();
calculatePrice(checkfoot);