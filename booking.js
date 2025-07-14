// ===== Undo/Redo System =====
let formHistory = [];
let currentStep = -1;
let isUndoRedoAction = false;

// Save form state to history
function saveFormState() {
  if (isUndoRedoAction) {
    isUndoRedoAction = false;
    return;
  }
  
  const formData = {
    name: document.getElementById('fullName')?.value || '',
    email: document.getElementById('email')?.value || '',
    contact: document.getElementById('contactNumber')?.value || '',
    pkg: document.getElementById('packageSelect')?.value || '',
    date: document.getElementById('travelDate')?.value || '',
    adults: parseInt(document.getElementById('adults')?.value || '0'),
    children: parseInt(document.getElementById('children')?.value || '0')
  };
  
  // Remove any future history if we're not at the end
  formHistory = formHistory.slice(0, currentStep + 1);
  formHistory.push(formData);
  currentStep++;
  
  // Limit history to last 20 states to prevent memory issues
  if (formHistory.length > 20) {
    formHistory.shift();
    currentStep--;
  }
}

// Restore form state from history
function restoreFormState(formData) {
  isUndoRedoAction = true;
  
  if (document.getElementById('fullName')) document.getElementById('fullName').value = formData.name;
  if (document.getElementById('email')) document.getElementById('email').value = formData.email;
  if (document.getElementById('contactNumber')) document.getElementById('contactNumber').value = formData.contact;
  if (document.getElementById('packageSelect')) document.getElementById('packageSelect').value = formData.pkg;
  if (document.getElementById('travelDate')) document.getElementById('travelDate').value = formData.date;
  if (document.getElementById('adults')) document.getElementById('adults').value = formData.adults;
  if (document.getElementById('children')) document.getElementById('children').value = formData.children;
  
  // Trigger price update
  if (typeof updateTotalPrice === 'function') {
    updateTotalPrice();
  }
}

// Undo function
function undoForm() {
  if (currentStep > 0) {
    currentStep--;
    restoreFormState(formHistory[currentStep]);
    showUndoRedoFeedback('Undo');
  }
}

// Redo function
function redoForm() {
  if (currentStep < formHistory.length - 1) {
    currentStep++;
    restoreFormState(formHistory[currentStep]);
    showUndoRedoFeedback('Redo');
  }
}

// Show visual feedback for undo actions
function showUndoRedoFeedback(action) {
  const feedback = document.createElement('div');
  feedback.textContent = `${action} completed`;
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    z-index: 10000;
    font-family: 'League Spartan', sans-serif;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    feedback.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 300);
  }, 1500);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ===== Booking form!! =====
document.addEventListener('DOMContentLoaded', function() {
  const bookingForm = document.getElementById('bookingForm');
  
  if (!bookingForm) {
    console.error('Booking form not found');
    return;
  }

  // Add event listeners for form changes to save history
  const formInputs = bookingForm.querySelectorAll('input, select');
  formInputs.forEach(input => {
    input.addEventListener('change', saveFormState);
    input.addEventListener('input', saveFormState);
  });
  
  // Keyboard shortcuts for undo
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      undoForm();
    }
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      redoForm();
    }
  });
  
  // Save initial form state
  saveFormState();

  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
      // Extract form data from the form
      const formData = {
        name: this.querySelector('input[placeholder="Your Name"]')?.value || '',
        email: this.querySelector('input[type="email"]')?.value || '',
        contact: this.querySelector('input[placeholder^="eg."]')?.value || '',
        pkg: this.querySelector('#packageSelect')?.value || '',
        date: this.querySelector('input[type="date"]')?.value || '',
        adults: parseInt(this.querySelector('input[min="1"]')?.value || '0'),
        children: parseInt(this.querySelector('input[min="0"]')?.value || '0')
      };
      
      // Make sure theres no empty.. input
      if (!formData.name || !formData.email || !formData.contact || !formData.pkg || !formData.date) {
        alert('Please fill in all required fields');
        return;
      }

      // Define package price
      const packagePrices = {
        'Tokyo City Lights': 4499,
        'Kyoto Heritage Escape': 5199,
        'Roman Holiday': 6999,
        'Venice & Florence Romance': 7499,
        'Seoul City Vibes': 4199,
        'Jeju Island Escape': 5799
      };

      // Calculate total price
      const pricePerPerson = packagePrices[formData.pkg] || 0;
      const totalPrice = (formData.adults * pricePerPerson) + (formData.children * pricePerPerson);

      // Generate PDF invoice
      generateInvoicePDF(formData, pricePerPerson, totalPrice);
      
      //error handling here
    } catch (error) {
      console.error('Booking error:', error);
      alert('There was an error processing your booking. Please try again.');
    }
  });
});

/**
 * Generate and download PDF invoice
 * @param {Object} formData - Form data object
 * @param {number} pricePerPerson - Price per person
 * @param {number} totalPrice - Total booking price
 */

//jsPDF usage starts here
function generateInvoicePDF(formData, pricePerPerson, totalPrice) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Header design (super duper simple)
  doc.setFillColor(141, 123, 104);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('JomTravel Invoice', 105, 20, { align: 'center' });

  // Body design (also super duper simple)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(71, 60, 56);
  
  //message
  let y = 40;
  doc.text('Thank you for booking with JomTravel!', 105, y, { align: 'center' });
  y += 12;
  
  // Separator
  doc.setDrawColor(141, 123, 104);
  doc.line(30, y, 180, y);
  y += 12;
  
  // Booking details
  doc.setFontSize(13);
  const details = [
    ['Full Name:', formData.name],
    ['Email Address:', formData.email],
    ['Contact Number:', formData.contact],
    ['Preferred Package:', formData.pkg],
    ['Travel Date:', formData.date],
    ['No. of Adults:', formData.adults.toString()],
    ['No. of Children:', formData.children.toString()],
    ['Price per Person:', `RM${pricePerPerson.toLocaleString()}`]
  ];
  
  details.forEach(([label, value]) => {
    doc.text(label, 30, y);
    doc.text(value, 80, y);
    y += 10;
  });
  
  // Total price
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(141, 123, 104);
  doc.text('Total Price:', 30, y);
  doc.text(`RM${totalPrice.toLocaleString()}`, 80, y);
  
  // Footer message
  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(141, 123, 104);
  doc.text('We look forward to your adventure!', 105, y, { align: 'center' });

  // Save PDF name and format
  doc.save('JomTravel_Invoice.pdf');
}