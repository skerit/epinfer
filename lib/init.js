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

ep.addExtract(/\Wseason\W+\d{1,2}\W+episode\W+(\d{1,2})\W/i, 90); // "season 01 episode 01"
ep.addExtract(/s\d{1,2}e(\d{1,2})/i, 90);   // "s01e01"
ep.addExtract(/s\d{1,2}xe(\d{1,2})/i, 90);  // "S01xE01"
ep.addExtract(/s\d{1,2}\We(\d{1,2})/i, 80);   // "s01 e01"
ep.addExtract(/\W\dx(\d\d)\W/, 50);         // " 1x01 "
ep.addExtract(/\W\d\dx(\d\d)\W/, 50);       // " 01x01 "
ep.addExtract(/\W\dx(\d)\W/, 30);           // " 1x1 "
ep.addExtract(/\W\[\d(\d\d)\]\W/, 10);      // " [101] "
ep.addExtract(/\W\d(\d\d)\W/, 5);           // " 101 "

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

// The series name
var series = episode.addProperty('series', 'title');
var m = series.addExtract(/(.*)/i);

m.require('episode');
m.positionBefore('episode');


module.exports = infer;