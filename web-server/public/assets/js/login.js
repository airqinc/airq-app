/*----------------------------------------------
   AirQ
------------------------------------------------*/
$('.tooltip').hide();

$('.form-input').focus(function() {
  $('.tooltip').fadeOut(250);
  $("." + $(this).attr('tooltip-class')).fadeIn(500);
});

$('.form-input').blur(function() {
  $('.tooltip').fadeOut(250);
});

$('.login-form').one('submit', function(event) {
  event.preventDefault();
  if ($('.login-form').css("transform") == 'none') {
    $('.login-form').css("transform", "rotateY(-180deg)");
    $('.loading').css("transform", "rotateY(0deg)");
    setTimeout(function() {
      $('.loading-spinner-large').css("display", "block");
      $('.loading-spinner-small').css("display", "block");
    }, 500);
    setTimeout(function() {
      $('.login-form').submit();
    }, 1500);
  } else {
    $('.login-form').css("transform", "");
  }
});
