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

$(function() {
  var numModules = $('#modules section').length;

  var fbUserId = "";
  var locationStr = "";
  var birthdayStr = "";

  function populate() {
    $('.birthyear').html(birthdayStr.split('/')[2]);
    $('.fbProfileImage').attr('src', 'https://graph.facebook.com/'+fbUserId+'/picture?type=normal')
  }

  $('a.facebook').click(function() {
    FB.login(function(response) {
      if (response.authResponse) {
        FB.api('/me', function(response) {
          fbUserId = response.id;
          birthdayStr = response.birthday;

          if (response.location) {
            locationStr = response.location;

            populate();
          } else {
            $('#birthday').html(response.birthday);
            $('body').addClass('form');
          }
        });
      } else {
        alert('Did not get authorization');
      }
    }, {scope:'user_likes,user_photos,user_photo_video_tags,user_birthday,user_location'});
  });

  $('#submit').click(function(e) {
    e.preventDefault();

    locationStr = $('#city').val() + ', ' + $('#state').val();
    $('body').removeClass('form').removeClass('landing').addClass('show');

    populate();
  })

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