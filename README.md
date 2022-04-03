# Schmackhaft

A browser extension for bookmarks based on tags, inspired by del.icio.us.

## Development & Maintenance

1. Clone the Repository

   ```
   git clone https://github.com/exhuma/schmackhaft
   cd schmackhaft
   ```

1. Install all dependencies

   ```
   npm ci
   ```

1. Run the auto-reloading build process

   This process will monitor the code-base for any changes and automatically
   build the JavaScript files from the TypeScript files and bundle them up for
   usage as a browser extension.

   ```
   npm run autobuild
   ```

1. Run a web-browser with the extension

   This process will open a new web-browser in development mode with the
   extension readily loaded. It also automatically reloads the extension on any
   changes.

   ```
   npm run browser
   ```
