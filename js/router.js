import { Router } from 'backbone';
import Notes      from './collections/notes';
import NotesView  from './views/notecontainer';
import PostView   from './views/post';

let collection;

let views = {};

export default Router.extend({
  routes: {
    'index': 'noteContainer',
    'post/:id': 'fullPost'
  },

  initialize: function({ data }) {
    let router = this;
    collection = new Notes(null, { data });

    views.notes    = new NotesView({ collection, router });
    views.fullPost = new PostView({ router });
  },

  noteContainer: function() {
    views.fullPost.hide();
    views.notes.show();
  },

  fullPost: function(id) {
    let oldView = views.notes;
    let newView = views.fullPost;

    newView.model = collection.get(id);
    newView.render();

    oldView.hide();
    newView.show();
  }
});
