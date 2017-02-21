// Javascript for gallery.html

var title = document.getElementById('gallery-title');

title.onclick = function(e){
    e.preventDefault(); // says, I am taking care of this event, I do not want the browser to handle it.
    var form = document.getElementById('gallery-title-edit');
    form.style.display = 'inline';

}