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
	});

	/**
	 * Object of all filetypes
	 */
	Epinfer.setStaticProperty('filetypes', {});

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
	 */
	Epinfer.setStatic(function addFiletype(name, extensions) {

		if (this.filetypes[name] == null) {
			this.filetypes[name] = {
				name: name,
				extensions: extensions || {}
			};
		}

		return this.filetypes[name];
	});
};