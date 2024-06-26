const fs = require('fs').promises;
const path = require('path');

class Processor {
  constructor() {
    this.pagesDir = 'pages';
    this.componentsDir = 'components';
    this.widgetsDir = 'widgets';
    this.templatesDir = 'templates';
    this.outputDir = 'dist';
    this.publicDir = 'public';
  }

  async build() {
    try {
      await this.processTemplates();
      await this.copyAssets();
      console.log('Process complete.');
    } catch (err) {
      console.error('Error during processing:', err);
    }
  }

  async processTemplates() {
    try {
      const srcPath = path.join(__dirname, 'src');
      const templateFiles = await fs.readdir(path.join(srcPath, this.pagesDir));

      for (const templateFile of templateFiles) {
        const templatePath = path.join(srcPath, this.pagesDir, templateFile);
        const outputPath = path.join(this.outputDir, templateFile);

        let templateData = await fs.readFile(templatePath, 'utf8');
        templateData = await this.injectComponents(templateData);
        templateData = await this.injectWidgets(templateData);

        await this.ensureDirectoryExists(this.outputDir);
        await fs.writeFile(outputPath, templateData, 'utf8');

        console.log('Successfully generated output in', outputPath);
      }
    } catch (err) {
      console.error('Error processing templates:', err);
      throw err;
    }
  }

  async injectComponents(templateData) {
    try {
      const srcPath = path.join(__dirname, 'src');
      const contentFiles = await fs.readdir(path.join(srcPath, this.componentsDir));

      for (const contentFile of contentFiles) {
        const contentPath = path.join(srcPath, this.componentsDir, contentFile);
        const placeholder = `<!-- component: ${contentFile} -->`;

        const contentData = await fs.readFile(contentPath, 'utf8');
        templateData = templateData.replaceAll(placeholder, contentData);
      }

      return templateData;
    } catch (err) {
      console.error('Error injecting components:', err);
      throw err;
    }
  }


  async injectWidgets(templateData) {

    function parseComponentData(htmlString) {
      const match = htmlString.match(/data-template="([^"]+)"(?:\s+data-prop-([^"]+)=["']([^"']+)["'])*/i); // Regular expression for data attributes
    
      if (!match) {
        return null; // No data-template attribute found
      }
    
      const entireMatch = match[0]; // Get the entire matched string
      const component = entireMatch.split('data-template="')[1].split('"')[0].toLowerCase(); // Extract component name (lowercase)
      const props = {};
    
      // Extract multiple props (if any)
      const propMatches = entireMatch.match(/\s+data-prop-([^"]+)=["']([^"']+)["']/gi);
      if (propMatches) {
        for (const propMatch of propMatches) {
          const [propName, propValue] = propMatch.split('=');
          props[propName.slice(11).toLowerCase()] = propValue.split(propValue.charAt(0))[1].trim(); // Extract prop key (lowercase) and value (remove quotes and trim)
        }
      }
    
      const [,children,] = htmlString.split("<!--children-->");

      props.children = children ? children.trim(): undefined;

      return {
        component,
        props,
      };
    }
    

    try {
      const srcPath = path.join(__dirname, 'src');
      const contentFiles = await fs.readdir(path.join(srcPath, this.widgetsDir));

      for (const contentFile of contentFiles) {
        const contentPath = path.join(srcPath, this.widgetsDir, contentFile);
        const placeholder = `<!-- widget: ${contentFile} -->`;

        const contentData = await fs.readFile(contentPath, 'utf8');
        let tempTemplateData = templateData.replaceAll(placeholder, contentData);
        let component = parseComponentData(tempTemplateData);

        if(component){
          const templateFiles = await fs.readdir(path.join(srcPath, this.templatesDir));
          for (const templateFile of templateFiles) {
            if(templateFile === component.component){
              const templatePath = path.join(srcPath, this.templatesDir, templateFile);
              let templateFileData = await fs.readFile(templatePath, 'utf8');
              Object.keys(component.props).forEach(key => {
                if(component.props[key]){
                  templateFileData = templateFileData.replaceAll(`<!--${key}-->`, component.props[key]);
                }
              });
              templateData = templateData.replaceAll(placeholder, templateFileData);
            }
          } 
        }
      }
      templateData = this.injectComponents(templateData)

      return templateData;
    } catch (err) {
      console.error('Error injecting widgets:', err);
      throw err;
    }
  }


  async copyAssets() {
    try {
      const assetsPath = path.join(__dirname, 'src', this.publicDir);
      const files = await fs.readdir(assetsPath);
      const targetDirPath = path.join(this.outputDir, this.publicDir);

      await this.ensureDirectoryExists(targetDirPath);

      for (const file of files) {
        const sourcePath = path.join(assetsPath, file);
        const targetPath = path.join(targetDirPath, file);
        await fs.copyFile(sourcePath, targetPath);
      }

      console.log('Successfully copied assets to', targetDirPath);
    } catch (err) {
      console.error('Error copying assets:', err);
      throw err;
    }
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        console.error(`Error creating directory ${dirPath}:`, err);
        throw err;
      }
    }
  }

  async startWatching(watchDir) {
    try {
      const watcher = await fs.watch(watchDir, { recursive: true });
      console.log(`Watching for changes in ${watchDir} directory...`);
      for await (const event of watcher) {
        if (event.eventType === 'change') {
          console.log(`Detected change in ${event.filename}. Triggering reprocessing...`);
          this.build();
        }
      }
    } catch (err) {
      console.error(`Error watching ${watchDir} directory:`, err);
    }
  }

  start() {
    const watchDirs = [path.join(__dirname, 'src', this.pagesDir), path.join(__dirname, 'src', this.componentsDir), path.join(__dirname, 'src', this.widgetsDir),path.join(__dirname, 'src', this.templatesDir), path.join(__dirname, 'src', this.publicDir)];
    for (const watchDir of watchDirs) {
      this.startWatching(watchDir);
    }
  }
}

const processor = new Processor();

processor.build();

processor.start();
