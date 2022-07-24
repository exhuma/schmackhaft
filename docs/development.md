# Development

Bug/Feature-tracker is over at [exhuma/schmackhaft](https://github.com/exhuma/schmackhaft).

The project provides a VS-Code "development container". This is optional
but provides a reproducible build environment with all required system
dependencies. When working with VS-Code (including the
`ms-vscode-remote.vscode-remote-extensionpack` extension) the development
container can be built manually by opening the command-pallette (CTRL-SHIFT-P)
and selecting `Remote-Containers: Rebuild Container` command. This can also be
used any time something in the container has changed.

1. Clone the Repository

   ```
   git clone https://github.com/exhuma/schmackhaft
   cd schmackhaft
   ```

1. Build

   - With VS-Code using the "Remote Containers" extension

     - Build the development container

       Select "Remote-Containers: Rebuild Container" from the command-pallette
       (CTRL-SHIFT-P)

     - Build the extension

       Open a terminal inside VS-Code and run:

       ```
       make dist
       ```

   - Without VS-Code

     - Build the development container

       ```
       docker build \
         -t schmackhaft-dev-container \
         -f .devcontainer/Dockerfile .
       ```

     - Build the extension

       - Fetch required npm dependencies:

         ```
         docker run \
           --rm \
           -it \
           -u $(id -u) \
           -v $(pwd):/data \
           -w /data \
           schmackhaft-dev-container \
           npm ci
         ```

       - Build the extension:

         ```
         docker run \
           --rm \
           -it \
           -u $(id -u) \
           -v $(pwd):/data \
           -w /data \
           schmackhaft-dev-container \
           make dist
         ```

   This will create the following artifacts:

   - `dist/*.zip`

     Zipped files, ready for distribution to the browser app stores

   - `unpackaged/mozilla`

     The generated source-code for Mozilla based browsers

   - `unpackaged/chrome`

     The generated source-code for Chromium based browsers

### Component Development

For an easier development cycle, a lot of code is written in
[lit](https://lit.dev). This allows us to run a development server with `npm run serve` and access `/demo/index.html` to try out the components. This makes it
possible to have a develop/test cycle without the need to reload the browser
extension. It also makes it a lot easier to use the browser development tools.

## Load the extension into the browser for testing

- Chromium based browsers

  Open the "extensions" page [chrome://extensions/](chrome://extensions/) and
  drag/drop the generated `.zip` file onto that page

  Alternatively, follow the instructions on
  [Chrome: Loading unpacked
  extensions](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked)
  with the unzipped contents.

- Mozilla based browsers

  Either unzip the `.zip` file from the dist folder, or use the `dist/mozilla`
  folder and follow the steps detailed on [Mozilla: Installing Web
  Extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing)
