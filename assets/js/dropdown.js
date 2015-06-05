$.fn.dropdown = function(){

    return $(this).each(function(){

        var $this = $(this);
        var $menu = $this.find('.dropdown');

        $this.click(function(){

            $menu.toggleClass('visible');

        });


    })

}
