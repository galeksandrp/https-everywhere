var system = require('system');
var webpage = require('webpage');
var page = webpage.create();
var q = system.args[1];
page.open('http://' + system.args[1], function(status) {
	page.includeJs("https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js", function() {
		var title = page.evaluate(function(q) {
			jQuery2 = jQuery.noConflict(true);
			if (!String.prototype.endsWith) {
				Object.defineProperty(String.prototype, 'endsWith', {
					value: function(searchString, position) {
						var subjectString = this.toString();
						if (position === undefined || position > subjectString.length) {
							position = subjectString.length;
						}
						position -= searchString.length;
						var lastIndex = subjectString.indexOf(searchString, position);
						return lastIndex !== -1 && lastIndex === position;
					}
				});
			}
			var mdomains = {};
			var sdomains = {};
			// try {
			jQuery2('a[href*="' + q + '"]').each(function() {
				if (jQuery2(this).attr('href') && jQuery2(this).attr('href').split('/')[2] && jQuery2(this).attr('href').split('/')[2] !== q && jQuery2(this).attr('href').split('/')[2] !== 'www.'+q && jQuery2(this).attr('href').split('/')[2].endsWith('.' + q)) {
					if (jQuery2(this).attr('href').split('/')[2].split(".").length === q.split(".").length + 2) {
						sdomains[jQuery2(this).attr('href').split('/')[2]] = 1;
					}
					else {
						mdomains[jQuery2(this).attr('href').split('/')[2]] = 1;
					}
				}
			});
			jQuery2('img[src*="' + q + '"]').each(function() {
				if (jQuery2(this).attr('href') && jQuery2(this).attr('href').split('/')[2] && jQuery2(this).attr('src').split('/')[2] !== q && jQuery2(this).attr('href').split('/')[2] !== 'www.'+q && jQuery2(this).attr('href').split('/')[2].endsWith('.' + q)) {
					if (jQuery2(this).attr('src').split('/')[2].split(".").length === q.split(".").length + 2) {
						sdomains[jQuery2(this).attr('src').split('/')[2]] = 1;
					}
					else {
						mdomains[jQuery2(this).attr('src').split('/')[2]] = 1;
					}
				}
			});
			jQuery2('link[href*="' + q + '"]').each(function() {
				if (jQuery2(this).attr('href') && jQuery2(this).attr('href').split('/')[2] && jQuery2(this).attr('href').split('/')[2] !== q && jQuery2(this).attr('href').split('/')[2] !== 'www.'+q && jQuery2(this).attr('href').split('/')[2].endsWith('.' + q)) {
					if (jQuery2(this).attr('href').split('/')[2].split(".").length === q.split(".").length + 2) {
						sdomains[jQuery2(this).attr('href').split('/')[2]] = 1;
					}
					else {
						mdomains[jQuery2(this).attr('href').split('/')[2]] = 1;
					}
				}
			});
			// jQuery2('a[href*="'+q+'"]').each(function(){
			// 	if (jQuery2(this).attr('href').split('/')[2] !== q) domains[jQuery2(this).attr('href').split('/')[2]] = 1;
			// });
			// jQuery2('img[src*="'+q+'"]').each(function(){
			// 	if (jQuery2(this).attr('src').split('/')[2] !== q) domains[jQuery2(this).attr('src').split('/')[2]] = 1;
			// });
			// jQuery2('link[href*="'+q+'"]').each(function(){
			// 	if (jQuery2(this).attr('href').split('/')[2] !== q) domains[jQuery2(this).attr('href').split('/')[2]] = 1;
			// });
			// }
			// catch (e) {
			// 	console.error(e);
			// }
			return [mdomains, sdomains];
		}, q);
		var counter = 0;

		function get(domains, second) {
			var prev = Object.keys(domains).length;
			var page2 = webpage.create();
			page2.customHeaders = {
				'Referer': 'https://developers.google.com/apis-explorer/'
			};
			page2.open('https://www.googleapis.com/customsearch/v1?q=site:*.' + (typeof second === 'undefined' ? '' : '*.') +
				q + (typeof second === 'undefined' ? ' -site:www.' + q : '') + ' -site:' + Object.keys(domains).join(' -site:') + '&cx='+system.env.CSE_CX+'&key='+system.env.CSE_KEY+'&fields=items(displayLink)',
				function(status) {
					var jsonSource = page2.plainText;
					var data = JSON.parse(jsonSource);
					if (data.items) {
						data.items.forEach(function(item) {
							if (typeof second === 'undefined') {
								if (item.displayLink.split(".").length !== 4) domains[item.displayLink] = 1;
							}
							else {
								domains[item.displayLink] = 1;
							}
						});
						if (Object.keys(domains).length > prev) {
							if (typeof second === 'undefined') get(domains);
							else get(domains, second);
						}
						else {
							if (counter === 1) {
								console.log('<ruleset name="' + q + ' (partial)">\n\t<target host="' + q + '" />\n\t<target host="www.' + q + '" />\n' +
									'\t<target host="' + Object.keys(title[0]).join('" />\n\t<target host="') + '" />\n' +
									'\t<target host="' + Object.keys(title[1]).join('" />\n\t<target host="') + '" />\n' +
									'\n\t<rule from="^http:" to="https:" />\n</ruleset>');
								phantom.exit();
							}
							else {
								counter++;
							}
						}
					}
					else {
						if (counter === 1) {
							console.log('<ruleset name="' + q + ' (partial)">\n\t<target host="' + q + '" />\n\t<target host="www.' + q + '" />\n' +
								'\t<target host="' + Object.keys(title[0]).join('" />\n\t<target host="') + '" />\n' +
								'\t<target host="' + Object.keys(title[1]).join('" />\n\t<target host="') + '" />\n' +
								'\n\t<rule from="^http:" to="https:" />\n</ruleset>');
							phantom.exit();
						}
						else {
							counter++;
						}
					}
				});
		}
		get(title[0]);
		get(title[1], true);
	});
});
page.onConsoleMessage = function(msg, lineNum, sourceId) {
	system.stderr.writeLine('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};
page.onError = function(msg, trace) {
	system.stderr.writeLine('ERROR: ' + msg);
	trace.forEach(function(item) {
		system.stderr.writeLine('  ', item.file, ':', item.line);
	});
};
