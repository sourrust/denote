import { Router } from 'backbone';
import Notes      from './collections/notes';
import NotesView  from './views/notecontainer';
import PostView   from './views/post';

let collection;

const views = {};

export default Router.extend({
  routes: {
    'index': 'noteContainer',
    'post/:id': 'fullPost'
  },

  initialize({ data }) {
    const router = this;

    collection = new Notes(null, { data });

    views.notes    = new NotesView({ collection, router });
    views.fullPost = new PostView({ router });
  },

  noteContainer() {
    views.fullPost.hide();
    views.notes.show();
  },

  fullPost(id) {
    const oldView = views.notes;
    const newView = views.fullPost;

    newView.model = collection.get(id);
    newView.render();

    oldView.hide();
    newView.show();
  }
});
