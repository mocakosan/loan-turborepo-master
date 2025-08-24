(function ($) {
  // header scroll
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 0) {
      $('body').addClass('scrolled');
    } else {
      $('body').removeClass('scrolled');
    }
  });

  // nav 관련
  $(document).on('click', '.btn-nav', function () {
    $('body').addClass('nav-opened');
  });
  $(document).on('click', 'body.nav-opened .btn-nav', function () {
    $('body').removeClass('nav-opened');
  });

  // quick-banner
  var $scrollTop;
  $(window).on('load resize', function () {
    //console.log($('body').width());
    if ($('body').width() >= 1009) {
      $scrollTop = +170;
      $('.chat-bubble').removeClass('sm');
      $('.chat-bubble').addClass('lg');
    } else {
      $scrollTop = +150;
      $('.chat-bubble').removeClass('lg');
      $('.chat-bubble').addClass('sm');
    }
  });

  // chat-bubble lg 관련
  $(document).on('mouseenter', '.chat-bubble.lg .btn-bubble', function () {
    $('.chat-bubble').removeClass('show');
    $(this).parent().addClass('show');
  });
  $(document).on('mouseleave', '.chat-bubble.lg .btn-bubble', function () {
    $(this).parent().removeClass('show');
  });

  // chat-bubble sm 관련
  $(document).on('click', '.chat-bubble.sm .btn-bubble', function () {
    $('.chat-bubble').removeClass('show');
    $(this).parent().addClass('show');
  });
  $(document).on('click', '.chat-bubble.sm.show .btn-bubble', function () {
    $(this).parent().removeClass('show');
  });
  $(document).on('click', '.btn-bubble-close', function () {
    $('.chat-bubble').removeClass('show');
  });

  $(window).on('scroll', function () {
    if ($(this).scrollTop() >= 100) {
      $('.quick-banner, .quick-sponsor-ad')
        .stop()
        .animate(
          {
            top: $(this).scrollTop() + 170,
          },
          'past',
        );
    } else {
      $('.quick-banner, .quick-sponsor-ad').stop().animate(
        {
          top: 170,
        },
        'past',
      );
    }
  });
})(jQuery);
