(function($) {
	$.fn.extend({
		toObject: function() {
		    var result = {}
			$.each(this.serializeArray(), function(i, v) { 
				result[v.name] = v.value;
			});
			return result;
		},
		fromObject: function(obj) {
			$.each(this.find(':input'), function(i,v) {
				var name = $(v).attr('name');
				if (obj[name]) {
				     $(v).val(obj[name]);
				 } else {
					$(v).val('');
				 }
			});
		}
	});
})(jQuery);