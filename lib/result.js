module.exports = function(Blast) {

	/**
	 * Result class
	 *
	 * @constructor
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   name
	 */
	var EpinferResult = Blast.Collection.Function.inherits('Informer', function EpinferResult(epinfer, source) {

		// Main epinfer instance
		this.epinfer = epinfer;

		// The original source string
		this.source = source;

		// The process data
		this.data = {};

		// Current subtype
		this.subtype = null;

		// The pass count
		this.pass = 1;

		// The score count
		this.score = 0;

		// Found properties
		this.found = 0;

		// Is this the main result instance
		this.main = true;

		// Is this a wrapper
		this.wrapper = true;

		// The root instance
		this.root = this;

		// The parent
		this.parent = null;
	});

	/**
	 * Get the string with all used bits blanked out
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 */
	EpinferResult.setMethod(function usedString(str) {

		var result = this.source,
		    temp,
		    key,
		    i;

		if (str == null) {
			str = ' ';
		}

		for (key in this.data) {
			temp = this.data[key];

			console.log(temp.begin)

			for (i = temp.begin; i < temp.end; i++) {
				result = result.slice(0,i) + str + result.slice(i+1);
			}
		}

		return result;
	});

	/**
	 * Get the string before the wanted property
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 */
	EpinferResult.setMethod(function getBefore(propertyname) {

		var result = this.source,
		    temp,
		    key,
		    i;

		if (propertyname == null) {
			return result;
		}

		temp = this.data[propertyname];

		if (temp) {
			result = result.slice(0, temp.begin);
		}

		return result;
	});

	/**
	 * Start processing the input
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 */
	EpinferResult.setMethod(function process() {

		var subtypename,
		    wrapper,
		    temp,
		    key,
		    i;

		for (subtypename in this.epinfer.subtypes) {

			wrapper = new EpinferResult(this.epinfer, this.source);
			wrapper.main = false;
			wrapper.root = this;
			wrapper.list = [];

			temp = new EpinferResult(this.epinfer, this.source);
			temp.main = false;
			temp.root = this;
			temp.wrapper = false;
			temp.parent = wrapper;

			wrapper.list.push(temp);

			// Do pass 1
			this.epinfer.subtypes[subtypename].process(wrapper);

			console.log('\n-------------------------------------')
			console.log('-------------------------------------')
			console.log('    Pass 2!');
			console.log('-------------------------------------')
			console.log('-------------------------------------\n')

			// Do pass 2
			wrapper.pass = 2;
			this.epinfer.subtypes[subtypename].process(wrapper);

			console.log('\n-------------------------------------')
			console.log('-------------------------------------')
			console.log('    Showing results:');
			console.log('-------------------------------------')
			console.log('-------------------------------------\n')

			// Now lets see this subtype result
			console.log('Subtype: ' + subtypename + ' -- Branches: ' + wrapper.list.length);
			for (i = 0; i < wrapper.list.length; i++) {
				temp = wrapper.list[i];
				console.log('Score: ' + temp.score + ' -- Found properties: ' + temp.found);
				console.log(temp.data);

				console.log('Properties:')

				for (key in temp.data) {
					console.log('  [' + key + '] ' + JSON.stringify(temp.data[key].result));
				}

				console.log('Used bits: ' + temp.usedString('_'));
			}
		}
	});

	/**
	 * Add a result
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 */
	EpinferResult.setMethod(function addPropertyResult(property, result) {

		var newlist = [],
		    clone,
		    ori,
		    i;

		for (i = 0; i < this.parent.list.length; i++) {

			// Get the original result
			ori = this.parent.list[i];

			// If this element already has this property, skip this
			if (ori.data[property.name]) {
				continue;
			}

			// Let's create a new epinfer result
			clone = Object.create(EpinferResult.prototype);

			// Add the current data, it becomes a clone
			Blast.Bound.Object.assign(clone, ori);

			// Make sure the data object is not a reference
			clone.data = Blast.Bound.Object.assign({}, clone.data);

			// Add the property result
			clone.data[property.name] = result;

			// Increment the score of this result
			clone.score += Number(result.score) || 0;

			// Increment the found counter
			clone.found++;

			newlist.push(clone);
		}

		for (i = 0; i < newlist.length; i++) {
			this.parent.list.push(newlist[i]);
		}

	});

};