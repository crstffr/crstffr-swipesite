<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title>Carousel test</title>
    <meta name="description" content="">
    <meta name="author" content="">

    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=no;" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta names="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    <!-- CSS -->
    <link rel="stylesheet" href="./assets/css/normalize.css">
    <link rel="stylesheet" href="./assets/css/site.css">
    <link rel="stylesheet" href="./assets/css/carousel.css">
    <link rel="stylesheet" href="./assets/css/carousel-style.css">

    <!-- end CSS-->

    <!-- Javascript Libraries -->

    <script src="./assets/js/libs/jquery.min.js"></script>
    <script src="./assets/js/libs/mobify-carousel.js"></script>
    <script src="./assets/js/libs/modernizr.custom.82275.js"></script>


</head>

<body>

    <div id="gradient" class="gradient"></div>

    <div class="m-carousel">
        <!-- the slider -->
        <div class="m-carousel-inner">
            <!-- the items -->

            <div class="m-item m-active">
                <img src="./assets/img/art/sisyphus.jpg">
            </div>
            <div class="m-item">
                <img src="./assets/img/art/symmetry_man.jpg">
            </div>
            <div class="m-item">
                <img src="./assets/img/art/xray-controller.png">
            </div>
            <div class="m-item">
                <img src="./assets/img/art/909god.png">
            </div>
            <div class="m-item">
                <img src="./assets/img/art/gritty.png">
            </div>
            <div class="m-item">
                <img src="./assets/img/art/ravens.png">
            </div>
        </div>
    </div>

    <script>

        $(function(){

            $('.m-carousel').carousel({
                dragRadius:10,
                moveRadius:20,
                classPrefix:undefined,
                classNames:{
                    outer:"carousel",
                    inner:"carousel-inner",
                    item:"item",
                    center:"center",
                    touch:"has-touch",
                    dragging:"dragging",
                    active:"active"
                }
            });

            function resizeImage(img) {

                $(img).each(function(){

                    img = $(this);

                    var ratio = img.width() / img.height();
                    var viewport_wide = $(window).width();
                    var viewport_high = $(window).height();

                    var multi = .9;
                    var new_w = 0;
                    var new_h = 0;

                    if (ratio >= 1){ // landscape or square

                        new_w = viewport_wide * multi;
                        new_h = new_w / ratio;

                    } else if (ratio < 1) { // portrait

                        new_h = viewport_high * multi;
                        new_w = new_h * ratio;

                    }

                    img.width(new_w).height(new_h);

                });

            }

            function padImage(img) {

                var viewport_wide = $(window).width();
                var viewport_high = $(window).height();

                $(img).each(function(){
                    img = $(this);
                    var pad_w = Math.floor((viewport_wide - img.width()) / 2);
                    var pad_h = Math.floor((viewport_high - img.height()) / 2);
                    img.css({paddingLeft:pad_w,paddingRight:pad_w,paddingTop:pad_h,paddingBottom:pad_h});
                });
            }

            function padImages() {
                padImage($('.m-item img'));
            }

            function resizeImages() {
                resizeImage($('.m-item img'));
            }

            $('.m-item img').load(function(){
                resizeImage(this);
                padImage(this);
            });

            $(window).resize(function(){
                waitForFinalEvent(function(){
                    resizeImages();
                    padImages();
                }, 10, "imagepadder");
            });

        });

        var waitForFinalEvent = (function () {
            var timers = {};
            return function (callback, ms, uniqueId) {
                if (!uniqueId) { uniqueId = 0; }
                if (timers[uniqueId]) {
                    clearTimeout(timers[uniqueId]);
                }
                timers[uniqueId] = setTimeout(callback, ms);
            };
        })();

    </script>

</body>
</html>
