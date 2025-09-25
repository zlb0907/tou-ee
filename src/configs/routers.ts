import INDEX from '../pages/index.jsx';
import EDIT from '../pages/edit.jsx';
import GALLERY from '../pages/gallery.jsx';
import PROFILE from '../pages/profile.jsx';
import ADMINUPLOAD from '../pages/adminUpload.jsx';
import FAVORITES from '../pages/favorites.jsx';
export const routers = [{
  id: "index",
  component: INDEX
}, {
  id: "edit",
  component: EDIT
}, {
  id: "gallery",
  component: GALLERY
}, {
  id: "profile",
  component: PROFILE
}, {
  id: "adminUpload",
  component: ADMINUPLOAD
}, {
  id: "favorites",
  component: FAVORITES
}]