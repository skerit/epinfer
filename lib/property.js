var MultiRegexp = require('./multiregexp.js');

module.exports = function(Blast) {

	var S = Blast.Bound.String;

	/**
	 * The Epinfer Property class
	 * Example: movie, episode, ova, ...
	 *
	 * @constructor
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {Epinfer}  epinfer
	 * @param    {String}   name
	 * @param    {String}   type
	 */
	var EpinferProperty = Blast.Collection.Function.inherits('Informer', function EpinferProperty(epinfer, name, type) {
		this.matchers = [];
		this.epinfer = epinfer;
		this.filetypeScores = {};
		this.name = name;
		this.allowedOverlaps = [];

		if (type == null) {
			type = 'string';
		}

		this.type = type;
	});

	/**
	 * Add a regex extractor
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {RegExp}   regex
	 * @param    {Number}   score    The score of this result
	 *
	 * @return   {EpinferMatch}
	 */
	EpinferProperty.setMethod(function addExtract(regex, score) {

		var m;

		m = new EpinferMatch(this, regex, score);
		m.extractor = true;
		this.matchers.push(m);

		return m;
	});

	/**
	 * Add a regex matcher
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {RegExp}   regex
	 * @param    {Number}   score    The score of this result
	 *
	 * @return   {EpinferMatch}
	 */
	EpinferProperty.setMethod(function addMatch(value, regex, score) {

		var m;

		m = new EpinferMatch(this, regex, score);
		m.matcher = true;
		m.matchValue = value;

		m.setRegex(regex);

		this.matchers.push(m);

		return m;
	});

	/**
	 * Set filetype score
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   name
	 * @param    {Number}   score    The score on this filetype
	 *
	 * @return   {EpinferProperty}
	 */
	EpinferProperty.setMethod(function setFiletypeScore(name, score) {
		this.filetypeScores[name] = score;
		return this;
	});

	/**
	 * Allow an overlap with the given property
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   name
	 *
	 * @return   {EpinferProperty}
	 */
	EpinferProperty.setMethod(function allowOverlap(name) {
		this.allowedOverlaps.push(name);
		return this;
	});

	/**
	 * Cast the given value, or return null if not valid
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   str
	 */
	EpinferProperty.setMethod(function castType(str) {

		var result,
		    temp,
		    pc;

		switch (this.type) {

			case 'number':
				result = Number(str);

				if (isNaN(result)) {
					result = null;
				}

				break;

			case 'title':
				result = str.replace(/\.|_/g, ' ').trim();
				result = result.toLowerCase();

				// See if the title is jumbled
				temp = result.split(',');

				if (temp.length == 2) {
					pc = temp[1].trim();

					if (pc.length < 5 && pc.indexOf(' ') == -1) {
						result = pc + ' ' + temp[0];
					}
				}

				result = S.titleize(result);
				break;

			default:
				result = str;
		}

		return result;
	});

	/**
	 * Process the given input and return all possible matches
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {EpinferResult}   input
	 *
	 * @return   {Array}
	 */
	EpinferProperty.setMethod(function process(input) {

		var modIndex = 0,
		    results = [],
		    casted,
		    temp,
		    val,
		    m,
		    i;
		
		for (i = 0; i < this.matchers.length; i++) {
			m = this.matchers[i];

			// If this is a second pass, but this match does not require anything special,
			// it was not meant for a multipass
			if (input.pass > 1 && (!m.requireProperty && !m.positionBeforeProperty && !m.positionAfterProperty)) {
				continue;
			}

			// If this is a multipas and this item has already been found, continue
			if (input.pass > 1 && input.data[this.name]) {
				continue;
			}

			// Make sure required properties are found
			if (m.requireProperty && !input.data[m.requireProperty]) {
				continue;
			}

			// If property values need to match, check it here
			if (m.requireProperty && m.requirePropertyValue != null && input.data[m.requireProperty].result != m.requirePropertyValue) {
				continue;
			}

			if (m.positionBeforeProperty) {
				val = input.getBefore(m.positionBeforeProperty);
			} else if (m.positionAfterProperty) {
				val = input.getAfter(m.positionAfterProperty);

				modIndex = Number(val.modIndex) || 0;
				val = val.result;
			} else {
				val = input.source;
			}

			if (!val) {
				continue;
			}

			temp = m.exec(val, modIndex);

			if (temp.found) {
				//temp.property = this;
				temp.matcher = this.matchers[i];
				results.push(temp);
			}
		}

		return results;
	});

	/**
	 * The Epinfer Match class
	 *
	 * @constructor
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {EpinferProperty}   property
	 * @param    {RegExp}            regex
	 */
	var EpinferMatch = Blast.Collection.Function.inherits('Informer', function EpinferMatch(property, regex, score) {

		var list;

		this.property = property;
		this.epinfer = property.epinfer;
		this.score = score || 10;
		this.quality = 0;

		if (regex) {
			if (typeof regex == 'string') {
				this.regex = Blast.Bound.RegExp.interpret(regex);
			} else {
				this.regex = regex;
			}

			this.regex = new MultiRegexp(this.regex);

			list = [this.regex];

			if (!regex.ignoreCase) {
				list.push(new MultiRegexp(Blast.Bound.RegExp.interpret(Blast.Bound.RegExp.toSource(regex+'i'))));
			}
		}

		this.regexList = list;
		this.index = null;
	});

	/**
	 * Set the regex
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {RegExp}   regex
	 *
	 * @return   {EpinferMatch}
	 */
	EpinferMatch.setMethod(function setRegex(regex) {

		var list;

		if (typeof regex == 'string') {
			regex = Blast.Bound.RegExp.interpret(regex);
		}

		list = [regex];

		if (!regex.ignoreCase) {
			list.push(Blast.Bound.RegExp.interpret(Blast.Bound.RegExp.toSource(regex+'i')));
		}

		this.regexList = list;
		return this;
	});

	/**
	 * Set the score of this match
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {Number}   score    The score of this match
	 *
	 * @return   {EpinferMatch}
	 */
	EpinferMatch.setMethod(function setScore(score) {
		this.score = score;
		return this;
	});

	/**
	 * Set the quality of this value
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {Number}   quality
	 *
	 * @return   {EpinferMatch}
	 */
	EpinferMatch.setMethod(function setQuality(quality) {
		this.quality = Number(quality) || 0;
		return this;
	});

	/**
	 * Make this match require another property
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   propertyname
	 *
	 * @return   {EpinferMatch}
	 */
	EpinferMatch.setMethod(function require(propertyname, value) {
		this.requireProperty = propertyname;
		this.requirePropertyValue = value;
		return this;
	});

	/**
	 * Make this match search in front of another result
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   propertyname
	 *
	 * @return   {EpinferMatch}
	 */
	EpinferMatch.setMethod(function positionBefore(propertyname) {
		this.positionBeforeProperty = propertyname;
		return this;
	});

	/**
	 * Make this match search behind of another result
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   propertyname
	 *
	 * @return   {EpinferMatch}
	 */
	EpinferMatch.setMethod(function positionAfter(propertyname) {
		this.positionAfterProperty = propertyname;
		return this;
	});

	/**
	 * Set the score of this match
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   val
	 *
	 * @return   {Object}
	 */
	EpinferMatch.setMethod(function exec(val, modIndex) {

		var casted,
		    result,
		    temp,
		    ind,
		    r,
		    i;

		result = {
			found: false,
			score: this.score || 0,
			quality: this.quality || 0
		};

		modIndex = Number(modIndex);

		if (!modIndex) {
			modIndex = 0;
		}

		for (i = 0; i < this.regexList.length; i++) {
			r = this.regexList[i];

			// Make sure the lastindex property is reset (should a global regex be used)
			r.lastIndex = 0;

			// Execute the regex
			temp = r.exec(val);

			// If the regex found something
			if (temp) {

				// Each next regex decreases the score
				if (i > 0) {
					result.score -= (i/10);
				}

				break;
			}
		}

		if (temp) {
			result.found = true;

			// Complete match begin & end
			result.begin = modIndex+temp.index;
			result.end = modIndex+temp.index + temp[0].length;

			if (this.matcher) {
				result.groupBegin = result.begin;
				result.groupEnd = result.end;
				result.result = this.matchValue;
				result.extract = temp[0];
			} else {
				if (temp.length > 1) {
					if (this.index) {
						ind = this.index;
					} else {
						ind = 1;
					}

					result.extract = temp[ind];

					// Group begin & end
					if (temp.multigroups[ind-1]) {
						result.groupBegin = modIndex+temp.multigroups[ind-1].index + temp.index;
						result.groupEnd = result.groupBegin + result.extract.length;
					} else {
						result.groupBegin = result.begin;
						result.groupEnd = result.end;
					}
				}

				casted = this.property.castType(result.extract);

				if (casted != null) {
					result.result = casted;
				} else {
					result.found = false;
				}
			}
		}

		return result;
	});

};