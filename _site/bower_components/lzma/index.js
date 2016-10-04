//! © 2015 Nathan Rugg <nmrugg@gmail.com> | MIT

var lzma;

function load_lzma()
{
    return require(require("path").join(__dirname, "src" ,"lzma_worker.js")).LZMA_WORKER;
}

lzma = load_lzma();

///NOTE: This function is for backwards compatibility's sake.
module.exports.LZMA = function LZMA()
{
    return lzma;
}

module.exports.compress   = lzma.compress;
module.exports.decompress = lzma.decompress;
