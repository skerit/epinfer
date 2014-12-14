var epinfer = require('./index.js');

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
	'The Office [401] Fun Run.avi',
	'Series/Californication/Season 2/Californication.2x05.Vaginatown.HDTV.XviD-0TV.avi',
	'Real.Time.With.Bill.Maher.2014.10.31.HDTV.XviD-AFG.avi',
	'[FlexGet] Test 12',
	'[NoobSubs] 06 Sword Art Online II (720p 8bit AAC).mp4',
	'FooBar.7v3.PDTV-FlexGet',
	'FooBar.7.PDTV-FlexGet',
	'Duckman - 101 (01) - 20021107 - I, Duckman.avi',
	'FlexGet.14.of.21.Title.Here.720p.HDTV.AAC5.1.x264-NOGRP',
	'Dexter.5x02.Hello,.Bandit.ENG.-.sub.FR.HDTV.XviD-AlFleNi-TeaM.[tvu.org.ru].avi',
	'Doctor Who (2005) - S06E13 - The Wedding of River Song.mkv',
	'Marvels.Agents.of.S.H.I.E.L.D.S01E06.720p.HDTV.X264-DIMENSION.mkv',
	'Friday Night Lights S01E19 - Ch-Ch-Ch-Ch-Changes.avi',
	'Something.1xAll-FlexGet',
	'Homeland.S02E01.HDTV.x264-EVOLVE.mp4'
];

tests.forEach(function(name) {
	var result;

	console.log('\nProcessing "' + name + '":');
	result = epinfer.process(name);
	console.log(result.usedString('_'))
	console.log(result.getData());
});