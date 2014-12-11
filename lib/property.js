var MultiRegexp = require('./multiregexp.js');

module.exports = function(Blast) {

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

		if (typeof regex == 'object') {
			m.regex = regex;
		} else {
			m.regex = Blast.Bound.RegExp.interpret(regex);
		}

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
	 * Cast the given value, or return null if not valid
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   str
	 */
	EpinferProperty.setMethod(function castType(str) {

		var result;

		switch (this.type) {

			case 'number':
				result = Number(str);

				if (isNaN(result)) {
					result = null;
				}

				break;

			case 'title':
				result = str.replace(/\.|_/g, ' ').trim();
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

		var results = [],
		    casted,
		    temp,
		    val,
		    m,
		    i;
		
		for (i = 0; i < this.matchers.length; i++) {
			m = this.matchers[i];

			// If this is a second pass, but this match does not require anything special,
			// it was not meant for a multipass
			if (input.pass > 1 && (!m.requireProperty || !m.positionBeforeProperty)) {
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

			if (m.positionBeforeProperty) {
				val = input.getBefore(m.positionBeforeProperty);
			} else {
				val = input.source;
			}

			if (!val) {
				continue;
			}

			temp = m.exec(val);

			console.log(val);
			//console.log(temp);
			//console.log(m);

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
		}

		this.index = null;
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
	EpinferMatch.setMethod(function require(propertyname) {
		this.requireProperty = propertyname;
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
	EpinferMatch.setMethod(function exec(val) {

		var casted,
		    result,
		    temp,
		    ind;

		result = {
			found: false,
			score: this.score
		};

		this.regex.lastIndex = 0;

		temp = this.regex.exec(val);

		if (temp) {
			result.found = true;

			// Complete match begin & end
			result.begin = temp.index;
			result.end = temp.index + temp[0].length;

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
						result.groupBegin = temp.multigroups[ind-1].index + temp.index;
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