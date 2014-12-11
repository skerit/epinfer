module.exports = function(Blast) {

	/**
	 * The Epinfer Subtype class
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
	var EpinferSubtype = Blast.Collection.Function.inherits('Informer', function EpinferSubtype(epinfer, name) {
		this.epinfer = epinfer;
		this.name = name;
		this.properties = {};
	});

	/**
	 * Add a container to this filetype
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   name
	 *
	 * @return   {EpinferProperty}
	 */
	EpinferSubtype.setMethod(function addProperty(name) {

		if (this.properties[name] == null) {
			this.properties[name] = new Blast.Classes.EpinferProperty(this, name);
		}

		return this.properties[name];
	});
};