## How to Contribute

Denote is in it's early state of development, but the code itself seem
pretty safe to use on an everyday basis. So really the feature set is
pretty small and should be the main concern at this point — at least
within the scope of the problem denote is trying to solve. If there are
features that you would like to see in denote, either put it in an
[issue][1] or start hacking on it yourself.

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
tpope's, guide][2]. And if you want to make things easier on yourself,
use a client for working with commit message. For me personally, I use
[fugitive][3] because my editor of choice is vim.

### Run `gulp jshint` before committing

This is just so I know, at the very least, the code is in the style I
want it to be. Much rather have the code base be consistent with
everything else — as far as JavaScript goes when linting the code.

### Submit pull request using the branch you are working on.

Simple as that.

[1]: https://github.com/sourrust/denote/issues
[2]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
[3]: https://github.com/tpope/vim-fugitive
