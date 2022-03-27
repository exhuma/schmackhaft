document.getElementById("SaveButton").addEventListener("click", () => {
  let tagInput = document.getElementById("TagsField").value.trim();
  let tags = [];
  if (tagInput !== "") {
    tags = tagInput.split(",").map((item) => item.trim());
  }
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    browser.runtime.sendMessage({
      method: "addBookmark",
      args: { href: tabs[0].url, title: tabs[0].title, tags: tags },
    });
  }, console.error);
});

document.getElementById("DeleteButton").addEventListener("click", () => {
  let response = confirm("Do you want to delete this bookmark?");
  if (!response) {
    return;
  }
  browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    browser.runtime.sendMessage({
      method: "removeBookmark",
      args: { href: tabs[0].url },
    });
  }, console.error);
});
