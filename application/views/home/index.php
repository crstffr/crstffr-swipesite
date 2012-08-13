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
    <link rel="stylesheet" href="./assets/css/site.css?321">
    <link rel="stylesheet" href="./assets/css/carousel.css">
    <link rel="stylesheet" href="./assets/css/carousel-style.css">

    <!-- Javascript Libraries -->

    <script src="./assets/js/libs/radio.min.js"></script>
    <script src="./assets/js/libs/jquery.min.js"></script>
    <script src="./assets/js/libs/jquery.color.js"></script>
    <script src="./assets/js/libs/handlebars.min.js"></script>
    <script src="./assets/js/libs/mobify-carousel.js"></script>
    <script src="./assets/js/libs/modernizr.custom.47524.js"></script>

    <!-- Javascript Application -->

    <script src="./assets/js/swiper/Swiper.js"></script>
    <script src="./assets/js/swiper/classes/Util.js"></script>
    <script src="./assets/js/swiper/classes/Mobile.js"></script>
    <script src="./assets/js/swiper/classes/Event.js"></script>
    <script src="./assets/js/swiper/classes/Carousel.js"></script>
    <script src="./assets/js/swiper/classes/Keyboard.js"></script>

    <!-- Javascript Templates -->

    <script id="tmplPanel" type="text/x-handlebars-template">
        <div class="m-item" data-lowimage="{{lowimage}}" data-highimage="{{image}}">
            <div class="panelFrame">
                <div class="panelFront">
                    <img class="panelImg low"  src="" width="{{width}}" height="{{height}}" />
                    <img class="panelImg high" src="" width="{{width}}" height="{{height}}" />
                </div>
                <div class="panelBack">
                    <h2>Test of the Panel Back</h2>
                    <p>Lorem ipsum dolor sit amet... </p>
                </div>
            </div>
            {{#if title}}
            <div class="panelTitle">
                <span class="noselect">{{title}}</span>
            </div>
            {{/if}}
        </div>
    </script>

</head>

<body>

    <div id="gradient" class="gradient"></div>

    <div class="m-carousel" id="carousel">
        <div class="m-carousel-inner" id="panelContainer"></div>
    </div>

    <script>

        $(function(){

            var mySwiper = Swiper.init({
                debug: false,
                elements: {
                    carousel: '#carousel'
                },
                panels: [{"image":".\/assets\/img\/art\/dreams\/008.jpg","lowPath":".\/assets\/img\/art\/dreams\/low\/","imagePath":".\/assets\/img\/art\/dreams\/","title":"I","width":"720","height":"960","borderSize":"25","borderColor":"#cdcab2","titleColor":"#cdcab2","background":"#222222","lowimage":".\/assets\/img\/art\/dreams\/low\/008.jpg"},{"image":".\/assets\/img\/art\/dreams\/007.jpg","lowPath":".\/assets\/img\/art\/dreams\/low\/","imagePath":".\/assets\/img\/art\/dreams\/","title":"II","width":"720","height":"960","borderSize":"25","borderColor":"#cdcab2","titleColor":"#cdcab2","background":"#222222","lowimage":".\/assets\/img\/art\/dreams\/low\/007.jpg"},{"image":".\/assets\/img\/art\/dreams\/005.jpg","lowPath":".\/assets\/img\/art\/dreams\/low\/","imagePath":".\/assets\/img\/art\/dreams\/","title":"III","width":"720","height":"960","borderSize":"25","borderColor":"#ffffff","titleColor":"#cdcab2","background":"#222222","lowimage":".\/assets\/img\/art\/dreams\/low\/005.jpg"},{"image":".\/assets\/img\/art\/dreams\/009.jpg","lowPath":".\/assets\/img\/art\/dreams\/low\/","imagePath":".\/assets\/img\/art\/dreams\/","title":"IV","width":"720","height":"960","borderSize":"25","borderColor":"#cdcab2","titleColor":"#cdcab2","background":"#222222","lowimage":".\/assets\/img\/art\/dreams\/low\/009.jpg"},{"image":".\/assets\/img\/art\/dreams\/017.jpg","lowPath":".\/assets\/img\/art\/dreams\/low\/","imagePath":".\/assets\/img\/art\/dreams\/","title":"V","width":"720","height":"960","borderSize":"25","borderColor":"#cdcab2","titleColor":"#cdcab2","background":"#222222","lowimage":".\/assets\/img\/art\/dreams\/low\/017.jpg"},{"image":".\/assets\/img\/art\/dreams\/012.jpg","lowPath":".\/assets\/img\/art\/dreams\/low\/","imagePath":".\/assets\/img\/art\/dreams\/","title":"VI","width":"720","height":"960","borderSize":"25","borderColor":"#ffffff","titleColor":"#cdcab2","background":"#222222","lowimage":".\/assets\/img\/art\/dreams\/low\/012.jpg"},{"image":".\/assets\/img\/art\/dreams\/013.jpg","lowPath":".\/assets\/img\/art\/dreams\/low\/","imagePath":".\/assets\/img\/art\/dreams\/","title":"VII","width":"720","height":"960","borderSize":"25","borderColor":"#000","titleColor":"#cdcab2","background":"#CCCCCC","lowimage":".\/assets\/img\/art\/dreams\/low\/013.jpg"},{"image":".\/assets\/img\/art\/dreams\/014.jpg","lowPath":".\/assets\/img\/art\/dreams\/low\/","imagePath":".\/assets\/img\/art\/dreams\/","title":"VIII","width":"720","height":"960","borderSize":"25","borderColor":"#FFF","titleColor":"#cdcab2","background":"#222222","lowimage":".\/assets\/img\/art\/dreams\/low\/014.jpg"},{"image":".\/assets\/img\/art\/dreams\/006.jpg","lowPath":".\/assets\/img\/art\/dreams\/low\/","imagePath":".\/assets\/img\/art\/dreams\/","title":"IX","width":"720","height":"960","borderSize":"25","borderColor":"#ffffff","titleColor":"#cdcab2","background":"#222222","lowimage":".\/assets\/img\/art\/dreams\/low\/006.jpg"},{"image":".\/assets\/img\/art\/dreams\/015.jpg","lowPath":".\/assets\/img\/art\/dreams\/low\/","imagePath":".\/assets\/img\/art\/dreams\/","title":"X","width":"720","height":"960","borderSize":"25","borderColor":"#000","titleColor":"#cdcab2","background":"#CCCCCC","lowimage":".\/assets\/img\/art\/dreams\/low\/015.jpg"},{"image":".\/assets\/img\/art\/dreams\/016.jpg","lowPath":".\/assets\/img\/art\/dreams\/low\/","imagePath":".\/assets\/img\/art\/dreams\/","title":"XVI","width":"720","height":"960","borderSize":"25","borderColor":"#000","titleColor":"#cdcab2","background":"#CCCCCC","lowimage":".\/assets\/img\/art\/dreams\/low\/016.jpg"}]
            });

        });

    </script>

</body>
</html>
