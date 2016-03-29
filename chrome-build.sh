vim manifest.json
git add manifest.json
git commit -m "bump chrome extension version"
bower install
cp -r . ../dejaVucopy/
cd ../dejaVucopy
rm -rf .git
rm -rf node_modules
cd ../dejaVu
