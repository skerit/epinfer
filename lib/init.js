var Blast = require('protoblast')(false),
    Bound = Blast.Bound,
    extensions;

/**
 * The Epinfer filename class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@kipdola.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   filename
 */
var Epinfer = Blast.Collection.Function.inherits('Informer', function Epinfer() {
	this.properties = {};
});

/**
 * Register a property to extract
 *
 * @author   Jelle De Loecker <jelle@kipdola.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   name          The name of the property
 * @param    {String}   value         The name of the value
 * @param    {Array}    checks        Array of strings/regexps
 * @param    {Array}    hasProp       Only check if this property is present
 */
Epinfer.setMethod(function registerProperty(name, value, checks, quality, hasProp) {

	var hasPropValue,
	    extract;

	if (!this.properties[name]) {
		this.properties[name] = {};
	}

	if (typeof value == 'number') {
		extract = value;
		value = 'extract-' + value;
	} else {
		extract = false;
	}

	checks = Bound.Array.cast(checks);
	hasProp = Bound.Array.cast(hasProp);

	hasPropValue = hasProp[1];
	hasProp = hasProp[0];

	this.properties[name][value] = {
		checks: checks,
		quality: quality || 0,
		hasProp: hasProp,
		hasPropValue: hasPropValue,
		extract: extract,
		value: value
	};
});

/**
 * Process the given filename
 *
 * @author   Jelle De Loecker <jelle@kipdola.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   filename
 */
Epinfer.setMethod(function process(filename) {

	var propname,
	    len,
	    i;

	this.filename = filename;
	this.checked = {};
	this.result = {};
	this.delay = [];

	for (propname in this.properties) {
		this.extractProperty(propname);
	}

	len = this.delay.length;

	// Do the delayed checks
	for (i = 0; i < len; i++) {
		this.extractProperty(this.delay[i]);
	}

	if (this.result.series) {
		this.result.series = this.result.series.replace(/\./g, ' ').trim();
	}

	return this.result;
});

/**
 * Extract the wanted property of the filename in the object
 *
 * @author   Jelle De Loecker <jelle@kipdola.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   name
 */
Epinfer.setMethod(function extractProperty(name) {

	var propvalname,
	    property,
	    filename,
	    propval,
	    found,
	    check,
	    temp,
	    t,
	    i;

	filename = this.filename;
	property = this.properties[name];
	found = false;

	for (propvalname in property) {
		propval = property[propvalname];

		// If this property requires another property, make sure it has run & is present
		if (propval.hasProp) {

			// Required property has been checked
			if (this.checked[propval.hasProp] === true) {

				// It has not been found, so check next value
				if (this.result[propval.hasProp] == null) {
					continue;
				}

				// The expected value has not been found
				if (propval.hasPropValue && this.result[propval.hasProp] != propval.hasPropValue) {
					continue;
				}
			} else {
				// Defer check to later!
				this.delay.push(name);
				return;
			}
		}

		for (i = 0; i < propval.checks.length; i++) {
			check = propval.checks[i];

			if (typeof check == 'string') {
				temp = filename.indexOf(check);

				if (temp > -1) {
					found = true;
					temp = propval.value;
				}
			} else {
				temp = check.exec(filename);

				if (temp) {
					if (propval.extract === false) {
						found = true;
						temp = propval.value;
					} else {
						if (temp[propval.extract]) {
							found = true;
							temp = temp[propval.extract];
						}
					}
				}
			}

			if (found) {
				t = Number(temp);

				if (temp == t) {
					temp = t;
				}

				this.result[name] = temp;
				break;
			}
		}

		if (found) {
			break;
		}
	}

	this.checked[name] = true;
});

/**
 * Video extensions
 *
 * @type   {Array}
 */
extensions = ['3g2', '3gp', '3gp2', 'asf', 'avi', 'divx', 'flv', 'm4v', 'mk2',
              'mka', 'mkv', 'mov', 'mp4', 'mp4a', 'mpeg', 'mpg', 'ogg', 'ogm',
              'ogv', 'qt', 'ra', 'ram', 'rm', 'ts', 'wav', 'webm', 'wma', 'wmv',
              'iso'];

Epinfer.setProperty('extensions', extensions);

var instance = new Epinfer();

// Get the season
instance.registerProperty('season', 2, [
	/(.*)\D(\d{1,2})[ex\-](\d{1,2})/i,
	/(.*)Season.*?(\d{1,2}).*Episode\D*?(\d{1,2})/i,
	/(.*)\D(\d)(\d\d)\D/]);

// Get the episode
instance.registerProperty('episode', 3, [
	/(.*)\D(\d{1,2})[ex\-](\d{1,2})/i,
	/(.*)Season.*?(\d{1,2}).*Episode\D*?(\d{1,2})/i,
	/(.*)\D(\d)(\d\d)\D/]);

// Get the series name
instance.registerProperty('series', 1, [
	/(.*)\D(\d{1,2})[ex\-](\d{1,2})/i,
	/(.*)Season.*?(\d{1,2}).*Episode\D*?(\d{1,2})/i,
	/(.*)\D(\d)(\d\d)\D/]);

// Register all release formats
instance.registerProperty('format', 'VHS', ['VHS', 'VHS-Rip'], -100);
instance.registerProperty('format', 'Cam', ['CAM', 'CAMRip', 'HD-CAM'], -90);
instance.registerProperty('format', 'Telesync', ['TS', 'HD-TS', 'TELESYNC', 'PDVD'], -80);
instance.registerProperty('format', 'Workprint', ['WORKPRINT', 'WP'], -70);
instance.registerProperty('format', 'Telecine', ['TELECINE', 'TC'], -60);
instance.registerProperty('format', 'PPV', ['PPV', 'PPV-Rip'], -50);
instance.registerProperty('format', 'TV', ['SD-TV', 'SD-TV-Rip', 'Rip-SD-TV', 'TV-Rip', 'Rip-TV'], -30);
instance.registerProperty('format', 'DVB', ['DVB-Rip', 'DVB', 'PD-TV'], -20);
instance.registerProperty('format', 'DVD', ['DVD', 'DVD-Rip', 'VIDEO-TS', 'DVD-R', 'DVD-9', 'DVD-5'], 0);
instance.registerProperty('format', 'HDTV', ['HDTV', 'HD-TV', 'TV-RIP-HD', 'HD-TV-RIP'], 20);
instance.registerProperty('format', 'VOD', ['VOD', 'VOD-Rip'], 40);
instance.registerProperty('format', 'WEBRip', ['WEB-Rip'], 50);
instance.registerProperty('format', 'WEB-DL', ['WEB-DL', 'WEB-HD', 'WEB'], 60);
instance.registerProperty('format', 'HD-DVD', ['HD-(?:DVD)?-Rip', 'HD-DVD'], 80);
instance.registerProperty('format', 'BluRay', ['Blu-ray(?:-Rip)?', 'B[DR]', 'B[DR]-Rip', 'BD[59]', 'BD25', 'BD50'], 100);

// Register all resolutions
instance.registerProperty('screen_size', '360p', [/(?:\d{3,}(?:\\|\/|x|\*))?360(?:i|p?x?)/i], -300);
instance.registerProperty('screen_size', '368p', [/(?:\d{3,}(?:\\|\/|x|\*))?368(?:i|p?x?)/i], -200);
instance.registerProperty('screen_size', '480p', [/(?:\d{3,}(?:\\|\/|x|\*))?480(?:i|p?x?)/i], -100);
instance.registerProperty('screen_size', '576p', [/(?:\d{3,}(?:\\|\/|x|\*))?576(?:i|p?x?)/i], 0);
instance.registerProperty('screen_size', '720p', [/(?:\d{3,}(?:\\|\/|x|\*))?720(?:i|p?x?)/i], 100);
instance.registerProperty('screen_size', '900p', [/(?:\d{3,}(?:\\|\/|x|\*))?900(?:i|p?x?)/i], 130);
instance.registerProperty('screen_size', '1080i', [/(?:\d{3,}(?:\\|\/|x|\*))?1080i/i], 180);
instance.registerProperty('screen_size', '1080p', [/(?:\d{3,}(?:\\|\/|x|\*))?1080p?x?/i], 200);
instance.registerProperty('screen_size', '4K', [/(?:\d{3,}(?:\\|\/|x|\*))?2160(?:i|p?x?)/i], 400);

// Register video codecs
instance.registerProperty('video_codec', 'Real', [/Rv\d{2}/i], -50);
instance.registerProperty('video_codec', 'Mpeg2', ['Mpeg2'], -30);
instance.registerProperty('video_codec', 'DivX', ['DVDivX', 'DivX'], -10);
instance.registerProperty('video_codec', 'XviD', ['XviD'], 0);
instance.registerProperty('video_codec', 'h264', [/[hx]-?264(?:-AVC)?/i, /MPEG-?4(?:-AVC)/i], 100);
instance.registerProperty('video_codec', 'h265', [/[hx]-?265(?:-HEVC)?/i, 'HEVC'], 150);

// Register video profiles
instance.registerProperty('video_profile', 'BP', 'BP', -20, 'video_codec');
instance.registerProperty('video_profile', 'XP', ['XP', 'EP'], -10, 'video_codec');
instance.registerProperty('video_profile', 'MP', 'MP', 0, 'video_codec');
instance.registerProperty('video_profile', 'HP', ['HP', 'HiP'], 10, 'video_codec');
instance.registerProperty('video_profile', '10bit', [/10.?bit/, 'Hi10P'], 15);
instance.registerProperty('video_profile', '8bit', [/8.?bit/], 15);
instance.registerProperty('video_profile', 'Hi422P', 'Hi422P', 25, 'video_codec');
instance.registerProperty('video_profile', 'Hi444P', 'Hi444PP', 25, 'video_codec');

instance.registerProperty('video_api', 'DXVA', 'DXVA');

// Register audio codecs
instance.registerProperty('audio_codec', 'MP3', ['MP3', 'LAME', /LAME(?:\d)+-(?:\d)+/], 10);
instance.registerProperty('audio_codec', 'DolbyDigital', ['DD'], 30);
instance.registerProperty('audio_codec', 'AAC', ['AAC'], 35);
instance.registerProperty('audio_codec', 'AC3', ['AC3'], 40);
instance.registerProperty('audio_codec', 'Flac', ['FLAC'], 45);
instance.registerProperty('audio_codec', 'DTS', ['DTS'], 60);
instance.registerProperty('audio_codec', 'TrueHD', ['True-HD'], 70);

// Register audio profiles
instance.registerProperty('audio_profile', 'HD', 'HD', 20, ['audio_codec', 'DTS']);
instance.registerProperty('audio_profile', 'HD-MA', 'HDMA', 50, ['audio_codec', 'DTS']);
instance.registerProperty('audio_profile', 'HE', 'HE', 20, ['audio_codec', 'AAC']);
instance.registerProperty('audio_profile', 'LC', 'LC', 0, ['audio_codec', 'AAC']);
instance.registerProperty('audio_profile', 'HQ', 'HQ', 0, ['audio_codec', 'AC3']);

// Register audio channels
instance.registerProperty('audio_channels', '7.1', [/7[\W_]1/, '7ch', '8ch'], 200);
instance.registerProperty('audio_channels', '5.1', [/5[\W_]1/, '5ch', '6ch'], 100);
instance.registerProperty('audio_channels', '2.0', [/2[\W_]0/, '2ch', 'stereo'], 0);
instance.registerProperty('audio_channels', '1.0', [/1[\W_]0/, '1ch', 'mono'], -100);

module.exports = instance;