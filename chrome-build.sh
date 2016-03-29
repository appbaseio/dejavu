vim manifest.json
git add manifest.json
git commit -m "bump chrome extension version"
git push origin chrome-extension
bower install
cp -r . ../dejaVucopy/
cd ../dejaVucopy
rm -rf .git
rm -rf node_modules
cd ../
zip -r dejavu-new.zip dejaVucopy
cd dejaVu
echo "'dejavu-new.zip' is ready to be published to the chromestore"
