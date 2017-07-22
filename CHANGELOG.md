## 1.1.3 (2017-07-22)

* Add `channel` property (Amazon, Netflix, YouTube Red)
* Add `VP8` and `VP9` video codecs
* Add Dolby Digital Plus audio codec and fix some other matches
* Add `release_type` property (INTERNAL)
* Add `uncensored` and `hdr` flag

## 1.1.2 (2017-07-21)

* Fix catastrophic backtracking in website extraction tests

## 1.1.1 (2017-05-16)

* Fix "cam" being recognized as a CAM release too easily
* Merge pull request by robertklep: fixes "bluray" not being detected
* Also detect website urls not inside brackets

## 1.1.0 (2015-08-17)

* Fix h.264 recognition
* Add the total used characters to the score
* Add new match rules
* Fix languages not always being converted using `country-data`
* Use own tests instead of those from `guessit`

## 1.0.0 (2014-12-14)

* Read out type of file
* Read out quality of file
* Add the individual quality numbers of every property

## 0.1.0 (2014-12-07)

* Add basic code