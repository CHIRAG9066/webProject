// Initialize Bootstrap components
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

document.addEventListener('DOMContentLoaded', () => {
    // Add jQuery to the page
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    jqueryScript.onload = initializeJQuery;
    document.head.appendChild(jqueryScript);
    
    // Smooth scroll for anchor links (original functionality)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  
    // Navbar scroll behavior (original functionality)
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'white';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.backgroundColor = 'white';
        navbar.style.boxShadow = 'none';
      }
    });
});

// jQuery functionality for footer
function initializeJQuery() {
  $(document).ready(function() {
    // Create footer HTML
    const footerHTML = `
      <footer id="main-footer" class="bg-dark text-white py-5 mt-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-4 mb-4 mb-lg-0">
              <h5 class="mb-4">EventMaster</h5>
              <p>Creating exceptional events that leave lasting impressions for corporate events, weddings, conferences, and private celebrations.</p>
            </div>
            <div class="col-lg-4 mb-4 mb-lg-0">
              <h5 class="mb-4">Contact Us</h5>
              <ul class="list-unstyled">
                <li class="mb-2"><i class="bi bi-geo-alt me-2"></i>123 Event Plaza, Suite 456</li>
                <li class="mb-2"><i class="bi bi-telephone me-2"></i>(123) 456-7890</li>
                <li class="mb-2"><i class="bi bi-envelope me-2"></i>info@eventmaster.com</li>
              </ul>
            </div>
            <div class="col-lg-4">
              <h5 class="mb-4">Follow Us</h5>
              <div class="social-icons">
                <a href="#" class="text-white me-3 fs-5"><i class="bi bi-facebook"></i></a>
                <a href="#" class="text-white me-3 fs-5"><i class="bi bi-twitter"></i></a>
                <a href="#" class="text-white me-3 fs-5"><i class="bi bi-instagram"></i></a>
                <a href="#" class="text-white me-3 fs-5"><i class="bi bi-linkedin"></i></a>
              </div>
            </div>
          </div>
          <hr class="my-4 bg-light">
          <div class="row">
            <div class="col-md-12 text-center">
              <p class="mb-0">&copy; 2023 EventMaster. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    `;
    
    // Add footer after about section
    $('#about').after(footerHTML);
    
    // Add subtle fade-in animation
    $('#main-footer').hide().fadeIn(1000);
  });
}