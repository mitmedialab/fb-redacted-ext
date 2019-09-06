fb-redacted-ext
===============

TBD

Installation
------------

```shell
$ npm install
```

Development
-----------

To compile:

```shell
$ npx webpack
```

This will create JS, CSS, and image sin `dist`.

In Chrome:

- go to `chrome://extensions/`
- click "Load Unpacked"
- navigate to the `dist` directory
- click "Select"

You'll see the extension loaded.

You'll need to both reload the extension and reload Facebook to see changes during development.
