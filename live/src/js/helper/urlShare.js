var secret = 'dejvu';
var decryptedData = {};

// Encrypt
function createUrl(inputs) {
    console.log(inputs);
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(inputs), secret).toString();
    window.location.href = '#?input_state=' + ciphertext;
}

// Decrypt
function getUrl() {
    var ciphertext = window.location.href.split('#?input_state=');
    if (ciphertext.length > 1) {
        var bytes = CryptoJS.AES.decrypt(ciphertext[1], secret);
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        window.localStorage.setItem('esurl', decryptedData.url);
        window.localStorage.setItem('appname', decryptedData.appname);
        if (decryptedData.selectedType && decryptedData.selectedType.length) {
            decryptedData.selectedType.forEach(function(type) {
                window.localStorage.setItem(type, true);
            });
        }
    }
}
getUrl();