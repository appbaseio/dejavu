var secret = 'dejvu';
var decryptedData = {};
var dejavuUrl;
var queryParams;

// Encrypt
function createUrl(inputs, cb) {
    compress(inputs, compressCb.bind(this));
    function compressCb(error, ciphertext) {
        if(!error) {
            dejavuUrl  = ciphertext;
            let finalUrl = '';
            if(window.location.href.indexOf('?default=true') > -1) {
                finalUrl = window.location.href.split('?default=true')[0];
                storageService.set('esurl', inputs.url);
                storageService.set('appname', inputs.appname);
            }
            finalUrl += '#?input_state=' + dejavuUrl;
            if(queryParams && queryParams.hf) {
                finalUrl += '&hf='+queryParams.hf
            }
            mirageLink(function() {});
            window.location.href = finalUrl;
        }
        if(cb) {
            cb(error, ciphertext);
        }
    }
}

// Decrypt
function getUrl(cb) {
    var url = window.location.href.split('#?input_state=');
    queryParams = getQueryParameters();
    if (queryParams && queryParams.input_state) {
        decompress(queryParams.input_state, function(error, data) {
            if(data) {
                applyDecrypt(data);
                cb(decryptedData);
            }
        });    
    }

    function applyDecrypt(decryptedData) {
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
    var ciphertext = dejavuUrl;
    var final_url = '';
    if(type == 'gh-pages') {
        final_url = 'appbaseio.github.io/dejavu/live/#?input_state='+ciphertext;
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
            var final_url = 'https://appbaseio.github.io/mirage/#?input_state='+ciphertext;
            $('.mirage_link').attr('href', final_url);
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

function decompress(compressed, cb) {
    var self = this;
    if(compressed) {
        var compressBuffer = SafeEncode.buffer(compressed);
        JSONURL.decompress(SafeEncode.decode(compressBuffer), function(res, error) {
        var decryptedData = res;
        try {
            if(decryptedData) {
                decryptedData = JSON.parse(decryptedData);
                self.decryptedData = decryptedData;
                cb(null, decryptedData);   
            } else {
                cb('Not found');
            }
          } catch(e) {
            cb(e);
          }
        });
    } else {
        return cb('Empty');
    }
}

function getQueryParameters(str) {
    let hash = window.location.hash.split('#');
    if(hash.length > 1) {
      return (str || hash[1]).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
    } else {
      return null;
    }
  }