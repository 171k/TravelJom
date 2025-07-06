// ===== BOOKING FORM HANDLER =====
document.addEventListener('DOMContentLoaded', function() {
  const bookingForm = document.getElementById('bookingForm');
  
  if (!bookingForm) {
    console.error('Booking form not found');
    return;
  }

  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    try {
      // Extract form data
      const formData = {
        name: this.querySelector('input[placeholder="Your Name"]')?.value || '',
        email: this.querySelector('input[type="email"]')?.value || '',
        contact: this.querySelector('input[placeholder^="eg."]')?.value || '',
        pkg: this.querySelector('#packageSelect')?.value || '',
        date: this.querySelector('input[type="date"]')?.value || '',
        adults: parseInt(this.querySelector('input[min="1"]')?.value || '0'),
        children: parseInt(this.querySelector('input[min="0"]')?.value || '0')
      };
      
      // Validate required fields
      if (!formData.name || !formData.email || !formData.contact || !formData.pkg || !formData.date) {
        alert('Please fill in all required fields');
        return;
      }

      // Package pricing configuration
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
      
      // Show success message
      alert('Booking successful! Your invoice has been downloaded.');
      
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
function generateInvoicePDF(formData, pricePerPerson, totalPrice) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Header styling
  doc.setFillColor(141, 123, 104);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('JomTravel Invoice', 105, 20, { align: 'center' });

  // Body content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(71, 60, 56);
  
  let y = 40;
  doc.text('Thank you for booking with JomTravel!', 105, y, { align: 'center' });
  y += 12;
  
  // Separator line
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

  // Save PDF
  doc.save('JomTravel_Invoice.pdf');
}