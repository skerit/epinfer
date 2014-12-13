module.exports = function(Blast) {

	var A = Blast.Bound.Array,
	    S = Blast.Bound.String;

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
	 * Get filetype info on the given file
	 *
	 * @author   Jelle De Loecker   <jelle@kipdola.be>
	 * @since    0.1.2
	 * @version  0.1.2
	 *
	 * @param    {String}   filename
	 */
	EpinferFiletype.setMethod(function getFiletype(filename) {

		var container,
		    result,
		    score,
		    temp,
		    ext,
		    key;

		result = [];

		for (key in this.containers) {
			container = this.containers[key];

			for (ext in container.extensions) {
				score = container.extensions[ext];

				if (S.endsWith(filename, '.' + ext)) {
					result.push({
						filetype: this.name,
						container: container.title,
						extension: ext,
						quality: container.quality,
						score: score
					});
				}
			}
		}

		return result;
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
	EpinferFiletype.setMethod(function addContainer(title, quality) {

		if (this.containers[title] == null) {
			this.containers[title] = new Blast.Classes.EpinferFilecontainer(this, title, quality)
		}

		return this.containers[title];
	});
};