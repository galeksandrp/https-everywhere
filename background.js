$('#fixit').click(function() {
  var state = $('#state').val();
  if (state.startsWith('www.')) {
    $('#state').val(state.substring(4));
  }
  else {
    var url = new URL(state);
    if (url) {
      var hostname = url.hostname;
      if (hostname.startsWith('www.')) hostname = hostname.substring(4);
      $('#state').val(hostname);
    }
  }
});
$('#forcepush').click(function() {
  $('#url').off();
  $('#url').submit();
});
$('#url').submit(function(event) {
  var state = $('#state').val();
  if (!state.startsWith('www.')) {
    try {
      new URL(state);
    }
    catch (e) {
      return;
    }
  }
  event.preventDefault();
  $('body').append('<pre>' + Date() + ' possible non-domain. Fix it or push anyway</pre>');
  $('#panel').css('display', 'block');
});
