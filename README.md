# Epinfer

Extract as much information as possible from a video filename.
Inspired by wackou's `guessit` python module, but in no way as feature complete.

# Installation

```bash
npm install epinfer
```

# Usage

```javascript
var epinfer = require('epinfer');

// Call the process method with a filename as parameter
epinfer.process('Homeland.S02E01.HDTV.x264-EVOLVE.mp4');

// An object will be returned
/*
{ _quality: 160,
  subtype: 'episode',
  container: 'MPEG-4 Part 14',
  extension: 'mp4',
  filetype: 'video',
  episode: 1,
  season: 2,
  format: 'HDTV',
  video_codec: 'h264',
  release_group: 'EVOLVE',
  series: 'Homeland' }
*/
```