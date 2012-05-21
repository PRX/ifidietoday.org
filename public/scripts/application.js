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