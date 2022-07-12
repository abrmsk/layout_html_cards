jQuery(document).ready(function() {
  'usestrict';

  if($('.popapMessage')) {

    setTimeout(() => {
      if($('.popapMessage')) {
        $('.popapMessage').show();
      }
    }, 3000)

    $('.popapMessage').on('click', function() {
      $('.popapMessage').delay(200).slideUp({
        duration: 'slow',
        easing: 'linear'
      });
    });
  }
});

