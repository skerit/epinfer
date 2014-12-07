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
{ season: 2,
  episode: 1,
  series: 'Homeland',
  format: 'HDTV',
  video_codec: 'h264' }
*/
```