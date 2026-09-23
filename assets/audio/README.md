Put short beat-preview MP3s here (e.g. snakes-preview.mp3).

Then in `js/main.js`, find the BEATS list and set that beat's `audio` field
to the file's path, for example:

  { title: "Snakes", price: null, audio: "assets/audio/snakes-preview.mp3" }

Once `audio` is filled in, an inline player appears on that beat's card
automatically.
