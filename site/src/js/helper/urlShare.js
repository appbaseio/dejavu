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
        chrome.storage.local.set({'esurl': decryptedData.url});
        chrome.storage.local.set({'appname': decryptedData.appname});
        var types;
        try {
            types = JSON.stringify(decryptedData.selectedType);
        } catch(e) {
            types = JSON.stringify([]);
        }  
        chrome.storage.local.set({'types': types});
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

// getUrl();