This folder contains a VS-Code development container definition. When opening
the main poject in VS-Code with the remote-development
(`ms-vscode-remote.vscode-remote-extensionpack`) extension installed, VS-Code
should prompt to "reopen" the folder in a dev-container.

When in this mode, any VS-Code console will run inside that container. The
container contains the required development dependencies.

Additional dependencies (more personalised by the original author) can be
pulled in by executing `bash .devcontainer/init-dev.bash`.
