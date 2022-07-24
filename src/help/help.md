# Schmackhaft

_Schmackhaft_ provides access to bookmarks via tags, allowing efficient
"drill-downs" into large collections of bookmarks.

_Schmackhaft_ also makes it possible to aggregate bookmarks from various sources.
This even makes it possible to share bookmarks with teams of users.

The core idea of _Schmackhaft_ remains efficient "drill downs" into tags. It
allows you to:

- _Include_ a tag into searches

  When a tag is "inclusive", the extension shows only bookmarks which contain
  that tag. All other bookmarks are hidden. This also removes all tags that will
  no longer match any bookmarks.

  Including another tag will further filter down the list.

- _Exclude_ a tag from searches

  Then a tag is "exclusive", the extension shows only bookmarks which do _not_
  contain that tag. The rest of the behaviour is the same as with inclusive
  tags.

## Current State

As long as the extension has not reached v1.0 it should be considered a
"preview" release and things may change.

The extension _is usable_ since v0.3 but it is still not possible to add new
bookmarks directly via the extension.

Adding bookmarks relies on the type of "source". For example, an "External JSON
File" would rely on HTTP credentials (username/passord, token, ...) to get
write-access. This has security implications and is therefore not _yet_
implemented.

However, as it is possible to integrate the existing browser-bookmarks into the
extension, adding new bookmarks is partially supported by just adding them in
the browser. Tagging is limited on that source though.

For more information see https://github.com/exhuma/schmackhaft

## User Interface

The user interface is separated into two main sections:

- Tag list
- Bookmark list

To change tags between the "inclusive", "exclusive" and "neutral" state, simply
click on it to cycle the states. Right-clicking on a tag cycles the states in
reverse order.

To quickly "include" a tag, simply click on it if it is neutral.

To quickly "exclude" a tag, simply right-click on it if it is neutral.

## Toolbar

There is a toolbar above the tag- and bookmark-list providing additional "management" options. It allows you to:

- Refresh all bookmarks from all sources
- Open the settings to add/remove sources
- Show the help
