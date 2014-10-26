# Denote

A complement chrome extension for tumblr, that finds and displays
reblogs with comments and replies.

[Chrome Extension][1]

## Getting Started

Denote does rely on [node.js][2], [npm][3], and [bower][4] to build, so
this section assumes you have both already installed on your system.

```bash
git clone https://github.com/sourrust/denote.git
cd denote
npm install
bower install
```

Depending on what you want to work on, the `watch` tasks will come in
handy to lint JavaScript or transpile less files. The safest choice is
to use `grunt watch` to watch for both, but you can also be more
specific with `grunt watch:less` or `grunt watch:jshint`.

## Tumblr API Calls

One part of this extension uses the [Tumblr API][5] to pull in the full
contents of a post that was clicked. With the reliance on the API calls,
you will need to add in your own api key to actually get this feature
working locally without it 401-ing on you. Where you put the api key is
in a file located in `.secret/config.json`. This file will be read and
added in during the build step.

The JSON for this is pretty simple, it only have one key entry:

```json
{
  "apikey": "Enter api key here..."
}
```

API keys are not to be put into the repository, which is why the
`.secret` fold is ignore in [.gitignore][6]. However, just a small side
note, when I release the extension to the chrome web store, my api key
will be package in there; If you wish to go though the steps to get it,
I don't compress the code in the packaged extension, so it will be some
where in the generated `popup.js` file.


[1]: https://chrome.google.com/webstore/detail/denote/ibfbkmghalfjcfeoocejnhhenidpgnbg
[2]: http://nodejs.org/
[3]: https://npmjs.org/
[4]: http://bower.io/
[5]: http://www.tumblr.com/docs/en/api/v2
[6]: https://github.com/sourrust/denote/blob/master/.gitignore
