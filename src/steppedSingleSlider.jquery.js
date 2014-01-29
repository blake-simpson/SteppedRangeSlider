/**
* Allow jQuery UI range slides to work with non-linear value steps and multiple sliders per page
*
* For examples please see /examples/ folder, or visit the GitHub repository
*
* Author: Blake Simpson
* Version: 0.1
* Updated: 12 August 2011
* URL: http://github.com/BlakeSimpson/SteppedRangeSlider
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

(function($){
  //SteppedSingleSlider class
  var SteppedSingleSlider = function(element, options)
  {
    var $elem = $(element);
    var $obj = this;
    // default options
    var $opts = {
      divider: " - "
    }

    //add the custom options to the $opts hash
    $.extend($opts, options || {});

    //basic slider requirements
    $opts.min =    options.min    || $opts.slider_values[0];
    $opts.max =    options.max    || $opts.slider_values[$opts.slider_values.length-1];
    $opts.value = options.value || $opts.min;

    this.displaySliderValue = function() {
      // get slider values
      var slider_value = $obj.slider.slider('option', 'value');
      //set the display text, only if the display text option is available
      if($opts.display_area_class)
      {
        $('.' + $opts.display_area_class).text($obj.getDisplayMask(slider_value));
      }
      //update hidden fields, if they are available
      if($opts.hidden_field)
      {
        $("#" + $opts.hidden_field).val($obj.getRealValue(slider_value));
      }
    }

    //credit to: Alconja - http://stackoverflow.com/questions/967372/jquery-slider-how-to-make-step-size-change for inital idea
    this.findNearest = function(value) {
      var nearest = null;
      var offset = null;

      for (var i = 0; i < $opts.slider_values.length; i++) {
        if (($opts.include_left && $opts.slider_values[i] <= value) || ($opts.include_right && $opts.slider_values[i] >= value)) {
          var new_offset = Math.abs(value - $opts.slider_values[i]);
          if (offset == null || new_offset < offset) {
            nearest = $opts.slider_values[i];
            offset = new_offset;
          }
        }
      }
      return nearest;
    }

    this.getRealValue = function(slider_value) {
      for (var i = 0; i < $opts.slider_values.length; i++) {
        if ($opts.slider_values[i] >= slider_value) {
          return $opts.true_values[i];
        }
      }
      return 0;
    }

    this.getDisplayMask = function(slider_value) {
      for (var i = 0; i < $opts.slider_values.length; i++) {
        if ($opts.slider_values[i] >= slider_value) {
          // check if a display_unit has been given
          if(typeof $opts.display_masks != "undefined" && $opts.display_masks.length > 0) {
            // find the display_mask values, or return a zero
            return $opts.display_masks[i] || 0;
          } else if(typeof $opts.display_unit != "undefined") {
            //find the true value and add check if the display_unit_placement has been set to "after", if not default to "before"
            var true_value = $opts.true_values[i];
            return $opts.display_unit_place && $opts.display_unit_place == "after" ? true_value + $opts.display_unit : $opts.display_unit + true_value;
          } else {
            //if no masks or unit values given, just show the display value
            return $obj.getRealValue(slider_value);
          }
        }
      }
    }

    this.initSlider = function() {
      $obj.slider = $elem.slider({
        range: false,
        min: $opts.min,
        max: $opts.max,
        value: $opts.value,
        // slide event callback
        slide: function( event, ui ) {
          //store the keypress event for this slider and save it to the options
          if(!$opts.include_left || !$opts.include_right) {
            $.extend($opts, {include_left:  event.keyCode != $.ui.keyCode.RIGHT});
            $.extend($opts, {include_right: event.keyCode != $.ui.keyCode.LEFT});
          }
          // "Step" the slider to the next position
          var current_value = $obj.findNearest(ui.value);
          $obj.slider.slider('option', 'value', current_value);
          // show the display slider value, with an array key lookup from display array
          $obj.displaySliderValue();
          return false;
        }
      });
    }
  };

  //Extend jQuery to add the steppedSingleSlider method
  $.fn.steppedSingleSlider = function(options)
  {
    $options = options;
    return this.each(function() {
      var element = $(this);
      // Return early if this element already has a plugin instance
      if (element.data('steppedsingleslider')) return;
      var steppedsingleslider = new SteppedSingleSlider(this, $options);
      // Store plugin object in this element's data
      element.data('steppedsingleslider', steppedsingleslider);
      //create the slider element
      steppedsingleslider.initSlider();
      //show the slider values and populate hidden fields
      steppedsingleslider.displaySliderValue();
    });
  };

})(jQuery);

