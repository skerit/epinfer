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
	 * @param    {String}   name
	 */
	var EpinferProperty = Blast.Collection.Function.inherits('Informer', function EpinferProperty(epinfer, name) {
		this.matchers = [];
		this.epinfer = epinfer;
		this.filetypeScores = {};
		this.name = name;
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
	EpinferProperty.setMethod(function match(regex, score) {

		var m;

		if (this.containers[title] == null) {
			this.containers[title] = new Blast.Classes.EpinferFilecontainer(this, title)
		}

		m = new EpinferMatch(this, regex, score);
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

		if (typeof regex == 'string') {
			this.regex = Blast.Bound.RegExp.interpret(regex);
		} else {
			this.regex = regex;
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

		if (val == null) {
			val = this.epinfer.source;
		}

		this.regex.lastIndex = 0;

		return this.regex.exec(val);
	});

};