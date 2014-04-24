# SteppedRangeSlider 1.0

#### SteppedRangeSlider is a jQuery plugin allowing creation of jQuery UI slider elements with non-linear steps.


The default jQuery UI slider step values must move in fixed steps, whilst this script allows you to define steps custom values for each step.


## Example
     <script>
      $(function() {
        var trueVals = [1,2,4,8,16,32,64,128,256,512];

        //Initiate the stepped range slider
        $("#slider-simple").steppedSlider({
          trueValues: trueVals,
          range: true,
          callback: function (slide) {
            $(".range-left").text(slide.values.left);
            $(".range-right").text(slide.values.right);
          }
        });

      });
    </script>

    <div class="slider-wrapper">
      <h2>Stepped range slider</h2>
      <p class="options">Option: <i>range: true</i></p>
      <p class="current-value"><span class="range-left"></span> &ndash; <span class="range-right"></span></p>

      <div id="slider-simple" class="slider">
        <div class="slider-body"></div>
      </div>
    </div>


## Live Example

For more examples, with more features and customisation, please see the HTML file in the /examples/ directory.