/**
 * Background process for manifest-v2 based browsers (f.ex. Firefox)
 */
browser.commands.onCommand.addListener((command) => {
  if (command === "open-popup") {
    browser.browserAction.openPopup();
  }
});
