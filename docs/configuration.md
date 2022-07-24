# Configuration

The extension takes the bookmarks from sources of various types. Currently there
are two types supported:

- External JSON files
- Browser Bookmarks

Each source can be added multiple times. For some sources that does not make
sense (like the browser bookmarks). But for others, like the JSON file it makes
it possible to get bookmarks from more than one such file.

## External JSON files

This source fetches the bookmarks from a JSON file on the web. The provided text
box should contain the web-accessible URL to that file.

The file must have a top-level list of "bookmark items".

## Browser Bookmarks

This will include the default browser-bookmarks to the extension popup. It will
take the folder-names as tags. Example:

```
[
  {
    "href": "https://github.com/exhuma/schmackhaft",
    "tags": ["schmackhaft", "browser-extension", "homepage"],
    "title": "Schmackhaft Homepage"
  },
  {
    "href": "https://google.com",
    "tags": ["search engine", "google"],
    "title": "Google"
  }
]
```

# Screenshot

![Preferences](screenshots/options.png "Preferences")
