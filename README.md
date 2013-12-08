# Denote

A complement chrome extension for tumblr, that finds and displays
reblogs with comments.

[Chrome Extension][1]

## Getting Started

Denote does rely on [node.js][4] and [npm][5] to build, so this section
assumes you have both already installed on your system.

```bash
git clone https://github.com/sourrust/denote.git
cd denote
npm install
```

Depending on what you want to work on, the `watch` tasks will come in
handy to lint JavaScript or transpile less files. The safest choice is
to use `grunt watch` to watch for both, but you can also be more
specific with `grunt watch:less` or `grunt watch:jshint`.

## Tumblr API Calls

One part of this extension uses the [Tumblr API][2] to pull in the full
contents of a post that was clicked. With the reliance on the API calls,
you will need to add in your own api key to actually get this feature
working locally without it 401-ing on you. Where you put the api key is
in the `url` method inside of the model located in
[js/models/note.js][3].

The change will look some like:

```diff
- apikey    = '&api_key=<api key>';
+ apikey    = '&api_key=123apikey';
```

Obviously that isn't a real key, but you get the idea that you will need
to get your own, just made sure you don't accidentally commit it into
the repository. However, just a small side note, when I release the
extension to the chrome web store, my api key will be package in there;
If you wish to go though the steps to get it, I don't compress the code
in the packaged extension, so it will be in the same place.

[1]: https://chrome.google.com/webstore/detail/denote/ibfbkmghalfjcfeoocejnhhenidpgnbg
[2]: http://www.tumblr.com/docs/en/api/v2
[3]: https://github.com/sourrust/denote/blob/master/js/models/note.js
[4]: http://nodejs.org/
[5]: https://npmjs.org/
