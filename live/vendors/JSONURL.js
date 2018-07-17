const prefix = window.location.pathname.includes('live') ? '' : 'live/';
const JSONURL = new LZMA(`${prefix}dist/vendor/lzma_worker.js`);
