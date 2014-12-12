module.exports = function(Blast) {

	var A = Blast.Bound.Array,
	    M = Blast.Bound.Math,
	    S = Blast.Bound.String;

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

		// The real original string
		this.original = source;

		// The source string to use
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

		// Treesize
		this.treesize = 0;

		// Count overlaps
		this.overlaps = 0;

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
		    newEnd,
		    temp,
		    prop,
		    key,
		    i;

		if (propertyname == null) {
			return result;
		}

		temp = this.data[propertyname];

		if (temp) {
			newEnd = temp.begin;

			// Now make sure to get a part before any others
			for (key in this.data) {
				prop = this.data[key];

				// Skip properties beginning after our wanted end position
				if (prop.begin > newEnd) {
					continue;
				}

				if (prop.end == newEnd) {
					newEnd = prop.begin;
				}
			}

			result = result.slice(0, newEnd);
		}

		return result;
	});

	/**
	 * Get the string after the wanted property, but before any others
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 */
	EpinferResult.setMethod(function getAfter(propertyname) {

		var result = this.source,
		    newEnd = Infinity,
		    temp,
		    key,
		    i;

		if (propertyname == null) {
			return result;
		}

		temp = this.data[propertyname];

		if (temp) {

			for (key in this.data) {
				if (this.data[key].begin > temp.end && this.data[key].begin < newEnd) {
					newEnd = this.data[key].begin;
				}
			}

			// If we found a new ending, only return up to that point
			if (isFinite(newEnd)) {
				result = result.slice(temp.end, newEnd);
			} else {
				result = result.slice(temp.end);
			}
		}

		return {modIndex: temp.end, result: result};
	});

	/**
	 * Get the extracted data
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 */
	EpinferResult.setMethod(function getData() {

		var result,
		    key;

		result = {
			_score: this.score,
			_overlaps: this.overlaps,
			_found: this.found,
			_treesize: this.treesize,
			_quality: 0,
			subtype: this.subtypename,
		};

		if (this.filetypeinfo) {
			result.container = this.filetypeinfo.container;
			result.extension = this.filetypeinfo.extension;
			result._quality += Number(this.filetypeinfo.quality) || 0;
		}

		for (key in this.data) {
			result[key] = this.data[key].result;
			result._quality += Number(this.data[key].quality) || 0;
		}

		return result;
	});

	/**
	 * Recalculate the overlaps
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 */
	EpinferResult.setMethod(function calculateOverlaps() {

		var overlaps = 0,
		    list = [],
		    temp,
		    key,
		    i;

		for (key in this.data) {
			for (i in this.data) {
				if (key == i) {
					continue;
				}

				if (Blast.Bound.Math.overlaps(this.data[key].begin, this.data[key].end-1, this.data[i].begin, this.data[i].end-1)) {
					overlaps += 1;
					list.push({names: [key, i], begin: [this.data[key].begin, this.data[i].begin], end: [this.data[key].end, this.data[i].end]});
				}
			}
		}

		this.overlaps = overlaps;
		this.negOverlaps = 0-overlaps;
		this.overlapList = list;

		return overlaps;
	});

	/**
	 * Calculate if the given item would overlap
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {Object}   data
	 *
	 * @return   {Number}   The number of overlaps
	 */
	EpinferResult.setMethod(function countOverlaps(data) {

		var overlaps = 0,
		    temp,
		    key;

		for (key in this.data) {
			temp = this.data[key];

			// Don't count overlaps that are allowed
			if (temp.matcher.property.allowedOverlaps.indexOf(data.matcher.property.name) > -1) {
				continue;
			}

			if (M.overlaps(temp.begin, temp.end-1, data.begin, data.end-1)) {
				overlaps++;
			}
		}

		return overlaps;
	});

	/**
	 * Find the extension
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 */
	EpinferResult.setMethod(function processExtension() {

		var results,
		    type,
		    temp,
		    key;

		results = [];

		for (key in this.epinfer.filetypes) {
			type = this.epinfer.filetypes[key];
			results = results.concat(type.getFiletype(this.source));
		}

		// Sort by score
		A.sortByPath(results, -1, 'score');
		temp = results[0];

		this.filetypeinfo = temp;

		// Remove the extension from the source
		if (temp) {
			this.source = S.beforeLast(this.source, '.'+temp.extension) || this.source;
		}

		// Change " - " to dots
		this.source = this.source.replace(/ - /g, '.');

		console.log('\n' + this.source + '\n')

		return temp;
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
		    result,
		    score,
		    temp,
		    key,
		    i;

		score = -Infinity;

		for (subtypename in this.epinfer.subtypes) {

			wrapper = new EpinferResult(this.epinfer, this.source);
			wrapper.main = false;
			wrapper.root = this;
			wrapper.list = [];
			wrapper.subtypename = subtypename;

			temp = new EpinferResult(this.epinfer, this.source);
			temp.main = false;
			temp.root = this;
			temp.wrapper = false;
			temp.parent = wrapper;
			temp.subtypename = subtypename;

			wrapper.list.push(temp);

			// Do pass 1
			this.epinfer.subtypes[subtypename].process(wrapper);

			if (this.epinfer.debug) {
				console.log('\n-------------------------------------');
				console.log('-------------------------------------');
				console.log('    Pass 2!');
				console.log('-------------------------------------');
				console.log('-------------------------------------\n');
			};

			// Do pass 2
			wrapper.pass = 2;
			this.epinfer.subtypes[subtypename].process(wrapper);

			if (this.epinfer.debug) {
				console.log('\n-------------------------------------');
				console.log('-------------------------------------');
				console.log('    Showing results:');
				console.log('-------------------------------------');
				console.log('-------------------------------------\n');
			}

			//Blast.Bound.Array.sortByPath(wrapper.list, 1, 'score', 'negOverlaps');
			temp = wrapper.prune();

			// Now lets see this subtype result
			if (this.epinfer.debug) {
				console.log('Subtype: ' + subtypename + ' -- Branches: ' + wrapper.list.length);
				for (i = 0; i < wrapper.list.length; i++) {

					console.log('»»»')
					temp = wrapper.list[i];
					console.log('Used bits: ' + temp.usedString('_'));
					console.log('Score: ' + temp.score + ' -- Found properties: ' + temp.found);
					console.log('Overlaps: ' + temp.overlaps);
					console.log(temp.overlapList);

					//console.log(temp.data);

					console.log('Properties:')

					for (key in temp.data) {
						console.log('  [' + key + '] ' + JSON.stringify(temp.data[key].result));
					}

					console.log('«««\n');
				}
			}

			//temp = wrapper.list[wrapper.list.length-1];
			//console.log(wrapper.list.length)

			if (temp == null) {
				return this;
			}

			if (temp.score > score) {
				result = temp;
				score = result.score;
			}
		}

		result.filetypeinfo = this.filetypeinfo;

		return result;
	});

	/**
	 * Prune the list
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 */
	EpinferResult.setMethod(function prune() {

		var result;

		// Sort the entries
		Blast.Bound.Array.sortByPath(this.list, -1, 'score', 'negOverlaps');

		result = this.list[0];

		if (result) {
			result.treesize += this.list.length - 1;
		}

		// Remove everything but the highest
		this.list.splice(1);

		return result;
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
		    score,
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

			// If the matcher required a property,
			// but it is not in the current result,
			// skip it.
			// Later maybe we could decrease the score
			if (result.matcher.requireProperty) {
				if (ori.data[result.matcher.requireProperty] == null) {
					continue;
				}
			}

			if (ori.countOverlaps(result) > 0) {
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

			// Increment the quality of this result
			clone.quality += Number(result.quality) || 0;

			// Set the subtype name
			clone.subtypename = clone.parent.subtypename;

			// Increment the found counter
			clone.found++;

			// Recalculate the overlaps
			clone.calculateOverlaps();

			newlist.push(clone);
		}

		if (this.epinfer.debug) {
			console.log('Adding ' + newlist.length + ' results to ' + this.parent.list.length + ' for property ' + property.name);
		}

		for (i = 0; i < newlist.length; i++) {
			this.parent.list.push(newlist[i]);
		}

	});

};