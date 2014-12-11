module.exports = function(Blast) {

	/**
	 * The Epinfer Filetype class
	 * Example: video, audio, text, ...
	 *
	 * @constructor
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   name
	 */
	var EpinferFiletype = Blast.Collection.Function.inherits('Informer', function EpinferFiletype(epinfer, name) {
		this.epinfer = epinfer;
		this.name = name;
		this.containers = {};
	});

	/**
	 * Add a container to this filetype
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   title   Matroska, MP3, ...
	 */
	EpinferFiletype.setMethod(function addContainer(title) {

		if (this.containers[title] == null) {
			this.containers[title] = new Blast.Classes.EpinferFilecontainer(this, title)
		}

		return this.containers[title];
	});
};