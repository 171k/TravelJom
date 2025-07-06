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
  // Create gallery modal elements
  const galleryModal = document.createElement('div');
  galleryModal.className = 'gallery-modal';
  galleryModal.innerHTML = `
    <div class="gallery-modal-content">
      <span class="close-gallery">&times;</span>
      <h3 class="gallery-title"></h3>
      <div class="gallery-main-image-container">
        <img src="" alt="" class="gallery-main-image">
      </div>
      <div class="gallery-thumbnails"></div>
    </div>
  `;
  document.body.appendChild(galleryModal);

  const overlayBg = document.createElement('div');
  overlayBg.className = 'overlay-bg';
  document.body.appendChild(overlayBg);

  // Get modal elements
  const modalContent = galleryModal.querySelector('.gallery-modal-content');
  const closeGalleryBtn = galleryModal.querySelector('.close-gallery');
  const galleryTitle = galleryModal.querySelector('.gallery-title');
  const mainImageContainer = galleryModal.querySelector('.gallery-main-image-container');
  const mainImage = galleryModal.querySelector('.gallery-main-image');
  const thumbnailsContainer = galleryModal.querySelector('.gallery-thumbnails');

  // Handle highlight card clicks
  document.querySelectorAll('.highlight-card').forEach(card => {
    const cardMainImage = card.querySelector('.main-image-container img');
    const cardTitle = card.querySelector('h4').textContent;
    const additionalImages = card.querySelectorAll('.additional-images img');

    card.addEventListener('click', function(e) {
      // Only open modal if clicking on the image container or its children
      if (e.target.closest('.main-image-container')) {
        // Set modal content
        galleryTitle.textContent = cardTitle;
        mainImage.src = cardMainImage.src;
        mainImage.alt = cardMainImage.alt || cardTitle;
        
        // Clear and populate thumbnails
        thumbnailsContainer.innerHTML = '';
        
        // Add main image as first thumbnail
        const mainThumb = document.createElement('img');
        mainThumb.src = cardMainImage.src;
        mainThumb.alt = 'Main view';
        thumbnailsContainer.appendChild(mainThumb);
        
        // Add additional images
        additionalImages.forEach(img => {
          const thumb = document.createElement('img');
          thumb.src = img.src;
          thumb.alt = img.alt || '';
          thumbnailsContainer.appendChild(thumb);
        });
        
        // Set up thumbnail click handlers
        thumbnailsContainer.querySelectorAll('img').forEach(thumb => {
          thumb.addEventListener('click', function() {
            mainImage.src = this.src;
            mainImage.alt = this.alt;
          });
        });
        
        // Show modal and overlay
        galleryModal.classList.add('active');
        overlayBg.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal handlers
  function closeModal() {
    galleryModal.classList.remove('active');
    overlayBg.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  closeGalleryBtn.addEventListener('click', closeModal);
  overlayBg.addEventListener('click', closeModal);

  // Close modal with ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Prevent modal content clicks from closing modal
  modalContent.addEventListener('click', function(e) {
    e.stopPropagation();
  });
});

// Animation on scroll
function animateOnScroll() {
  const elements = document.querySelectorAll('.detail-card, .highlight-card, .section-title');
  
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
document.querySelectorAll('.detail-card, .highlight-card, .section-title').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Run on load and scroll
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);