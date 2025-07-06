// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Gallery Modal Functionality
document.addEventListener('DOMContentLoaded', function () {
  // Get Bootstrap modal elements
  const galleryModal = document.getElementById('galleryModal');
  const modalTitle = galleryModal.querySelector('.modal-title');
  const modalImage = galleryModal.querySelector('.modal-body img');
  const thumbnailsContainer = galleryModal.querySelector('.d-flex.flex-wrap');

  // Handle highlight card clicks
  document.querySelectorAll('.card[style*="cursor: pointer"]').forEach(card => {
    const cardMainImage = card.querySelector('.position-relative img');
    const cardTitle = card.querySelector('h4').textContent;
    const additionalImages = card.querySelectorAll('.d-none img');

    card.addEventListener('click', function(e) {
      // Only open modal if clicking on the image container or its children
      if (e.target.closest('.position-relative')) {
        // Set modal content
        modalTitle.textContent = cardTitle;
        modalImage.src = cardMainImage.src;
        modalImage.alt = cardMainImage.alt || cardTitle;
        
        // Clear and populate thumbnails
        thumbnailsContainer.innerHTML = '';
        
        // Add main image as first thumbnail
        const mainThumb = document.createElement('img');
        mainThumb.src = cardMainImage.src;
        mainThumb.alt = 'Main view';
        mainThumb.className = 'img-thumbnail';
        mainThumb.style.cssText = 'width: 100px; height: 80px; object-fit: cover; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; border: 2px solid transparent;';
        thumbnailsContainer.appendChild(mainThumb);
        
        // Add additional images
        additionalImages.forEach(img => {
          const thumb = document.createElement('img');
          thumb.src = img.src;
          thumb.alt = img.alt || '';
          thumb.className = 'img-thumbnail';
          thumb.style.cssText = 'width: 100px; height: 80px; object-fit: cover; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; border: 2px solid transparent;';
          thumbnailsContainer.appendChild(thumb);
        });
        
        // Set up thumbnail click handlers
        thumbnailsContainer.querySelectorAll('img').forEach(thumb => {
          thumb.addEventListener('click', function() {
            modalImage.src = this.src;
            modalImage.alt = this.alt;
          });
          
          // Thumbnail hover effects
          thumb.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 5px 15px rgba(141, 123, 104, 0.3)';
            this.style.borderColor = '#E2AC6B';
          });
          
          thumb.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
            this.style.borderColor = 'transparent';
          });
        });
        
        // Show Bootstrap modal
        const modal = new bootstrap.Modal(galleryModal);
        modal.show();
      }
    });
  });
});

// Animation on scroll
function animateOnScroll() {
  const elements = document.querySelectorAll('.card, .text-center[style*="position: relative"]');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.2;
    
    if (elementPosition < screenPosition) {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }
  });
}

// Set initial styles for animation
document.querySelectorAll('.card, .text-center[style*="position: relative"]').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Run on load and scroll
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll); 