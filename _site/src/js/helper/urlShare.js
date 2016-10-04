var secret = 'dejvu';
var decryptedData = {};
if(!JSONURL) {
    JSONURL =  new LZMA("../../../dist/vendor/lzma_worker.js");
}
// Encrypt
function createUrl(inputs) {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(inputs), secret).toString();
    window.location.href = '#?input_state=' + ciphertext;
}

// Decrypt
function getUrl() {
    var ciphertext = window.location.href.split('#?input_state=');
    if (ciphertext.length > 1) {
        var bytes = CryptoJS.AES.decrypt(ciphertext[1], secret);
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        window.storageService.setItem('esurl', decryptedData.url);
        window.storageService.setItem('appname', decryptedData.appname);
        var types;
        try {
            types = JSON.stringify(decryptedData.selectedType);
        } catch(e) {
            types = JSON.stringify([]);
        }  
        types = types == null ? [] : types;
        window.storageService.setItem('types', types);
    }
}

// convertToUrl
function convertToUrl(type) {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(input_state), secret).toString();
    var final_url = '';
    if(type == 'gh-pages') {
        final_url = 'appbaseio.github.io/dejaVu/live/#?input_state='+ciphertext;
    }
    else if(type == 'appbaseio') {
        final_url = 'https://appbase.io/scalr/'+input_state.appname+'/browser/#?input_state='+ciphertext;
    }
    else {
        final_url = window.location.protocol + '//' + window.location.host +'#?input_state='+ciphertext;
    }
    return final_url;
}

function mirageLink(cb) {
    var obj = {};
    if(input_state) {
        input_state.selectedType = input_state.selectedType ? input_state.selectedType : [];
        obj = {
            config: {
                url: input_state.url,
                appname: input_state.appname
            },
            selectedTypes: input_state.selectedType
        };
    }
    var data = JSON.stringify(obj);
    compress(obj, compressCb.bind(this));
    function compressCb(error, ciphertext) {
        if(!error) {
            var final_url = 'http://appbaseio.github.io/mirage/#?input_state='+ciphertext;
            return cb(null, final_url);
        } else {
            return cb(error);
        }
    }
}

function compress(jsonInput, cb) {
    if(!jsonInput) {
        return cb('Input should not be empty');
    } else {
    var packed = JSON.stringify(jsonInput);
        JSONURL.compress(packed, 9, function(res, error) {
          try {
            var result = SafeEncode.buffer(res);
            cb(null, SafeEncode.encode(result));   
          } catch(e) {
            cb(e);
          }
        });
    }
}
getUrl();