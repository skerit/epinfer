var epinfer = require('./index.js');
//epinfer.debug = true;
var yaml = require('js-yaml');

var tests = [
	'Breaking.Bad.(Minisodes).01.Good.Cop.Bad.Cop.WEBRip.XviD.avi',
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
	'Homeland.S02E01.HDTV.x264-EVOLVE.mp4',
	'The.X-Files.S05E06.Christmas.Carol.720p.HULU.WEBRip.AAC2.0.H.264-NTb.mkv',
	'itv-cosmos1x4-sd.sample.mkv',
	'Gotham.S01E01.Pilot.SWESUB.720p.wbdl.x264.ac3-314r.mkv',
	'Gotham.S01E01.720p.HDTV-D-I-M-E-N-S-I-O-N.nzb',
	'Gotham.S01E01.FASTSUB.VOSTFR.HDTV.XviD-ADDiCTiON.avi',
	'Marvels.Agents.of.S.H.I.E.L.D.S01E01.Pilot.GERMAN.DUBBED.WS.WEBRip.x264-TVP{{Best-of-senet.info}}.nzb',
	'Rizzoli & Isles S01e02[Mux - XviD - Ita Mp3][TntVillage]',
	'Vikings_S03e01-10_[Mux_-_1080p_-_H264_-_Ita_Ac3_Eng_Ac3_5.1_-_So.rar',
	'series/Psych/Psych S02 Season 2 Complete English DVD/Psych.S02E02.65.Million.Years.Off.avi',

	// New tests
	'BBC.Horizon.2014.Whats.Wrong.with.Our.Weather.720p.HDTV.x264.AAC.MVGroup.org.mkv',

	// "CAM" issue
	'montebello.camping.s01e01.720p-barehd.mkv',

	// Movie tests?
	//'Die Hard 1988 1080p BluRay Remux AVC DTS-HD MA 5.1 - KRaLiMaRKo.mkv',
	//'The.Hobbit.The.Desolation.Of.Smaug.2013.1080p.BluRay.DTS.x264-HDMaNiAcS.mkv',
];

tests.forEach(function(name) {

	var result,
	    data,
	    temp,
	    obj,
	    key;

	result = epinfer.process(name);
	data = result.getData();

	console.log('\nProcessing "' + name + '":');
	console.log(result.usedString('_'));
	console.log(result.getData());

	temp = {};

	for (key in data) {
		if (key[0] == '_') {
			continue;
		}

		temp[key] = data[key];
	}

	obj = {};
	obj[name] = temp;

	// Output YAML string
	//console.log(yaml.dump(obj, {sortKeys: true}))
});