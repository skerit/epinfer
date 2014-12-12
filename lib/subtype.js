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
	 * @param    {String}   type   string, number, ...
	 *
	 * @return   {EpinferProperty}
	 */
	EpinferSubtype.setMethod(function addProperty(name, type) {

		if (this.properties[name] == null) {
			this.properties[name] = new Blast.Classes.EpinferProperty(this, name, type);
		}

		return this.properties[name];
	});

	/**
	 * Process the given input
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {EpinferResult}   input
	 *
	 * @return   {Object}
	 */
	EpinferSubtype.setMethod(function process(input) {

		var propresult,
		    result,
		    list,
		    key,
		    i;

		// If this is an input result wrapper, iterate over it
		if (input.wrapper) {
			// Clone the list
			list = input.list.slice(0);

			for (i = 0; i < list.length; i++) {

				// Overwrite the pass number
				list[i].pass = input.pass;
				this.process(list[i]);
			}
			return;
		}

		for (key in this.properties) {
			propresult = this.properties[key].process(input);

			for (i = 0; i < propresult.length; i++) {
				input.addPropertyResult(this.properties[key], propresult[i]);
			}
		}
	});
};