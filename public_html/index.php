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

    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=1;" />
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
                <img src="./assets/img/909god.png">
            </div>
            <div class="m-item">
                <img src="./assets/img/gritty.png">
            </div>
            <div class="m-item">
                <img src="./assets/img/ravens.png">
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

            function padImages() {
                padImage($('.m-item img'));
            }

            function padImage(img) {

                var viewport_wide = $(window).width();
                var viewport_high = $(window).height();

                img = $(img);
                var pad = Math.floor((viewport_wide - img.width()) / 2);
                img.css({paddingLeft:pad,paddingRight:pad});

            }

            $('.m-item img').load(function(){
                padImage(this);
            });

            $(window).resize(function(){
                waitForFinalEvent(function(){
                    padImages();
                }, 250, "imagepadder");
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
