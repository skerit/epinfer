var epinfer = require('./index.js');
//require('protoblast')(true);

var tests = [
	'Breaking.Bad.(Minisodes).01.Good.Cop.Bad.Cop.WEBRip.XviD.avi',
	'Kaamelott - Livre V - Ep 23 - Le Forfait.avi',
	'the.simpsons.2401.hdtv-lol.mp4',
	'Homeland.S02E01.HDTV.x264-EVOLVE.mp4',
	'the.mentalist.501.hdtv-lol.mp4',
	'new.girl.117.hdtv-lol.mp4',
	'The.Office.(US).1x03.Health.Care.HDTV.XviD-LOL.avi',
	'Doctor.Who.(2005).1x01.Rose.mp4',
	'Californication.2x05.Vaginatown.HDTV.XviD-0TV.avi',
	'Treme.1x03.Right.Place,.Wrong.Time.HDTV.XviD-NoTV.avi',
	'Duckman - S1E13 Joking The Chicken (unedited).avi',
	'Simpsons,.The.12x08.A.Bas.Le.Sergent.Skinner.FR.avi',
	'[™] Futurama - S03E22 - Le chef de fer à 30% ( 30 Percent Iron Chef ).mkv',
	'The Office - S06xE01.avi',
	'Psych.S02E02.65.Million.Years.Off.avi',
	'One.Piece.E576.VOSTFR.720p.HDTV.x264-MARINE-FORD.srt',
	'One.Piece.E576.VOSTFR.720p.HDTV.x264-MARINE-FORD.mkv',
	'Pokémon S16 - E29 - 1280*720 HDTV VF.mkv',
	'Friday Night Lights S01E19 - Ch-Ch-Ch-Ch-Changes.avi',
	'Dexter.5x02.Hello,.Bandit.ENG.-.sub.FR.HDTV.XviD-AlFleNi-TeaM.[tvu.org.ru].avi',
	'The Office [401] Fun Run.avi'
];

//tests = ['Doctor.Who.(2005).1x01.Rose.mp4']

tests.forEach(function(name) {
	var result;

	console.log('\nProcessing "' + name + '":');
	result = epinfer.process(name);
	console.log(result.usedString('_'))
	console.log(result.getData());
});
return
/**
 * Get the string after the wanted property, but before any others
 *
 * @author   Jelle De Loecker   <jelle@kipdola.be>
 * @since    0.1.2
 * @version  0.1.2
 */
EpinferResult.setMethod(function getAfter(propertyname) {

	var newBegin,
	    result = this.source,
	    newEnd = Infinity,
	    ranges = [],
	    curEnd,
	    temp,
	    key,
	    b,
	    e,
	    i;

	console.log('Get after: ' + propertyname);

	if (propertyname == null) {
		return result;
	}

	temp = this.data[propertyname];
	newBegin = temp.begin;
	curEnd = temp.end;

	if (temp) {

		for (key in this.data) {
			if (this.data[key].begin >= temp.end) {
				ranges.push({begin: this.data[key].begin, end: this.data[key].end});
			}
		}

		// Order the found ranges
		A.sortByPath(ranges, 1, 'begin');

		console.log(ranges)

		for (i = 0; i < ranges.length; i++) {
			b = ranges[i].begin;
			e = ranges[i].end;

			// if (this.data[key].begin > temp.end && this.data[key].begin < newEnd) {
			// 	console.log(key + ' begins at ' + this.data[key].begin)
			// 	newEnd = this.data[key].begin;
			// }

			if (curEnd == b) {
				newBegin = b;
				curEnd = e;
			}
		}

		console.log(temp.end + ' > ' + newEnd)

		// If we found a new ending, only return up to that point
		if (isFinite(curEnd)) {
			result = result.slice(newBegin, curEnd);
		} else {
			result = result.slice(newBegin);
		}
	}

	console.log(result)

	return {modIndex: temp.end, result: result};
});