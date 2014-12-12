var Blast = require('protoblast')(false),
    Bound = Blast.Bound,
    MultiRegexp,
    extensions,
    infer,
    temp;

MultiRegexp = require('./multiregexp.js');
require('./epinfer.js')(Blast);
require('./filetype.js')(Blast);
require('./filecontainer.js')(Blast);
require('./subtype.js')(Blast);
require('./result.js')(Blast);
require('./property.js')(Blast);

// Create a new epinfer class
infer = new Blast.Classes.Epinfer();

// Add the video filetype
var video = infer.addFiletype('video');

video.addContainer('Real Media File', -50).addExtension('rm');
video.addContainer('3GPP', -40).addExtension(['3g2', '3gp', '3gp2']);
video.addContainer('MPEG Video File', 0).addExtension(['mpg', 'mpeg']);
video.addContainer('MPEG-2 Transport Stream', 10).addExtension('m2ts');
video.addContainer('Video Transport Stream File', 10).addExtension('ts');
video.addContainer('Flash Video', 10).addExtension('flv');
video.addContainer('Advanced Systems Format', 10).addExtension('asf');
video.addContainer('Audio Video Interleave', 20).addExtension('avi');
video.addContainer('DivX Media Format', 20).addExtension('divx');

temp = video.addContainer('QuickTime File Format', 20)
temp.addExtension('mov');
temp.addExtension('qt', 1);

video.addContainer('Ogg Media File', 30).addExtension('ogm');
video.addContainer('Ogg Video File', 30).addExtension('ogv');
video.addContainer('M4V', 30).addExtension('m4v');
video.addContainer('Windows Media Video File', 30).addExtension('wmv');
video.addContainer('MPEG-4 Part 14', 40).addExtension('mp4');
video.addContainer('WebM Video File', 40).addExtension('webm');
video.addContainer('Matroska', 50).addExtension('mkv');

// Add the fileindex filetype
var index = infer.addFiletype('index');

index.addContainer('BitTorrent').addExtension('torrent');
index.addContainer('NewzBin Usenet Index File').addExtension('nzb');

// Add the base info filetype
var info = infer.addFiletype('info');

info.addContainer('Markdown').addExtension('md');
info.addContainer('Plain Text').addExtension('txt');
info.addContainer('Log').addExtension('log');

// Add shortcut filetype
var shortcut = infer.addFiletype('shortcut');

shortcut.addContainer('Desktop Entry File').addExtension('desktop');
shortcut.addContainer('Internet Shortcut').addExtension('url');
shortcut.addContainer('Windows File Shortcut').addExtension('lnk');

var episode = infer.addSubtype('episode');

var ep = episode.addProperty('episode', 'number');

ep.allowOverlap('season');
ep.addExtract(/s\d{1,2}e(\d{1,2})/i, 90);   // "s01e01"
ep.addExtract(/s\d{1,2}xe(\d{1,2})/i, 90);  // "S01xE01"
ep.addExtract(/\Wseason\W+\d{1,2}\W+episode\W+(\d{1,2})\W/i, 80); // "season 01 episode 01"
ep.addExtract(/s\d{1,2}\We(\d{1,2})/i, 80);   // "s01 e01"
ep.addExtract(/\W\dx(\d\d)\W/, 50);         // " 1x01 "
ep.addExtract(/\W\d\dx(\d\d)\W/, 50);       // " 01x01 "
ep.addExtract(/\W\dx(\d)\W/, 30);           // " 1x1 "
ep.addExtract(/\W\[\d(\d\d)\]\W/, 10);      // " [101] "
ep.addExtract(/\W\d\d(\d\d)\W/, 5);          // " 1101 "
ep.addExtract(/\W\d(\d\d)\W/, 5);           // " 101 "

var season = episode.addProperty('season', 'number');

season.allowOverlap('episode');
season.addExtract(/s(\d{1,2})e\d{1,2}/i, 90);   // "s01e01"
season.addExtract(/s(\d{1,2})xe\d{1,2}/i, 90);  // "S01xE01"
season.addExtract(/\Wseason\W+(\d{1,2})\W+episode\W+\d{1,2}\W/i, 80); // "season 01 episode 01"
season.addExtract(/s(\d{1,2})\We\d{1,2}/i, 80);   // "s01 e01"
season.addExtract(/\W(\d)x\d\d\W/, 50);         // " 1x01 "
season.addExtract(/\W(\d\d)x\d\d\W/, 50);       // " 01x01 "
season.addExtract(/\W(\d)x\d\W/, 30);           // " 1x1 "
season.addExtract(/\W\[(\d)\d\d\]\W/, 10);      // " [101] "
season.addExtract(/\W(\d\d)\d\d\W/, 5);          // " 1101 "
season.addExtract(/\W(\d)\d\d\W/, 5);           // " 101 "

episode.requireProperty(['episode', 'season']);

var year = episode.addProperty('series_year', 'number');
var m = year.addExtract(/\x28(\d{4})\x29/, 60); // "(2012)"
m.positionBefore('episode');

var country = episode.addProperty('series_country', 'string');
m = country.addExtract(/\x28([A-Z]+)\x29/, 80); // "(US)"
m.positionBefore('episode');

var format = episode.addProperty('format');

// VHS
format.addMatch('VHS', 'VHS', 50).setQuality(-100);
format.addMatch('VHS', 'VHS-Rip', 60).setQuality(-100);

// Cam
format.addMatch('Cam', 'CAM', 50).setQuality(-90);
format.addMatch('Cam', 'CAMRip', 60).setQuality(-90);
format.addMatch('Cam', 'HD-CAM', 70).setQuality(-90);

// Telesync
format.addMatch('Telesync', 'TS', 30).setQuality(-80);
format.addMatch('Telesync', 'HD-TS', 50).setQuality(-80);
format.addMatch('Telesync', 'PDVD', 60).setQuality(-80);
format.addMatch('Telesync', 'TELESYNC', 70).setQuality(-80);

// Workprint
format.addMatch('Workprint', 'WP', 10).setQuality(-70);
format.addMatch('Workprint', 'WORKPRINT', 70).setQuality(-70);

// Telecine
format.addMatch('Telecine', 'TC', 10).setQuality(-60);
format.addMatch('Telecine', 'TELECINE', 50).setQuality(-60);

// PPV
format.addMatch('PPV', 'PPV', 20).setQuality(-50);

// TV
format.addMatch('TV', 'TV-Rip', 40).setQuality(-30);
format.addMatch('TV', 'Rip-TV', 40).setQuality(-30);
format.addMatch('TV', 'SD-TV', 50).setQuality(-30);
format.addMatch('TV', 'SD-TV-Rip', 60).setQuality(-30);
format.addMatch('TV', 'Rip-SD-TV', 60).setQuality(-30);

// DVB
format.addMatch('DVB', 'DVB', 50).setQuality(-20);
format.addMatch('DVB', 'DVB-Rip', 70).setQuality(-20);
format.addMatch('DVB', 'PDTV', 70).setQuality(-20);

// DVD rips
format.addMatch('DVD', 'DVD', 50);
format.addMatch('DVD', 'DVD-R', 50);
format.addMatch('DVD', 'VIDEO-TS', 50);
format.addMatch('DVD', 'DVD-5', 50);
format.addMatch('DVD', 'DVD-9', 50);
format.addMatch('DVD', 'DVD-Rip', 60);

// HDTV captures
format.addMatch('HDTV', 'HDTV', 70).setQuality(20);
format.addMatch('HDTV', 'HD-TV', 70).setQuality(20);
format.addMatch('HDTV', 'TV-RIP-HD', 80).setQuality(20);
format.addMatch('HDTV', 'HD-TV-RIP', 80).setQuality(20);

// VOD
format.addMatch('VOD', 'VOD', 20).setQuality(40);
format.addMatch('VOD', 'VOD-Rip', 40).setQuality(40);

// WEB
format.addMatch('WEBRip', 'WEB-Rip', 60).setQuality(50);
format.addMatch('WEB-DL', 'WEB-DL', 70).setQuality(60);
format.addMatch('WEB-DL', 'WEB-HD', 70).setQuality(60);
format.addMatch('WEB-DL', 'WEB', 40).setQuality(60);

// HD-DVD
format.addMatch('HD-DVD', 'HD-Rip', 50).setQuality(80);
format.addMatch('HD-DVD', 'HD-DVD', 60).setQuality(80);
format.addMatch('HD-DVD', 'HD-DVD-Rip', 70).setQuality(80);

// BluRay
format.addMatch('BluRay', 'BD[59]', 40).setQuality(100);
format.addMatch('BluRay', 'BD25', 40).setQuality(100);
format.addMatch('BluRay', 'BD50', 40).setQuality(100);
format.addMatch('BluRay', 'B[DR]', 40).setQuality(100);
format.addMatch('BluRay', 'B[DR]-Rip', 50).setQuality(100);
format.addMatch('BluRay', 'Blu-ray', 50).setQuality(100);
format.addMatch('BluRay', 'Blu-ray-Rip', 70).setQuality(100);

// Resolutions
var res = episode.addProperty('screen_size');
res.addMatch('360p', /(?:\d{3,}(?:\\|\/|x|\*))?360(?:i|p?x?)/i, 60).setQuality(-300);
res.addMatch('368p', /(?:\d{3,}(?:\\|\/|x|\*))?368(?:i|p?x?)/i, 60).setQuality(-200);
res.addMatch('480p', /(?:\d{3,}(?:\\|\/|x|\*))?480(?:i|p?x?)/i, 60).setQuality(-100);
res.addMatch('576p', /(?:\d{3,}(?:\\|\/|x|\*))?576(?:i|p?x?)/i, 60).setQuality(0);
res.addMatch('720p', /(?:\d{3,}(?:\\|\/|x|\*))?720(?:i|p?x?)/i, 60).setQuality(100);
res.addMatch('900p', /(?:\d{3,}(?:\\|\/|x|\*))?900(?:i|p?x?)/i, 60).setQuality(130);
res.addMatch('1080i', /(?:\d{3,}(?:\\|\/|x|\*))?1080i/i, 60).setQuality(180);
res.addMatch('1080p', /(?:\d{3,}(?:\\|\/|x|\*))?1080p?x?/i, 60).setQuality(200);
res.addMatch('4K', /(?:\d{3,}(?:\\|\/|x|\*))?2160(?:i|p?x?)/i, 60).setQuality(400);

// Register video codecs
var codec = episode.addProperty('video_codec');
codec.addMatch('Real', /Rv\d{2}/i, 30).setQuality(-50);
codec.addMatch('Mpeg2', 'Mpeg2', 40).setQuality(-30);
codec.addMatch('DivX', 'DivX', 50).setQuality(-10);
codec.addMatch('DivX', 'DVDivX', 60).setQuality(-10);
codec.addMatch('XviD', 'XviD', 50).setQuality(0);
codec.addMatch('h264', /[hx]-?264(?:-AVC)?/i, 60).setQuality(100);
codec.addMatch('h264', /MPEG-?4(?:-AVC)/i, 60).setQuality(100);
codec.addMatch('h265', /[hx]-?265(?:-HEVC)?/i, 60).setQuality(150);
codec.addMatch('h265', 'HEVC', 60).setQuality(150);

// Register video profiles
var profile = episode.addProperty('video_profile');
profile.addMatch('BP', 'BP', 10).setQuality(-20).require('video_codec');
profile.addMatch('XP', 'XP', 10).setQuality(-10).require('video_codec');
profile.addMatch('XP', 'EP', 10).setQuality(-10).require('video_codec');
profile.addMatch('MP', 'MP', 10).setQuality(0).require('video_codec');
profile.addMatch('HP', 'HP', 10).setQuality(10).require('video_codec');
profile.addMatch('HP', 'HiP', 15).setQuality(10).require('video_codec');

profile.addMatch('10bit', /10.?bit/, 10).setQuality(15).require('video_codec');
profile.addMatch('10bit', 'Hi10P', 25).setQuality(15).require('video_codec');
profile.addMatch('8bit', /8.?bit/, 10).setQuality(15);
profile.addMatch('Hi422P', 'Hi422P', 45).setQuality(25).require('video_codec');
profile.addMatch('Hi422P', 'Hi444P', 45).setQuality(25).require('video_codec');

// Register video api
episode.addProperty('video_api').addMatch('DXVA', 'DXVA', 20);

// Register audio codecs
var audio = episode.addProperty('audio_codec');
audio.addMatch('MP3', 'MP3', 10).setQuality(10);
audio.addMatch('MP3', 'LAME', 20).setQuality(10);
audio.addMatch('DolbyDigital', 'DD', 5).setQuality(30);
audio.addMatch('AAC', 'AAC', 25).setQuality(35);
audio.addMatch('AC3', 'AC3', 35).setQuality(40);
audio.addMatch('Flac', 'FLAC', 40).setQuality(45);
audio.addMatch('DTS', 'DTS', 30).setQuality(60);
audio.addMatch('TrueHD', 'TrueHD', 50).setQuality(70);
audio.addMatch('TrueHD', 'True-HD', 50).setQuality(70);

// Register audio profiles
var ap = episode.addProperty('audio_profile');
ap.addMatch('HD', 'HD', 10).setQuality(20).require('audio_codec', 'DTS');
ap.addMatch('HD-MA', 'HDMA', 25).setQuality(50).require('audio_codec', 'DTS');
ap.addMatch('HD-MA', 'HD-MA', 35).setQuality(50).require('audio_codec', 'DTS');
ap.addMatch('HE', 'HE', 10).setQuality(20).require('audio_codec', 'AAC');
ap.addMatch('LC', 'LC', 10).setQuality(0).require('audio_codec', 'AAC');
ap.addMatch('HQ', 'HQ', 10).setQuality(0).require('audio_codec', 'AC3');

// Register audio channels
var ac = episode.addProperty('audio_channels');
ac.addMatch('7.1', /7[\W_]1/, 10).setQuality(60);
ac.addMatch('7.1', '7ch', 25).setQuality(60);
ac.addMatch('7.1', '8ch', 25).setQuality(60);

ac.addMatch('5.1', /5[\W_]1/, 10).setQuality(50);
ac.addMatch('5.1', '5ch', 25).setQuality(50);
ac.addMatch('5.1', '6ch', 25).setQuality(50);

ac.addMatch('2.0', /2[\W_]0/, 10);
ac.addMatch('2.0', 'stereo', 15);
ac.addMatch('2.0', '2ch', 25);

ac.addMatch('1.0', /1[\W_]0/, 10).setQuality(-50);
ac.addMatch('1.0', 'mono', 15).setQuality(-50);
ac.addMatch('1.0', '1ch', 25).setQuality(-50);

// Prune before checking series name & title
episode.addCommand('prune');

// Subtitles
var subtitle = episode.addProperty('subtitle_language');
subtitle.addMatch('French', 'VOSTFR', 90);
subtitle.addExtract(/\Wsub[\W_]([A-Z]{2,})/, 80);

// Language
var language = episode.addProperty('language');
language.addMatch('French', 'FRENCH', 90);
language.addMatch('English', 'ENG', 90);
language.addMatch('French', /\bFR\b/, 50);

var website = episode.addProperty('website');
website.addExtract(/\[((?:[A-Z0-9]{2,}\.?)+\.ru)\]/gi, 70);  // "[bla.bla.ru]"
website.addExtract(/\[((?:[A-Z0-9]{2,}\.?)+\.com)\]/gi, 70); // "[bla.bla.com]"
website.addExtract(/\[((?:[A-Z0-9]{2,}\.?)+\.org)\]/gi, 70); // "[bla.bla.org]"
website.addExtract(/\[((?:[A-Z0-9]{2,}\.?)+\.tv)\]/gi, 70);  // "[bla.bla.tv]"
website.addExtract(/\[((?:[A-Z0-9]{2,}\.?)+)\]/gi, 50);      // "[bla.bla.ru]"

var release_group = episode.addProperty('release_group');

release_group.addExtract(/-([A-Z0-9]+)$/, 80);   // "-EVOLVE" & "-lol"
release_group.addExtract(/-([A-Z0-9]+)\.[a-z]{2,3,4,5}$/, 80);   // "-EVOLVE.ext" & "-lol.ext"
m = release_group.addExtract(/-([A-Z0-9\-]+)/i, 50);   // "-EVOLVE" & "-lol"
m.positionBefore('website');

//\W((?:[A-Za-z0-9]{2,}\.){2,}(?:\w+?)+)

website.addExtract(/-([A-Z0-9]+)$/, 80);   // "-EVOLVE" & "-lol"
website.addExtract(/-([A-Z0-9]+)\.[a-z]{2,3,4,5}$/, 80);   // "-EVOLVE.ext" & "-lol.ext"

// The series name
var series = episode.addProperty('series', 'title');
var m = series.addExtract(/(.*)/i, 10);

m.require('episode');
m.positionBefore('episode');

// Prune before getting the title
episode.addCommand('prune');

// The episode title
var title = episode.addProperty('title', 'title');
m = title.addExtract(/(.*)/i, 5);
m.require('episode');
m.positionAfter('episode');

module.exports = infer;