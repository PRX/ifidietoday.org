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

  var fbUser = "";
  var locationStr = "";
  var birthdayStr = "";

  function populate() {
    $('body').removeClass('form').removeClass('landing').addClass('show');

    $('.birthyear').html(birthdayStr.split('/')[2]);
    $('.fbProfileImage').attr('src', 'https://graph.facebook.com/'+fbUser.id+'/picture?type=normal');
    $('#cert .header').html('State of '+states[stateCodes.indexOf(locationStr.split(',')[1].toLowerCase().replace(' ', ''))]+' - Department of Health');
    $('#cert .fname').html(fbUser.first_name);
    $('#cert .lname').html(fbUser.last_name);
    $('#cert .city').html(locationStr.split(',')[0]);
    $('#cert .state').html(locationStr.split(',')[1]);
    $('#cert .date').html(Date.today().getMonthName() + " " + Date.today().getDate() + ", " + (parseInt(Date.today().getYear()) + 1900));
    $('#cert .cause').html('Adipiscing Quam Tellus');
  }

  $('a.facebook').click(function() {
    FB.login(function(response) {
      if (response.authResponse) {
        FB.api('/me', function(response) {
          fbUser = response;

          birthdayStr = response.birthday;

          if (response.location) {
            var loc = response.location.name;;
            var _city = loc.split(',')[0];
            var _stateAbr = stateCodes[states.indexOf(loc.split(',')[1].replace(' ',''))].toUpperCase();

            locationStr = _city + ',' + _stateAbr;

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