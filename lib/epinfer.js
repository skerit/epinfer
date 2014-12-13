module.exports = function(Blast) {

	/**
	 * The Epinfer filename class
	 *
	 * @constructor
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.0
	 * @version  1.0.0
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
	 * @since    1.0.0
	 * @version  1.0.0
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
	 * @since    1.0.0
	 * @version  1.0.0
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
	 * Process a string and return the EpinferResult object
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    1.0.0
	 * @version  1.0.0
	 *
	 * @param    {String}   source
	 *
	 * @return   {EpinferResult}
	 */
	Epinfer.setMethod(function process(source) {

		var input,
		    result;

		// Create a new basic result object
		input = new Blast.Classes.EpinferResult(this, source);

		// Process the extensions and folders
		input.processExtension();

		// Get the resulting object instance
		result = input.process();

		return result;
	});

	/**
	 * Process a string and return the found properties as an object
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    1.0.0
	 * @version  1.0.0
	 *
	 * @param    {String}   source
	 *
	 * @return   {Object}
	 */
	Epinfer.setMethod(function getData(source) {

		var result = this.process(source);

		if (result) {
			return result.getData()
		}
	});
};