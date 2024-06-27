# xtml

The Evolution of Static.

Built entirely with HTML, CSS and Vanilla JS.

At the end, you'll get fully static HTML/CSS website with minimal JS.

---

### Pages:

The core building blocks that define your website's structure.
Each page can contain multiple components and leverage reusable widgets.

### Components:

Represent the logical parts of your app, similar to React components.
Built entirely with HTML, offering full control over the structure.

### Widgets:

Reusable components that encapsulate specific functionalities.
Defined using templates for a consistent look and feel.
Allow passing props (data) to the template for customization.

### Templates:

Act as blueprints for your widgets, defining the overall structure.
Can display and manipulate props passed from the widget for dynamic content. Template can use components and receive props.

### In essence:

You build pages by composing components and reusable widgets.
Widgets are defined by templates and customized with props. 

This modular approach promotes clean, maintainable, and scalable static websites.

---

### WHY ?

Because i needed something that generates pure html without bunch of JS chunks all around.
 
### DEVELOPMENT

In order to run this app in development you need to hit only one comand:

`docker-compose up --build`

It will start development server at http://localhost.

You will see dist folder with all the HTMLs generated inside. 

If you are not using docker, and you don't wanna serve it via nginx, you can simply build the app by running `node main.js` and open generated dist file via filesystem protocol.

### CONTRIBUTION

**Your contribution is very welcome!**

Feel free to create a pull request.