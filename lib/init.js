var Blast = require('protoblast')(false),
    Bound = Blast.Bound,
    extensions,
    infer,
    temp;

require('./epinfer.js')(Blast);
require('./filetype.js')(Blast);
require('./filecontainer.js')(Blast);

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
