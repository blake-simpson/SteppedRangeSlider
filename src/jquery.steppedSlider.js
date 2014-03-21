/***
 * Allow jQuery UI sliders to work with stepped values
 *
 * Author: Blake Simpson
 * Version: 1.0
 * Created: 13 March 2014
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

(function($) {

  var SteppedSlider, _defaultOptions;

  _defaultOptions = {
    range: false,
    trueValues: [],
    callback: $.noop
  };

  /**
   * @method _buildOptions
   * @param {Object} options
   * @returns {Object} augmented options
   * Build the option object and fill default properties
   */
  function _buildOptions (options) {
    // First clone defaults or $.extend will have a side effect
    // and future instances will be infected with false options
    var defaults = $.extend( true, {}, _defaultOptions ),
      opts = $.extend(defaults, options);

    opts.step = 1;
    opts.min = 0;
    opts.max = (opts.trueValues.length - 1);

    if ( !opts.range && !opts.value ) {
      opts.value = opts.min;
    } else if ( opts.range && !opts.values ) {
      opts.values = [opts.min, opts.max];
    }

    return opts;
  }

  /**
   * @method _findNearest
   * @param {Number} slider value
   * @param {Array} all values
   * @returns {Number} true value
   * @private
   * Find the true value from the given slider value
   */
  function _findNearest (givenValue, trueValues) {
    return trueValues[ givenValue  ];
  }

  /**
   * @class SteppedSlider
   * @param {Object} DOM Node
   * @param {Object} options
   */
  SteppedSlider = function (node, options) {
    this.$node   = $(node);
    this.options = _buildOptions(options);
    this.init();
  };

  /**
   * @method init
   * Create the jQuery UI slider instance on this node
   */
  SteppedSlider.prototype.init = function () {
    var opts = this.options,
        fakeCBOpts = {};

    opts.slide = $.proxy(this.slide, this);
    this.slider = this.$node.slider(opts);

    // Fake a callback to give an initial state

    if ( opts.values ) {
      fakeCBOpts.values = opts.values;
    } else {
      fakeCBOpts.value = opts.value;
    }

    this.slide(null, fakeCBOpts);
  };


  /**
   * @method slide
   * @param {Event} event
   * @param {Object} jQuery UI
   * The slide event callback from the jQuery UI slider instance
   */
  SteppedSlider.prototype.slide = function (event, ui) {
    var trueValues = this.options.trueValues,
      callbackObject, val, valLeft, valRight;

    callbackObject = {
      position: ui.value,
      ui: ui,
      event: event
    };

    if ( this.options.range ) {
      valLeft  = _findNearest(ui.values[0], trueValues);
      valRight = _findNearest(ui.values[1], trueValues);

      callbackObject.values = {
        left: valLeft,
        right: valRight
      };
    } else {
      val = _findNearest(ui.value, trueValues);
      callbackObject.value = val;
    }

    this.options.callback(callbackObject);
  };

  /**
   * Add the plugin to the jQuery prototype
   */
  $.fn.steppedSlider = function(opts) {
    return this.each(function() {
      var $this = $(this),
        steppedSlider;

      if ($this.data("steppedSlider")) { return;}

      steppedSlider = new SteppedSlider(this, opts);
      $this.data("steppedSlider", steppedSlider);
    });
  };

})(jQuery);
