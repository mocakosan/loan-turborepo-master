(function($){
    // modal-pop 관련
    $(document).on('click','.btn-modal', function(e){
        $('.modal-backdrop').addClass('show');
        $($(this).attr('href')).addClass('show');
        e.preventDefault();
    });
    $(document).on('click','.btn-modal-close', function(){
        $('.modal').removeClass('show');
        $('.modal-backdrop').removeClass('show');
    });
    
    // 광고문의 관련
    $(document).on('click', '.selected a.box', function(){
        $('.selected a.box').removeClass('active');
        $(this).addClass('active');
    });
    
    // 회원 가입 전체 체크
    $('#check-all').click(function() {
        if($('#check-all').is(':checked')) {
            $('input[name=aree-check]').prop('checked', true);
        }else{
            $('input[name=aree-check]').prop('checked', false);
        } 
    });
    $('input[name=aree-check]').click(function() {
        var total = $('input[name=aree-check]').length;
        var checked = $('input[name=aree-check]:checked').length;

        if( total != checked ){
            $('#check-all').prop('checked', false);
        } else {
            $('#check-all').prop('checked', true); 
        }
    });
})(jQuery);