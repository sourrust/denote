# Denote

A complement chrome extension for tumblr, that finds and displays
reblogs with comments.

[Chrome Extension][1]

## Getting Started

Denote does rely on [node.js][2] and [npm][3] to build, so this section
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

One part of this extension uses the [Tumblr API][4] to pull in the full
contents of a post that was clicked. With the reliance on the API calls,
you will need to add in your own api key to actually get this feature
working locally without it 401-ing on you. Where you put the api key is
in the `url` method inside of the model located in
[js/models/note.js][5].

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

## How to Contribute

Denote is in it's early state of development, but the code itself seem
pretty safe to use on an everyday basis. So really the feature set is
pretty small and should be the main concern at this point — at least
within the scope of the problem denote is trying to solve. If there are
features that you would like to see in denote, either put it in an
[issue][6] or start hacking on it yourself.

And before you do start hacking on denote, here is small guide to go
from adding code to you local repo to getting it into the main repo.

### Never use the `master` branch while developing a feature.

When writing a new feature use a branch name that describes what you are
working one, e.g. `fix/post-preview` if you were working on a fix for
the way post previews are presented.

The `master` branch is mainly for merging and some times version
bumping; but, most of the time, you are never going to touch it
directly.

### Keep commits to one idea at a time.

Committing small changes is the best way, for me at least, to look at
what has changed during development. It is almost like a self documented
changelog in the commit message.

For a easy guide on how to structure you commit message just [follow
tpope's, guide][7]. And if you want to make things easier on yourself,
use a client for working with commit message. For me personally, I use
[fugitive][8] because my editor of choice is vim.

### Run `grunt jshint` before committing

This is just so I know, at the very least, the code is in the style I
want it to be. Much rather have the code base be consistent with
everything else — as far as JavaScript goes when linting the code.

### Submit pull request using the branch you are working on.

Simple as that.

[1]: https://chrome.google.com/webstore/detail/denote/ibfbkmghalfjcfeoocejnhhenidpgnbg
[2]: http://nodejs.org/
[3]: https://npmjs.org/
[4]: http://www.tumblr.com/docs/en/api/v2
[5]: https://github.com/sourrust/denote/blob/master/js/models/note.js
[6]: https://github.com/sourrust/denote/issues
[7]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
[8]: https://github.com/tpope/vim-fugitive
