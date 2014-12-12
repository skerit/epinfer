module.exports = function(Blast) {

	/**
	 * The Epinfer filename class
	 *
	 * @constructor
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.0
	 * @version  0.1.2
	 *
	 * @param    {String}   filename
	 */
	var Epinfer = Blast.Collection.Function.inherits('Informer', function Epinfer() {
		this.properties = {};
		this.filetypes = {};
		this.subtypes = {};
		this.debug = false;
	});

	/**
	 * Add a filetype
	 *
	 * @constructor
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   name    video, audio, text, ...
	 *
	 * @return   {EpinferFiletype}
	 */
	Epinfer.setMethod(function addFiletype(name, extensions) {

		if (this.filetypes[name] == null) {
			this.filetypes[name] = new Blast.Classes.EpinferFiletype(this, name);
		}

		return this.filetypes[name];
	});

	/**
	 * Add a subtype
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   name    episode, movie, ova, ...
	 *
	 * @return   {EpinferSubtype}
	 */
	Epinfer.setMethod(function addSubtype(name) {

		if (this.subtypes[name] == null) {
			this.subtypes[name] = new Blast.Classes.EpinferSubtype(this, name);
		}

		return this.subtypes[name];
	});

	/**
	 * Process a string
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   source
	 */
	Epinfer.setMethod(function process(source) {

		var result = new Blast.Classes.EpinferResult(this, source);

		return result.process();
	});
};