var IN_PROCESS = false;
$('#url').submit(function(event) {
  event.preventDefault();
  var domain = tldjs.getDomain($('#state').val());
  if (IN_PROCESS) return false;
  IN_PROCESS = true;
  $.getJSON('https://crossorigin.me/https://hstspreload.org/api/v2/status?domain=' + domain).always(function(data) {
    IN_PROCESS = false;
  }.done(function(data) {
    if (data.status === 'preloaded') {
      $('body').append('<a href="https://hstspreload.org/?domain=' + domain + '">' + domain + ' is preloaded</a>');
    }
    else {
      $('#state').val(domain);
      $('#url').off();
      $('#url').submit();
    }
  }));
});
