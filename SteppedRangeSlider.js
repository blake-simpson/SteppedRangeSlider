// Allow jQuery UI range slides to work with non-linear value steps and multiple sliders per page
(function($){
   var SteppedRangeSlider = function(element, options)
   {
       var $elem = $(element);
       var $obj = this;
       // default options
       var $opts = {
         slider_values: [0,1,2,3,4, 5, 6, 7, 8, 9],
         divider: " - "
       }
       //basic slider requirements
       $opts.min =    options.min || $opts.slider_values[0];
       $opts.max =    options.max || $opts.slider_values[$opts.slider_values.length-1];
       $opts.values = options.values || [$opts.min, $opts.max];
      
       //add the custom options to the $opts hash
       $.extend($opts, options || {});
       // init UI slider
       
       
       this.displaySliderValue = function() {
         // get slider values
         var value_one = $obj.slider.slider('values', 0);
         var value_two = $obj.slider.slider('values', 1);
         //set the display text
         $($opts.display_class).text( $obj.getDisplayMask(value_one) + $opts.divider + $obj.getDisplayMask(value_two));
         //update hidden fields
         $($opts.hidden_fields[0]).val($obj.getRealValue(value_one));
         $($opts.hidden_fields[1]).val($obj.getRealValue(value_two)); 
       }
       
       //credit to: Alconja - http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change
       this.findNearest = function(value) {
           var nearest = null;
           var diff = null;

           for (var i = 0; i < $opts.slider_values.length; i++) {
               if (($opts.include_left && $opts.slider_values[i] <= value) || ($opts.include_right && $opts.slider_values[i] >= value)) {
                   var newDiff = Math.abs(value - $opts.slider_values[i]);
                   if (diff == null || newDiff < diff) {
                       nearest = $opts.slider_values[i];
                       diff = newDiff;
                   }
               }
           }
           return nearest;
       }
       
       //credit to: Alconja - http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change
       this.getRealValue = function(sliderValue) {
           for (var i = 0; i < $opts.slider_values.length; i++) {
               if ($opts.slider_values[i] >= sliderValue) {
                   return $opts.display_values[i];
               }
           }
           return 0;
       }
       
       this.getDisplayMask = function(sliderValue) {
         for (var i = 0; i < $opts.slider_values.length; i++) 
         {
           if ($opts.slider_values[i] >= sliderValue) 
           {
             if(typeof $opts.display_unit != "undefined" && $opts.display_unit.length == 2)
             {
               var dv = $opts.display_values[i];
               return $opts.display_unit[0] == "before" ? $opts.display_unit[1] + " " + dv : dv + " " + $opts.display_unit[1];
             } 
             else if(typeof $opts.display_masks != "undefined" && $opts.display_masks.length > 0) 
             {
                   return $opts.display_masks[i];
             } 
             else 
             {
               //if no masks or unit values given, just show the display value
               return $obj.getRealValue(sliderValue);
             }
           }
         }
       }
       
       this.initSlider = function() {
         $obj.slider = $elem.slider({
            range: true,
            min: $opts.min,
            max: $opts.max,
            values: $opts.values,
            // slide event callback
            slide: function( event, ui ) {
              $.extend($opts, {include_left: event.keyCode != $.ui.keyCode.RIGHT});
              $.extend($opts, {include_right: event.keyCode != $.ui.keyCode.LEFT}); 
              // "Step" the slider to the next position
              var current_value = $obj.findNearest(ui.value);
              // find the true slider value
              if (ui.value == ui.values[0]) {
                  $obj.slider.slider('values', 0, current_value);
              } else {
                  $obj.slider.slider('values', 1, current_value);
              }
              // show the display slider value, with an array key lookup from display array
              $obj.displaySliderValue();
              return false;
            }
          });
       }
   };
   
   $.fn.stepRangeSlider = function(options)
   {
      $options = options;
      return this.each(function()
      {
        var element = $(this);
        // Return early if this element already has a plugin instance
        if (element.data('steppedrangeslider')) return;
        var steppedrangeslider = new SteppedRangeSlider(this, $options);
        // Store plugin object in this element's data
        element.data('steppedrangeslider', steppedrangeslider);
        //create the slider element
        steppedrangeslider.initSlider();
        //show the slider values and populate hidden fields
        steppedrangeslider.displaySliderValue();
      });
   };
   
})(jQuery);