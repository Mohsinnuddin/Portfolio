'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });


// ==========================
// AcademicProjects Modal
// ==========================
const AcademicProjectsItem = document.querySelectorAll("[data-AcademicProjects-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const AcademicProjectsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < AcademicProjectsItem.length; i++) {
  AcademicProjectsItem[i].addEventListener("click", function () {
    const projectTitle = this.querySelector("[data-AcademicProjects-title]").innerHTML;
    const projectText = this.querySelector("[data-AcademicProjects-text]").innerHTML;
    const projectAvatar = this.querySelector("[data-AcademicProjects-avatar]");

    modalImg.src = projectAvatar.src;
    modalImg.alt = projectAvatar.alt;
    modalTitle.innerHTML = projectTitle;
    modalText.innerHTML = `<p style="color: var(--white-2);">${projectText}</p>`;

    // Update the "View Here" link based on the project
    const viewHereLink = document.querySelector(".projectview-button");
    if (projectTitle.includes("Gym Trainer")) {
      viewHereLink.href = "https://github.com/Mohsinnuddin/Gym-Trainer-App";
    } else if (projectTitle.includes("Tourism Management")) {
      viewHereLink.href = "https://github.com/Mohsinnuddin/Tourism-Management-System";
    }

    AcademicProjectsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", AcademicProjectsModalFunc);
overlay.addEventListener("click", AcademicProjectsModalFunc);


// ==========================
// Contact form validation
// ==========================
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// enable/disable submit button based on validity
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}


// ==========================
// Page navigation
// ==========================
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }
  });
}


// ==========================
// Certification modal
// ==========================
const certificationModalContainer = document.querySelector("[data-certification-modal-container]");
const certificationModal = document.querySelector(".certification-modal");
const certificationOverlay = document.querySelector("[data-certification-overlay]");
const certificationCloseBtn = document.querySelector("[data-certification-close-btn]");
const certificationBtn = document.querySelector("[data-certification-btn]");

const certificationModalFunc = function () {
  certificationModalContainer.classList.toggle("active");
  certificationModal.classList.toggle("active");
  certificationOverlay.classList.toggle("active");
  document.body.classList.toggle("active");
};

if (certificationBtn) {
  certificationBtn.addEventListener("click", function () {
    const certificationImg = document.querySelector("[data-certification-img]");
    if (certificationImg.src.includes("data-analyst-cert")) {
      certificationImg.src = "./assets/images/java-cert.jpg";
    } else {
      certificationImg.src = "./assets/images/data-analyst-cert.jpg";
    }
    certificationModalFunc();
  });
}

if (certificationCloseBtn && certificationOverlay) {
  certificationCloseBtn.addEventListener("click", certificationModalFunc);
  certificationOverlay.addEventListener("click", certificationModalFunc);
}


// ==========================
// Success message after contact form submission
// ==========================
document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    const successMessage = document.querySelector('.success-message');
    const form = document.querySelector('.form');
    if (successMessage && form) {
      successMessage.classList.add('show');
      form.classList.add('hide');
    }
  }
});
