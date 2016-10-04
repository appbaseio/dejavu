LZMA Everywhere
===

<a href="https://github.com/nmrugg/LZMA-JS">LZMA-JS</a> is a JavaScript implementation of the Lempel-Ziv-Markov (LZMA) chain compression algorithm.

[![NPM](https://nodei.co/npm/lzma.png?downloads=true)](https://nodei.co/npm/lzma/)<br>
[![NPM](https://nodei.co/npm-dl/lzma.png?months=6)](https://nodei.co/npm/lzma/)

What's New in 2.x
---
Two things: <b>speed</b> & <b>size</b>.

LZMA-JS 2.x now minifies to smaller than one fourth of 1.x and in some cases is 1,000x faster (particularly with high compression).

It is also more modular. The compression and decompression algorithms can be optionally separated to shrink the file size even more.

Here are some file size stats:

|    Filename    |   Method(s)   | Minified | Gzipped |
|:---------------|:--------------|---------:|--------:|
| lzma_worker.js | both          |  23.4 KB |  9.2 KB |
| lzma-c.js      | compression   |  17.9 KB |  7.3 KB |
| lzma-d.js      | decompression |   6.8 KB |  3.0 KB |

Also, older versions returned compressed data as unsigned bytes. Now, it returns signed bytes.

Demos
---

Live demos can be found <a href="http://nmrugg.github.io/LZMA-JS/">here</a>.


How to Get
---

LZMA-JS is available in the npm repository.

```shell
npm install lzma
```

If you are using bower, you can download the source like this:

```shell
bower install lzma
```

How to Use
---

First, load the bootstrapping code.

```html
<!-- In a browser -->
<script src="../src/lzma.js"></script>
```

Create the LZMA object.

```js
/// LZMA([optional path])
/// If lzma_worker.js is in the same directory, you don't need to set the path.
var my_lzma = new LZMA("../src/lzma_worker.js");
```

(De)Compress stuff asynchronously:

```js
/// To compress:
///NOTE: mode can be 1-9 (1 is fast and pretty good; 9 is slower and probably much better).
///NOTE: compress() can take a string or an array of bytes.
///      (A Node.js Buffer counts as an array of bytes.)
my_lzma.compress(string || byte_array, mode, on_finish(result, error) {}, on_progress(percent) {});

/// To decompress:
///NOTE: The result will be returned as a string if it is printable text;
///      otherwise, it will return an array of signed bytes.
my_lzma.decompress(byte_array, on_finish(result, error) {}, on_progress(percent) {});
```

(De)Compress stuff synchronously (not recommended; may cause the client to freeze):

```js
/// To compress:
///NOTE: You'll need to do your own error catching.
result = my_lzma.compress(string || byte_array, mode);

/// To decompress:
result = my_lzma.decompress(byte_array);
```


Node.js
---

After installing with npm, it can be loaded with the following code:

```js
var my_lzma = require("lzma");
```

Notes
---

The decompress() function needs an array of bytes or a Node.js <code>Buffer</code> object.

If the decompression progress is unable to be calculated, the on_progress() function will be triggered once with the value <code>-1</code>.

LZMA-JS will try to use Web Workers if they are available.  If the environment does not support Web Workers,
it will just do something else, and it won't pollute the global scope.
Each call to LZMA() will create a new Web Worker, which can be accessed via my_lzma.worker().

LZMA-JS was originally based on gwt-lzma, which is a port of the LZMA SDK from Java into JavaScript.

But I don't want to use Web Workers
---

If you'd prefer not to bother with Web Workers, you can just include <code>lzma_worker.js</code> directly. For example:

```html
<script src="../src/lzma_worker.js"></script>
```

That will create a global <code>LZMA</code> <code>object</code> that you can use directly. Like this:

```js
LZMA.compress(string || byte_array, mode, on_finish(result, error) {}, on_progress(percent) {});

LZMA.decompress(byte_array, on_finish(result, error) {}, on_progress(percent) {});
```

Note that this <code>LZMA</code> variable is an <code>object</code>, not a <code>function</code>.

In Node.js, the Web Worker code is already skipped, so there's no need to do this.

And if you only need to compress or decompress and you're looking to save some bytes, instead of loading lzma_worker.js,
you can simply load lzma-c.js (for compression) or lzma-d.js (for decompression).

Of course, you'll want to load the minified versions if you're sending data over the wire.


Compatibility
---

LZMA-JS is compatible with anything that is compatible with the reference implementation of LZMA, for example, the <code>lzma</code> command.


License
---
<a href="https://raw.githubusercontent.com/nmrugg/LZMA-JS/master/LICENSE">MIT</a>
