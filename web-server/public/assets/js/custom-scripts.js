/*------------------------------------------------------
    Author : www.webthemez.com
    License: Commons Attribution 3.0
    http://creativecommons.org/licenses/by/3.0/
---------------------------------------------------------  */

(function($) {
  "use strict";
  var mainApp = {

    initFunction: function() {
      /*MENU
      ------------------------------------*/
      $('#main-menu').metisMenu();

      $(window).bind("load resize", function() {
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
        data: client_measures, // data printed via PUG. tests: mock_data
        xkey: 'date',
        ykeys: ['aqi'],
        labels: ['aqi'],
        fillOpacity: 0.6,
        hideHover: 'auto',
        behaveLikeLine: true,
        resize: true,
        pointFillColors: ['#ffffff'],
        pointStrokeColors: ['black'],
        lineColors: ['gray', '#30a5ff']

      });


      $('.bar-chart').cssCharts({
        type: "bar"
      });
      $('.donut-chart').cssCharts({
        type: "donut"
      }).trigger('show-donut-chart');
      $('.line-chart').cssCharts({
        type: "line"
      });

      $('.pie-thychart').cssCharts({
        type: "pie"
      });


    },

    initialization: function() {
      mainApp.initFunction();

    }

  }
  // Initializing ///

  $(document).ready(function() {
    mainApp.initFunction();
    $("#sideNav").click(function() {
      if ($(this).hasClass('closed')) {
        $('.navbar-side').animate({
          left: '0px'
        });
        $(this).removeClass('closed');
        $('#page-wrapper').animate({
          'margin-left': '260px'
        });

      } else {
        $(this).addClass('closed');
        $('.navbar-side').animate({
          left: '-260px'
        });
        $('#page-wrapper').animate({
          'margin-left': '0px'
        });
      }
    });
  });

}(jQuery));
