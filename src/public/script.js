'use strict';

class Router {
  constructor(navigationLinksSelector, pagesSelector) {
    this.navigationLinks = document.querySelectorAll(navigationLinksSelector);
    this.pages = document.querySelectorAll(pagesSelector);

    this.handleInitialHash();
    this.setupEventListeners();
  }

  handleInitialHash() {
    const currentPath = this.trim(window.location.pathname);

    if (currentPath) {
      this.activateLink(currentPath);
    }
    if (!currentPath) {
      this.activateLink("home");
    }
  }

  activateLink(pageName) {
    this.navigationLinks.forEach(link => {
      const linkText = link.textContent.trim().toLowerCase();
      if (linkText === pageName) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
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
        this.activateLink(hash);
      }
      if (pathname) {
        this.activateLink(pathname)
      }
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

try{
  const manager = new OnLoadManager();
  manager.start();
} catch(e){
  console.log("Error in OnLoadManager: ", e);
}

document.addEventListener("DOMContentLoaded", () => {
  const navLinkSelector = "[data-nav-link]";
  const pageSelector = "[data-page]";
  

  try {
    new Router(navLinkSelector, pageSelector);
  } catch (e) {
    console.log("Error in Router: ", e);
  }

  try {
    const manager = new FileExtensionManager()
    manager.run();
  } catch (e) {
    console.log("Error in PhotographyFilterManager: ", e);
  }
});
