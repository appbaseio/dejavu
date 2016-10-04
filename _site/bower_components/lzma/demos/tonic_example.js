///
/// Tonic Example
///
/// Try it online here: https://tonicdev.com/npm/lzma
///

var my_lzma = require("lzma");
var compress_me = "Hello, world.";
var compression_level = 1;

/// First, let's compress it.
my_lzma.compress(compress_me, compression_level, function oncompress(compressed_data)
{
    ///NOTE: LZMA-JS returns a regular JavaScript array. You can turn it into a Buffer like so.
    console.log(new Buffer(compressed_data));
    
    /// Now, let's try to decompress it to make sure it works both ways.
    my_lzma.decompress(compressed_data, function ondecompress(uncompressed_data)
    {
        console.log("Uncompress: " + uncompressed_data);
    });
});
