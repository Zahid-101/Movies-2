const rows = ['A','B','C','D','E'];
const cols = [1,2,3,4,5,6,7,8];
const bookedSeatLabels = ['A3','A4','C6','D1','E8'];

let selectedSeats = [];
let maxSeatsAllowed = 0; // Will be populated from order quantity

// Function to get total quantity from order table
function getTotalOrderQuantity() {
  let total = 0;
  const checkout = document.getElementById('checkbod');
  
  if (checkout && checkout.childNodes.length > 0) {
    // Loop through all rows in the checkout table
    for (let i = 0; i < checkout.childNodes.length; i++) {
      const quantityCell = checkout.childNodes[i].childNodes[2]; // The 3rd column contains quantity
      if (quantityCell) {
        // Get the quantity value (split in case it has "KG" or other text)
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

function createSeatingGrid() {
  // Get the max seats allowed from the order
  maxSeatsAllowed = getTotalOrderQuantity();
  console.log("Max seats allowed:", maxSeatsAllowed);
  
  const area = document.getElementById('seating-area');
  area.innerHTML = '';
  rows.forEach(row => {
    // Row label at beginning of every row
    let labelCell = document.createElement('div');
    labelCell.className = 'row-label';
    labelCell.textContent = row;
    area.appendChild(labelCell);

    cols.forEach(col => {
      const seatLabel = row + col;
      const seat = document.createElement('button');
      seat.className = 'seat';
      seat.textContent = seatLabel;
      seat.setAttribute('data-label', seatLabel);
      if (bookedSeatLabels.includes(seatLabel)) {
        seat.classList.add('booked');
        seat.disabled = true;
      }
      seat.addEventListener('click', function() {
        if (seat.classList.contains('booked')) return;
        
        if (seat.classList.contains('selected')) {
          seat.classList.remove('selected');
          selectedSeats = selectedSeats.filter(lbl => lbl !== seatLabel);
        } else {
          // Check if selecting one more would exceed the max allowed
          if (selectedSeats.length >= maxSeatsAllowed) {
            alert(`You can only select up to ${maxSeatsAllowed} seats based on your order quantity.`);
            return;
          }
          seat.classList.add('selected');
          selectedSeats.push(seatLabel);
        }
        updateSelectedDisplay();
      });
      area.appendChild(seat);
    });
  });
}

function updateSelectedDisplay() {
  const disp = document.getElementById('selected-seats');
  if(selectedSeats.length === 0) {
    disp.textContent = 'None';
  } else {
    disp.textContent = selectedSeats.join(', ');
  }
  
  // Update remaining seats info
  const remainingSeats = maxSeatsAllowed - selectedSeats.length;
  const selectionBar = document.getElementById('selection-bar');
  
  // Find or create the remaining seats display
  let remainingDisplay = document.getElementById('remaining-seats');
  if (!remainingDisplay) {
    remainingDisplay = document.createElement('div');
    remainingDisplay.id = 'remaining-seats';
    selectionBar.appendChild(remainingDisplay);
  }
  
  remainingDisplay.textContent = `Remaining seats to select: ${remainingSeats}`;
}

// Function to initialize the seating grid after the order data is loaded
function initializeSeatingAfterOrderLoaded() {
  // We'll wait for a short time to ensure the order data is loaded
  setTimeout(() => {
    createSeatingGrid();
    updateSelectedDisplay();
  }, 500);
}

// Call our initialize function after the page loads
window.addEventListener('DOMContentLoaded', () => {
  // Wait for the check.js to finish loading the order data
  if (document.getElementById('checkbod')) {
    initializeSeatingAfterOrderLoaded();
  }
});

// Allow modification of seat.js by check.js
window.updateSeatingGrid = function() {
  createSeatingGrid();
  updateSelectedDisplay();
};

// Export selectedSeats for use in other scripts
window.getSelectedSeats = function() {
  return selectedSeats;
};