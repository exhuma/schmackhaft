document.getElementById("ActionButton").addEventListener("click", () => {
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    browser.runtime.sendMessage({
      method: "addBookmark",
      args: { href: tabs[0].url, title: tabs[0].title },
    });
  }, console.error);
});
