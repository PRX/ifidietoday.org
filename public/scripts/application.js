window.fbAsyncInit = function() {
  FB.init({
    // appId      : '371339856249007', // App ID Dev
    appId      : '296851790405194', // App ID Stag
    // appId      : '224293531011555', // App ID Prod
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
  var friends = [];
  var locationStr = "";
  var birthdayStr = "";

  $('#transition').bind('ended', function() {
    $('#cover').fadeIn('slow', function() {
      $('body').removeClass('video').addClass('show');
      $('#cover').fadeOut('slow');
    })
  });

  $('.stories li').click(function() {
    $('#clip video').attr('src', $(this).attr('data-video-url'));
    $('#clip').show();
  });

  $('#clip a').click(function() {
    document.getElementById('video_clip').pause();
    $('#clip').hide();
  })

  function populate() {
    // $('body').removeClass('form').removeClass('landing').addClass('show');
    $('body').removeClass('form').removeClass('landing').addClass('video');
    document.getElementById('transition').play();

    var _longState = states[stateCodes.indexOf(locationStr.split(',')[1].toLowerCase().replace(' ', ''))];

    $('.birthyear').html(birthdayStr.split('/')[2]);
    $('.fbProfileImage').attr('src', 'https://graph.facebook.com/'+fbUser.id+'/picture?type=normal');
    $('#cert .header').html('State of '+_longState+' - Department of Health');
    $('#cert .fname').html(fbUser.first_name+" ");
    $('#cert .lname').html(fbUser.last_name+" ");
    $('#cert .city').html(locationStr.split(',')[0]+" ");
    $('#cert .state').html(locationStr.split(',')[1]+" ");
    $('#cert .date').html(Date.today().getMonthName() + " " + Date.today().getDate() + ", " + (parseInt(Date.today().getYear()) + 1900)+" ");


   var causes = ['drowning', 'skull fracture', 'internal injuries', 'asphyxiation', 'cardiac arrest', 'exsanguination', 'drug overdose', 'stroke'];
   var cause = causes[Math.floor((Math.random()*causes.length)+1)];

    $('#cert .cause').html(cause+" ");

    var system = friendFacts[_longState]['system'];
    $('#cert .system').html(system);
  }

  function populateFriends() {



    $.each(friends, function(i, friend) {
      var _state = friend.location.name.split(',')[1].replace(' ','');
      var _stateface = stateFace[states.indexOf(_state)];

      var el = $('.friend-facts li:nth-of-type('+(i+1)+')');
      $('img', el).attr('src', 'https://graph.facebook.com/'+friend.id+'/picture?type=normal');
      $('a', el).html('Tell ' + friend.first_name);
      $('h2', el).html(friend.location.name.split(',')[1]);
      $('h3', el).html(_stateface);

      var fact = friendFacts[_state]['fact'].replace('[NAME]', friend.name);
      if (fact === '') {
        fact = genericFriendFacts[i];
      }

      $('p', el).html(fact);
    });
    console.log('start checking');
    if ($('p', '.friend-facts li:nth-of-type(1)').html() === '') {
      $('img', '.friend-facts li:nth-of-type(1)').hide();
      $('a', '.friend-facts li:nth-of-type(1)').hide();
      $('p', '.friend-facts li:nth-of-type(1)').html(genericFriendFacts[0]);
    }

    if ($('p', '.friend-facts li:nth-of-type(2)').html() === '') {
      $('img', '.friend-facts li:nth-of-type(2)').hide();
      $('a', '.friend-facts li:nth-of-type(2)').hide();
      $('p', '.friend-facts li:nth-of-type(2)').html(genericFriendFacts[1]);
    }
  }

  function populateAnecdotes() {
    var n = anecdotes.length;

    $('.stories li').each(function(i, el) {
      $('h3', el).html(anecdotes[i]['title']);
      $('p', el).html(anecdotes[i]['body']);
      $('img', el).attr('src', anecdotes[i]['posterURL']);
      $(this).attr('data-video-url', anecdotes[i]['videoURL']);
    });

  }

  $('a.facebook').click(function() {
    FB.login(function(response) {
      if (response.authResponse) {
        FB.api('/me/friends', { limit: 100 }, function(_friends) {

          var usedLocation = '';
          $.each(_friends['data'], function(i, friend) {
            FB.api('/' + friend.id, {}, function(ff) {
              if (ff.location && ff.location.name && (ff.location.name.match(/California|Georgia|Indiana|Louisiana|Massachusetts|Michigan|Mississippi|Nebraska|New Mexico|South Carolina|Texas|West Virginia$/))) {
                if (friends.length < 2 && ff.location.name.split(',')[1].replace(' ', '') != usedLocation) {
                  usedLocation = ff.location.name.split(',')[1].replace(' ', '');
                  friends.push(ff);
                } else {
                  populateFriends();
                }
              }
            });
          });
        });

        FB.api('/me', function(response) {
          fbUser = response;

          birthdayStr = response.birthday;

          populateAnecdotes();

          if (response.location) {
            var loc = response.location.name;
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

  function typeCertificate() {
    var checkPositionsX = [28,197,357];
    var checkPositionsY = [405,434];

    $('.slide2 .check').css('left', checkPositionsX[2]).css('top', checkPositionsY[1]);

    setTimeout(function() { $('.slide2 .fname').show().typewriter(); }, 2000);
    setTimeout(function() { $('.slide2 .lname').show().typewriter(); }, 4000);
    setTimeout(function() { $('.slide2 .city').show().typewriter(); }, 6000);
    setTimeout(function() { $('.slide2 .state').show().typewriter(); }, 8000);
    setTimeout(function() { $('.slide2 .date').show().typewriter(); }, 9000);
    setTimeout(function() { $('.slide2 .cause').show().typewriter(); }, 11000);
    setTimeout(function() { $('.slide2 .check').show().typewriter(); }, 13500);
    setTimeout(function() { $('.slide2 .signature').fadeIn(); }, 14000);
    setTimeout(function() { $('.slide2 .stamp').fadeIn(); }, 16000);
    setTimeout(function() { $('.slide2 .stamp').fadeOut(); }, 19000);
    setTimeout(function() { $('.slide2 .questionmark').fadeIn(); }, 19000);
  }

  function updateNextPreviousButtons(page, total) {
  var slide = $('#modules section:nth-of-type('+page+')');
  $('a[href="#previous"]').html(slide.prev().attr('data-title'));
  $('a[href="#next"]').html(slide.next().attr('data-title'));

    // if (page === 1) {
    //   $('a[href="#previous"]').hide();
    // } else {
    //   $('a[href="#previous"]').show();
    // }

    populateFriends();

    if (page === total) {
      $('a[href="#next"]').hide();
    } else {
      $('a[href="#next"]').show();
    }

    if (page === 2) {
      typeCertificate();
    }
  }



  $('a[href="#next"]').each(function() {
    $(this).click(function(ev) {
      ev.preventDefault();

      var _page = parseInt($('#modules').attr('data-page'), 10);

      if (_page+1 > numModules) {
        var page = 1;
      } else {
        var page = _page + 1;
      }

      updateNextPreviousButtons(page, numModules);

      $('#modules').attr('data-page', page);
      $('#backgrounds').attr('data-page', page);
    });
  });

  $('a[href="#previous"]').each(function() {
    $(this).click(function(ev) {
      ev.preventDefault();

      var _page = parseInt($('#modules').attr('data-page'), 10);

      if (_page-1 < 1) {
        var page = numModules;
      } else {
        var page = _page - 1;
      }

      updateNextPreviousButtons(page, numModules);

      $('#modules').attr('data-page', page);
      $('#backgrounds').attr('data-page', page);
    });
  });
});