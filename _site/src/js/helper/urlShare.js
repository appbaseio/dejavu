var secret = 'dejvu';
var decryptedData = {};

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

function mirageLink() {
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
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), 'e').toString();
    var final_url = 'http://appbaseio.github.io/mirage/#?input_state='+ciphertext;
    return final_url;
}


getUrl();