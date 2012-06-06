window.fbAsyncInit = function() {
  FB.init({
    appId      : '371339856249007', // App ID
    channelUrl : '', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true // parse XFBML
  });

  FB.Event.subscribe('auth.login', function(response) {
    window.location = window.location;
  });

  FB.Canvas.setAutoGrow();
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$('a.facebook').click(function() {
  FB.login(function(response) {
    if (response.authResponse) {
      FB.api('/me', function(response) {
        if (response.location) {
          alert('Yes locaction');
        } else {
          $('body').addClass('form');
        }
      });
    } else {
      alert('Did not get authorization');
    }
  }, {perms:'user_likes,user_photos,user_photo_video_tags,user_birthday,user_location'});
});


$(function() {
  var numModules = $('#modules section').length;

  $('a[href="#next"]').each(function() {
    $(this).click(function(ev) {
      var _page = parseInt($('#modules').attr('data-page'), 10);

      if (_page+1 > numModules) {
        var page = 1;
      } else {
        var page = _page + 1;
      }

      $('#modules').attr('data-page', page);
      $('#backgrounds').attr('data-page', page);
    });
  });

  $('a[href="#previous"]').each(function() {
    $(this).click(function(ev) {
      var _page = parseInt($('#modules').attr('data-page'), 10);

      if (_page-1 < 1) {
        var page = numModules;
      } else {
        var page = _page - 1;
      }

      $('#modules').attr('data-page', page);
      $('#backgrounds').attr('data-page', page);
    });
  });
});