module.exports = function(Blast) {

	/**
	 * The Epinfer Subtype class
	 * Example: movie, episode, ova, ...
	 *
	 * @constructor
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    1.0.0
	 * @version  1.0.0
	 *
	 * @param    {String}   name
	 */
	var EpinferSubtype = Blast.Collection.Function.inherits('Informer', function EpinferSubtype(epinfer, name) {
		this.epinfer = epinfer;
		this.name = name;
		this.properties = {};
		this.propertyList = [];
	});

	/**
	 * Add a container to this filetype
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    1.0.0
	 * @version  1.0.0
	 *
	 * @param    {String}   name
	 * @param    {String}   type   string, number, ...
	 *
	 * @return   {EpinferProperty}
	 */
	EpinferSubtype.setMethod(function addProperty(name, type) {

		if (this.properties[name] == null) {
			this.properties[name] = new Blast.Classes.EpinferProperty(this, name, type);
			this.propertyList.push(this.properties[name]);
		}

		return this.properties[name];
	});

	/**
	 * Require the given property, or one of them if an array is given
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    1.0.0
	 * @version  1.0.0
	 *
	 * @param    {String}   name
	 *
	 * @return   {EpinferProperty}
	 */
	EpinferSubtype.setMethod(function requireProperty(name) {
		name = Blast.Bound.Array.cast(name);
		this.propertyList.push(name);
	});

	/**
	 * Add a string command to the property list
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    1.0.0
	 * @version  1.0.0
	 *
	 * @param    {String}   name
	 *
	 * @return   {EpinferProperty}
	 */
	EpinferSubtype.setMethod(function addCommand(name) {
		this.propertyList.push(name);
	});

	/**
	 * Process the given input
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    1.0.0
	 * @version  1.0.0
	 *
	 * @param    {EpinferResult}   input
	 *
	 * @return   {Object}
	 */
	EpinferSubtype.setMethod(function process(input) {

		var propresult,
		    dellist,
		    result,
		    check,
		    temp,
		    list,
		    prop,
		    key,
		    i,
		    j,
		    k;

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

		for (i = 0; i < this.propertyList.length; i++) {
			prop = this.propertyList[i];

			// Intercept commands
			if (typeof prop == 'string') {

				// Prune: choose the current winner
				if (prop == 'prune') {
					input.parent.prune();
				}
				continue;
			}

			if (Array.isArray(prop)) {
				dellist = [];

				for (j = 0; j < input.parent.list.length; j++) {
					temp = input.parent.list[j];
					check = null;

					for (k = 0; k < prop.length; k++) {
						check = (temp.data[prop[k]] != null);

						// If one of the required properties have been found, break out
						if (check === true) {
							break;
						}
					}

					if (check === false) {
						dellist.push(j);
					}
				}

				Blast.Bound.Array.flashsort(dellist).reverse();

				for (j = 0; j < dellist.length; j++) {
					// Remove the item from the array
					input.parent.list.splice(j, 1);
				}

				continue;
			}

			propresult = prop.process(input);

			for (j = 0; j < propresult.length; j++) {
				temp = propresult[j];

				if (temp.found) {
					input.addPropertyResult(prop, temp);
				}

				// Mark this property as checked
				input.markProperty(prop);
			}
		}
	});
};