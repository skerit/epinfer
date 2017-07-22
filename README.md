# Epinfer

Extract as much information as possible from a video filename.
Inspired by wackou's `guessit` python module, but in no way as feature complete.

# Installation

```bash
npm install epinfer
```

# Usage

```javascript
var epinfer = require('epinfer'),
    result,
    data;

// Call the process method with a filename as parameter
result = epinfer.process('Good.Behavior.S01E04.Your.Mama.Had.a.Hard.Night.Uncensored.720p.WEB-DL.DD5.1.H264-RTN.mkv');

// Get the regular data as a simple object
data = result.getData();

// An object will be returned
/*
{ _score: 567.1,
  _quality: 390,
  subtype: 'episode',
  container: 'Matroska',
  extension: 'mkv',
  filetype: 'video',
  episode: 4,
  season: 1,
  format: 'WEB-DL',
  screen_size: '720p',
  video_codec: 'h264',
  audio_codec: 'DolbyDigital',
  audio_channels: '5.1',
  release_group: 'RTN',
  uncensored: true,
  series: 'Good Behavior',
  title: 'Your Mama Had A Hard Night' }
*/
```
