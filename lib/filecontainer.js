module.exports = function(Blast) {

	/**
	 * The Epinfer Filecontainer class
	 *
	 * @constructor
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {EpinferFiletype}   filetype
	 * @param    {String}            title
	 */
	var EpinferFilecontainer = Blast.Collection.Function.inherits('Informer', function EpinferFilecontainer(filetype, title, quality) {
		this.title = title;
		this.filetype = filetype;
		this.extensions = {};
		this.quality = quality || 0;
	});

	/**
	 * Set the quality of this container
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {Number}   quality
	 */
	EpinferFilecontainer.setMethod(function setQuality(quality) {
		this.quality = Number(quality) || 0;
		return this;
	});

	/**
	 * Add an extension
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   name
	 * @param    {Number}   score
	 */
	EpinferFilecontainer.setMethod(function addExtension(name, score) {

		var i;

		if (score == null) {
			score = 10;
		}

		name = Blast.Bound.Array.cast(name);

		for (i = 0; i < name.length; i++) {
			this.extensions[name[i]] = score;
		}

		return this;
	});
};