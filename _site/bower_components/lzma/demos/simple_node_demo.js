/// Usage: $ node simple_node_demo.js [text [mode]]

///NOTE: You can install LZMA-JS via npm with this command: $ npm install lzma
///      Then you can load the code with the following code: var my_lzma = require("lzma");
var my_lzma = require("../index.js"),
    compress_me = process.argv[2] || "Hello, world.",
    compression_mode = process.argv[3] || 1;

/// First, let's compress it.
my_lzma.compress(compress_me, compression_mode, function (result) {
    ///NOTE: LZMA-JS returns a regular JavaScript array. You can turn it into a buffer like so.
    console.log("Compressed: ", new Buffer(result));
    /// Now, let's try to decompress it to make sure it works both ways.
    my_lzma.decompress(result, function (result) {
        console.log("Decompressed: " + result);
    }, function (percent) {
        /// Decompressing progress code goes here.
        console.log("Decompressing: " + (percent * 100) + "%");
    });
}, function (percent) {
    /// Compressing progress code goes here.
    console.log("Compressing: " + (percent * 100) + "%");
});
