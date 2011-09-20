/* 
 * jQuery Tagger Plugin
 * Adds tagging functionality to text input fields
 * 
 * Author: Justin D'Arcangelo (http://twitter.com/justindarc)
 * GitHub: https://github.com/justindarc
 * 
 * License:
 *    The MIT License
 * 
 * Revisions:
 *		0.1		- Initial commit
 * 
 * Usage:
 *		$('.tagger').tagger(); // Where matching elements are text inputs
 */
(function($) {

  $.fn.tagger = function(options) {

    // Default plugin options.
    var defaults = {};

    // Extend default plugin options with provided options.
    if (options) {
      $.extend(defaults, options);
    }

    // Iterate over matched elements.
    return this.each(function(index, item) {
      var $textInput = $(item);
      
      // Skip over this matched element if it is not a text input.
      if (!$textInput.is('input[type="text"]')) return;
      
      // Get the id and name attributes of the current text input.
      var id = $textInput.attr('id');
      var name = $textInput.attr('name');
      
      // Create a hidden input with the same id and name as the text input.
      var $hiddenInput = $('<input type="hidden" id="' + id + '" name="' + name + '"/>');

      // Create an empty container to hold the tags.
      var $container = $('<div class="tagger-container"/>');
      
      var time = new Date().getTime();
      
      // Create a method for splitting the entered tag values and creating tags.
      var createTags = function() {
        var tagValues = $textInput.val();

        // Split the entered tag values (comma separated).
        tagValues = (tagValues) ? tagValues.split(',') : [];

        for (var i = 0; i < tagValues.length; i++) {

          // Create the HTML for the new tag.
          var tagHtml = '<div class="tagger-tag">' +
            '<a class="close" href="#">×</a>' +
            '<p>' + tagValues[i] + '</p>' +
          '</div>';

          var $tag = $(tagHtml);

          // Add the tag to the container.
          $container.append($tag);

          // Concatenate a comma-separated list of tag values.
          var value = '';
          $container.find('p').each(function(index, item) {
            value += (value) ? ',' + $(this).text() : $(this).text();
          });

          $hiddenInput.val(value);
        }
        
        // Clear the text input value.
        $textInput.val('');
    	};
      
      // Change the id and name of the text input to the server binds to the
      // hidden input instead.
      $textInput.attr('id', id + '_' + time);
      $textInput.attr('name', name + '_' + time);
      
      // Insert the hidden input and the empty container after the text input.
      $textInput.after($hiddenInput);
      $textInput.parent().append($container);
      
      // Attach an event handler for the keydown event to the text input.
      $textInput.bind('keydown', function(evt) {
        
        // Determine if the Enter/Return key was pressed.
        if (evt.keyCode === 13) {
          var $this = $(this);
          
          createTags();
          
          evt.preventDefault();
        }
      });
      
      // Attach an event handler to the text on all future tags.
      $('p', $container.get(0)).live('click', function(evt) {
        var $this = $(this);
        var $tag = $this.parent();
        var tagValue = $this.text();
        
        // Remove the tag from the container.
        $tag.remove();
        
        // Concatenate a comma-separated list of tag values.
        var value = '';
        $container.find('p').each(function(index, item) {
          value += (value) ? ',' + $(this).text() : $(this).text();
        });
        
        $hiddenInput.val(value);
        $textInput.val(tagValue).focus();
        
        evt.preventDefault();
      });
      
      // Attach an event handler to the close button on all future tags.
      $('a.close', $container.get(0)).live('click', function(evt) {
        var $this = $(this);
        var $tag = $this.parent();
        
        // Remove the tag from the container.
        $tag.remove();
        
        // Concatenate a comma-separated list of tag values.
        var value = '';
        $container.find('p').each(function(index, item) {
          value += (value) ? ',' + $(this).text() : $(this).text();
        });
        
        $hiddenInput.val(value);
        
        evt.preventDefault();
      });
      
      // Convert any pre-existing values to tags.
      createTags();
    });

  };

	// Public function definitions.
	//$.fn.tagger.functionName = function(foo) {
	//	return this;
	//};

	// Private function definitions.
	//var foobar = function() {};

})(jQuery);
