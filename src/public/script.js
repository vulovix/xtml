'use strict';

class SidebarManager {
  constructor(sidebarSelector, sidebarBtnSelector) {
    this.sidebar = document.querySelector(sidebarSelector);
    this.sidebarBtn = document.querySelector(sidebarBtnSelector);
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.sidebarBtn.addEventListener("click", () => {
      this.toggleSidebar();
    });
  }

  toggleSidebar() {
    this.sidebar.classList.toggle("active");
  }
}

class TestimonialsModal {
  constructor(testimonialsItemsSelector, modalContainerSelector, modalCloseBtnSelector, overlaySelector) {
    this.testimonialsItems = document.querySelectorAll(testimonialsItemsSelector);
    this.modalContainer = document.querySelector(modalContainerSelector);
    this.modalCloseBtn = document.querySelector(modalCloseBtnSelector);
    this.overlay = document.querySelector(overlaySelector);

    this.modalImg = document.querySelector("[data-modal-img]");
    this.modalTitle = document.querySelector("[data-modal-title]");
    this.modalText = document.querySelector("[data-modal-text]");

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.testimonialsItems.forEach(item => {
      item.addEventListener("click", () => {
        this.fillModal(item);
        this.toggleModal();
      });
    });

    this.modalCloseBtn.addEventListener("click", () => {
      this.toggleModal();
    });

    this.overlay.addEventListener("click", () => {
      this.toggleModal();
    });
  }

  fillModal(item) {
    this.modalImg.src = item.querySelector("[data-testimonials-avatar]").src;
    this.modalImg.alt = item.querySelector("[data-testimonials-avatar]").alt;
    this.modalTitle.innerHTML = item.querySelector("[data-testimonials-title]").innerHTML;
    this.modalText.innerHTML = item.querySelector("[data-testimonials-text]").innerHTML;
  }

  toggleModal() {
    this.modalContainer.classList.toggle("active");
    this.overlay.classList.toggle("active");
  }
}

class FilterManager {
  constructor(selectSelector, selectItemSelector, selectValueSelector, filterBtnSelector) {
    this.selectElement = document.querySelector(selectSelector);
    this.selectItems = document.querySelectorAll(selectItemSelector);
    this.selectValueElement = document.querySelector(selectValueSelector);
    this.filterButtons = document.querySelectorAll(filterBtnSelector);
    this.filterItems = document.querySelectorAll("[data-filter-item]");

    this.initializeEvents();
  }

  initializeEvents() {
    this.selectElement.addEventListener("click", this.toggleDropdown.bind(this)); // Bind 'this' context

    this.selectItems.forEach(item => {
      item.addEventListener("click", () => this.handleItemSelected(item));
    });

    this.filterButtons.forEach(button => {
      button.addEventListener("click", () => this.handleFilterButtonClick(button));
    });
  }

  elementToggleFunc(elem) {
    elem.classList.toggle("active");
  }

  toggleDropdown() {
    this.elementToggleFunc(this.selectElement);
  }

  handleItemSelected(selectedItem) {
    const selectedValue = selectedItem.innerText.toLowerCase();
    this.selectValueElement.innerText = selectedValue;
    this.toggleDropdown();
    this.filterFunc(selectedValue);
  }

  handleFilterButtonClick(selectedButton) {
    const selectedValue = selectedButton.innerText.toLowerCase();
    this.selectValueElement.innerText = selectedValue;
    this.filterFunc(selectedValue);
    this.updateActiveFilterButton(selectedButton);
  }

  updateActiveFilterButton(selectedButton) {
    this.filterButtons.forEach(btn => btn.classList.remove('active'));
    selectedButton.classList.add("active");
  }

  filterFunc(selectedValue) {
    this.filterItems.forEach(item => {
      if (selectedValue === "all") {
        item.classList.add("active");
      } else if (selectedValue === item.dataset.category) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }
}

class ContactForm {
  constructor(formSelector, formInputsSelector, formBtnSelector) {
    this.form = document.querySelector(formSelector);
    this.formInputs = document.querySelectorAll(formInputsSelector);
    this.formBtn = document.querySelector(formBtnSelector);

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.formInputs.forEach(input => {
      input.addEventListener("input", () => {
        if (this.form.checkValidity()) {
          this.formBtn.removeAttribute("disabled");
        } else {
          this.formBtn.setAttribute("disabled", "");
        }
      });
    });
  }
}

class Router {
  constructor(navigationLinksSelector, pagesSelector) {
    this.navigationLinks = document.querySelectorAll(navigationLinksSelector);
    this.pages = document.querySelectorAll(pagesSelector);

    this.handleInitialHash();
    this.setupEventListeners();
  }

  handleInitialHash() {
    const currentHash = window.location.hash.slice(1).toLowerCase();
    const currentPath = window.location.pathname.slice(1).toLocaleLowerCase();
    if (currentHash) {
      this.activatePage(currentHash);
    }
    if (currentPath) {
      this.activatePage(currentPath);
    }
    if (!currentHash && !currentPath) {
      this.activatePage("home");
    }
  }

  activatePage(pageName) {
    this.navigationLinks.forEach(link => {
      const linkText = link.textContent.trim().toLowerCase();
      // const linkTextHTML = `${linkText}.html`;
      const correspondingPage = document.querySelector(`[data-page="${linkText}"]`);
      if (linkText === pageName) {
        link.classList.add("active");
        if (correspondingPage) {
          correspondingPage.classList.add("active");
        }
      } else {
        link.classList.remove("active");
        if (correspondingPage) {
          correspondingPage.classList.remove("active");
        }
      }
    });
  }

  trim(value) {
    let result = value.slice(1).toLocaleLowerCase();
    const extension = ".html";
    if (result.includes(extension)) {
      result = result.slice(0, -5);
    }
    return result;
  }

  setupEventListeners() {
    window.addEventListener('popstate', event => {
      const hash = this.trim(event.target.location.hash);
      const pathname = this.trim(event.target.location.pathname);
      if (hash) {
        this.activatePage(hash);
      }
      if (pathname) {
        this.activatePage(pathname)
      }
    });

    this.navigationLinks.forEach((link, index) => {
      link.addEventListener("click", e => {
        // e.preventDefault();
        const pageName = link.textContent.trim().toLowerCase();
        this.pages.forEach((page, pageIndex) => {
          if (pageName === page.dataset.page) {
            page.classList.add("active");
            this.navigationLinks[pageIndex].classList.add("active");
            window.scrollTo(0, 0);
            if (pageIndex === 0) {
              history.pushState("", document.title, window.location.pathname);
            } else {
              window.location.hash = pageName;
            }
          } else {
            page.classList.remove("active");
            this.navigationLinks[pageIndex].classList.remove("active");
          }
        });
      });
    });
  }
}

class OnLoadManager {
  constructor() {
    this.callbacks = [];
  }

  registerOnLoad(callback) {
    if (typeof callback === "function") {
      this.callbacks.push(callback);
    } else {
      console.error("OnLoadManager: Invalid callback provided.");
    }
  }

  handleUrlRedirection() {
    const url = new URL(window.location.href);

    if (url.pathname.endsWith(".html")) {
      let pathWithoutHtml = url.pathname.slice(0, -5);

      if(pathWithoutHtml === "/index"){
        pathWithoutHtml = "/";
      }

      // Update displayed content (optional)
      document.title = document.title.replace(/\.html$/, "");

      // Update browser history (optional)
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, pathWithoutHtml);
      }
    } else if(url.pathname.startsWith("/index")){
      const path = "/";
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, path);
      }
    }
  }

  onLoad() {
    for (const callback of this.callbacks) {
      callback();
    }
  }

  start() {
    // Register the URL redirection logic as a callback
    this.registerOnLoad(this.handleUrlRedirection.bind(this));
    window.onload = this.onLoad.bind(this);
  }
}

class FileExtensionManager {
  constructor() {

  }

  findLinks() {
    this.links = Array.from(document.querySelectorAll("a"));
  }

  removeHtmlExtension() {
    for (const link of this.links) {
      try{
        const url = new URL(link.href);
        if (url.pathname.includes(".html")) {
          url.pathname = url.pathname.slice(0, -5);
          url.pathname = url.pathname === '/index' ? "/" : url.pathname;
          link.href = url.toString();
        }
      } catch(e){
        console.log("Error (removeHtmlExtension): ", e, link)
      }
    }
  }

  run() {
    if(window.location.protocol === "file:"){
      return;
    }
    this.findLinks();
    this.removeHtmlExtension();
  }
}
// /** WIDGETS */
// try{

//   class Component {
//     constructor(element) {
//       this.element = element;
//       const { component, props } = this.getComponentData(element);
//       this.componentName = component;
//       this.props = props;
//     }

//     // Function to get component data (unchanged)
//     getComponentData(element) {
//       const component = element.dataset.component;
//       const props = {};
//       for (const [key, value] of Object.entries(element.dataset)) {
//         if (key.startsWith('prop')) {
//           const propName = key.slice(4).toLowerCase(); // Remove "prop-" prefix and lowercase
//           props[propName] = value;
//         }
//       }
//       return { component, props };
//     }

//     render() {
//       // Implement component rendering logic based on componentName and props
//       let content;
//       switch (this.componentName) {
//         case 'wallet':
//           content = `<h2>Wallet with ID: ${this.props.id}</h2>`;
//           break;
//         // Add more cases for other component types
//         default:
//           content = `Unknown component: ${this.componentName}`;
//       }
//       this.element.innerHTML = content;
//     }
//   }



//   // Function to render components (now within the class)
//   class App {
//     constructor() {
//       this.appElement = document.getElementById('app');
//     }
//     // this should be invoked at build:
//     /**
//      * - get all components
//      * 
//      * - render them at specific place, for example <!-- component: wallet -->
//      */
//     renderComponents() {
//       const elements = this.appElement.querySelectorAll('[data-component]');
//       elements.forEach(element => {
//         const component = new Component(element);
//         component.render();
//       });
//     }

//     start() {
//       this.renderComponents();
//     }
//   }

//   // Create and start the app
//   const app = new App();
//   app.start();
// } catch(e){
//   console.log(e)
// }
// /** WIDGETS END */


try{
  const manager = new OnLoadManager();
  manager.start();
} catch(e){
  console.log("Error in OnLoadManager: ", e);
}

document.addEventListener("DOMContentLoaded", () => {
  const navLinkSelector = "[data-nav-link]";
  const pageSelector = "[data-page]";
  const formSelector = "[data-form]";
  const formInputSelector = "[data-form-input]";
  const formButtonSelector = "[data-form-btn]";
  const sidebarSelector = "[data-sidebar]";
  const sidebarButtonSelector = "[data-sidebar-btn]";
  const testimonialItemSelector = "[data-testimonials-item]";
  const modalContainerSelector = "[data-modal-container]";
  const modalCloseButtonSelector = "[data-modal-close-btn]";
  const overlaySelector = "[data-overlay]";

  const blogSelectSelector = "[data-select-blog]";
  const blogSelectItemSelector = "[data-select-item-blog]";
  const blogSelectValueSelector = "[data-selecct-value-blog]";
  const blogFilterButtonSelector = "[data-filter-btn-blog]";

  const portfolioSelectSelector = "[data-select-portfolio]";
  const portfolioSelectItemSelector = "[data-select-item-portfolio]";
  const portfolioSelectValueSelector = "[data-selecct-value-portfolio]";
  const portfolioFilterButtonSelector = "[data-filter-btn-portfolio]";

  const photographySelectSelector = "[data-select-photography]";
  const photographySelectItemSelector = "[data-select-item-photography]";
  const photographySelectValueSelector = "[data-selecct-value-photography]";
  const photographyFilterButtonSelector = "[data-filter-btn-photography]";

  try {
    new Router(navLinkSelector, pageSelector);
  } catch (e) {
    console.log("Error in Router: ", e);
  }
  try {
    new ContactForm(formSelector, formInputSelector, formButtonSelector);
  } catch (e) {
    console.log("Error in ContactForm: ", e);
  }
  try {
    new SidebarManager(sidebarSelector, sidebarButtonSelector);
  } catch (e) {
    console.log("Error in SidebarManager: ", e);
  }
  try {
    new TestimonialsModal(testimonialItemSelector, modalContainerSelector, modalCloseButtonSelector, overlaySelector);
  } catch (e) {
    console.log("Error in TestimonialsModal: ", e);
  }
  try {
    new FilterManager(blogSelectSelector, blogSelectItemSelector, blogSelectValueSelector, blogFilterButtonSelector);
  } catch (e) {
    console.log("Error in BlogFilterManager: ", e);
  }
  try {
    new FilterManager(portfolioSelectSelector, portfolioSelectItemSelector, portfolioSelectValueSelector, portfolioFilterButtonSelector);
  } catch (e) {
    console.log("Error in PortfolioFilterManager: ", e);
  }

  try {
    new FilterManager(photographySelectSelector, photographySelectItemSelector, photographySelectValueSelector, photographyFilterButtonSelector);
  } catch (e) {
    console.log("Error in PhotographyFilterManager: ", e);
  }

  try {
    const manager = new FileExtensionManager()
    manager.run();
  } catch (e) {
    console.log("Error in PhotographyFilterManager: ", e);
  }
});
