/*------------------------------------------------------
    Author : www.webthemez.com
    License: Commons Attribution 3.0
    http://creativecommons.org/licenses/by/3.0/
---------------------------------------------------------  */

(function ($) {
    "use strict";
    var mainApp = {

        initFunction: function () {
            /*MENU
            ------------------------------------*/
            $('#main-menu').metisMenu();

            $(window).bind("load resize", function () {
                if ($(this).width() < 768) {
                    $('div.sidebar-collapse').addClass('collapse')
                } else {
                    $('div.sidebar-collapse').removeClass('collapse')
                }
            });

            
            /* MORRIS LINE CHART
			----------------------------------------*/
            Morris.Line({
                element: 'morris-line-chart',
                data: [
					  { y: '2014', a: 50, b: 90},
					  { y: '2015', a: 165,  b: 185},
					  { y: '2016', a: 150,  b: 130},
					  { y: '2017', a: 175,  b: 160},
					  { y: '2018', a: 80,  b: 65},
					  { y: '2019', a: 90,  b: 70},
					  { y: '2020', a: 100, b: 125},
					  { y: '2021', a: 155, b: 175},
					  { y: '2022', a: 80, b: 85},
					  { y: '2023', a: 145, b: 155},
					  { y: '2024', a: 160, b: 195}
				],


      xkey: 'y',
      ykeys: ['a', 'b'],
      labels: ['Total Income', 'Total Outcome'],
      fillOpacity: 0.6,
      hideHover: 'auto',
      behaveLikeLine: true,
      resize: true,
      pointFillColors:['#ffffff'],
      pointStrokeColors: ['black'],
      lineColors:['gray','#30a5ff']

            });


            $('.bar-chart').cssCharts({type:"bar"});
            $('.donut-chart').cssCharts({type:"donut"}).trigger('show-donut-chart');
            $('.line-chart').cssCharts({type:"line"});

            $('.pie-thychart').cssCharts({type:"pie"});


        },

        initialization: function () {
            mainApp.initFunction();

        }

    }
    // Initializing ///

    $(document).ready(function () {
        mainApp.initFunction();
		$("#sideNav").click(function(){
			if($(this).hasClass('closed')){
				$('.navbar-side').animate({left: '0px'});
				$(this).removeClass('closed');
				$('#page-wrapper').animate({'margin-left' : '260px'});

			}
			else{
			    $(this).addClass('closed');
				$('.navbar-side').animate({left: '-260px'});
				$('#page-wrapper').animate({'margin-left' : '0px'});
			}
		});
    });

}(jQuery));
