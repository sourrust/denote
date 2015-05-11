import { Router } from 'backbone';
import Notes      from './collections/notes';
import NotesView  from './views/notecontainer';
import PostView   from './views/post';


var collection, views = {};

export default Router.extend({
  routes: {
    'index': 'noteContainer',
    'post/:id': 'fullPost'
  },

  initialize: function(options) {
    collection = new Notes(null, { data: options.data });

    views.notes = new NotesView({
      collection: collection,
      router: this
    });

    views.fullPost = new PostView({ router: this });
  },

  noteContainer: function() {
    views.fullPost.hide();
    views.notes.show();
  },

  fullPost: function(id) {
    var oldView = views.notes,
        newView = views.fullPost;

    newView.model = collection.get(id);
    newView.render();

    oldView.hide();
    newView.show();
  }
});
