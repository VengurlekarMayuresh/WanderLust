(() => {
  'use strict';

  // Function to apply Bootstrap validation to all forms
  const applyValidation = () => {
      document.querySelectorAll('.needs-validation').forEach(form => {
          form.addEventListener('submit', event => {
              if (!form.checkValidity()) {
                  event.preventDefault();
                  event.stopPropagation();
              }
              form.classList.add('was-validated');
          }, false);
      });
  };

  // Apply validation when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', applyValidation);
})();


document.getElementById("dropdownBtn").addEventListener("click", function () {
    const dropdownMenu = document.getElementById("dropdownMenu");
    dropdownMenu.classList.toggle("hidden");
});

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {
    const dropdown = document.querySelector(".dropdown");
    if (!dropdown.contains(event.target)) {
        document.getElementById("dropdownMenu").classList.add("hidden");
    }
});

