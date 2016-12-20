$('#fixit').click(function() {
  $('#state').val(tldjs.getDomain($('#state').val()));
});
$('#forcepush').click(function() {
  $('#url').off();
  $('#url').submit();
});
$('#url').submit(function(event) {
  var state = $('#state').val();
  if (tldjs.getDomain($('#state').val()) !== state) {
    $('body').append('<pre>' + Date() + ' possible non-domain. Fix it or push anyway</pre>');
    $('#panel').css('display', 'block');
    return false;
  }
});
