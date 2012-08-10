<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    
    <title>Life is Only a Dream</title>
    <meta name="description" content="">
    <meta name="author" content="">
    
    <!-- 
    
    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=1;" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta names="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    
    -->

    <!-- CSS -->
    <link href='http://fonts.googleapis.com/css?family=Sorts+Mill+Goudy:400,400italic' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="./assets/css/normalize.css">
    <link rel="stylesheet" href="./assets/css/site.css">
    
    <!--[if gte IE 9]>
      <style type="text/css">
        .gradient { filter: none; }
      </style>
    <![endif]-->
    
    <!-- end CSS-->
    
    <!-- Javascript Libraries -->

    <script src="./assets/js/libs/radio.min.js"></script>
    <script src="./assets/js/libs/zepto.min.js"></script>
    <script src="./assets/js/libs/zepto.data.js"></script>
    <script src="./assets/js/libs/handlebars.min.js"></script>
    <script src="./assets/js/libs/modernizr.custom.82275.js"></script>    
        
    <!-- Javascript Application -->
    
    <script src="./assets/js/app/Dream.js"></script>
    <script src="./assets/js/app/classes/Util.js"></script>
    <script src="./assets/js/app/classes/Event.js"></script>
    <script src="./assets/js/app/classes/Panel.js"></script>
    <script src="./assets/js/app/classes/Keyboard.js"></script>
    <script src="./assets/js/app/classes/Mobile.js"></script>
        
    <!--
    <script src="./assets/js/libs.compiled.js"></script>
    <script src="./assets/js/app.compiled.js"></script>
    -->
    <script id="tmplPanel" type="text/x-handlebars-template">
        <div class="panelWrapper offRight" data-lowimage="{{lowimage}}" data-highimage="{{image}}">
            <div class="panelCenter">
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

    <div id="container">
        <div id="main" role="main">
            <div id="panels"></div>
        </div>
    </div>
    
    <script>
            
        $(function(){
                                    
            var Life = Dream.init({
                debug: false,
                panels: <?php echo $panels; ?>
            });
            
        });
    
    </script>

</body>
</html>
