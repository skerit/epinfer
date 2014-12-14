var assert = require('assert'),
    Blast  = require('protoblast')(true),
    yaml   = require('js-yaml'),
    fs     = require('fs');

suite('Episodes', function() {

	var episodes,
	    epinfer;

	episodes = yaml.safeLoad(fs.readFileSync('./test/episodes.yaml', 'utf8'));
	epinfer = require('../lib/init.js');

	Object.each(episodes, function eachEp(episode, filename) {
		test(filename, function() {

			var data = epinfer.getData(filename);

			Object.each(episode, function eachProperty(value, property) {

				var a, b;

				// Skip some tests, as some features are not implemented
				switch (property) {

					case 'other':
					case 'options':
						return;
				}

				if (typeof value == 'string') {
					b = value.toLowerCase();
				} else {
					b = value;
				}

				if (typeof data[property] == 'string') {
					a = data[property].toLowerCase();
				} else {
					a = data[property];
				}

				if (Date.isDate(b)) {
					b = b.getFullYear() + '-' + (b.getMonth()+1).toPaddedString(2) + '-' + b.getDate().toPaddedString(2);
				}

				assert.equal(a, b, 'Property "' + property + '" missmatch: ' + JSON.stringify(data[property]) + ' == ' + JSON.stringify(value));
			});
		});
	});
});