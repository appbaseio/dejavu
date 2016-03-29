# don't miss to increment chrome app version
vim manifest.json
git add manifest.json
git commit -m "bump chrome extension version"
git push origin chrome-extension
# install all browser modules
bower install
# clean the slate
rm dejavu-new.zip
mkdir -p dejaVu-unpacked
# create a copy directory
shopt -s extglob # specific to bash
cp -r !(dejaVu-unpacked) dejaVu-unpacked/
cd dejaVu-unpacked
# remove unnecessary stuff
rm -rf .git
rm -rf node_modules
cd ../
# create an archive
zip -rq dejavu-new.zip dejaVu-unpacked
if [ "$1" == "local" ]; then
  echo "unpacked extension ready at: "`pwd`"/dejaVu-unpacked"
else
  rm -rf dejaVu-unpacked
  echo "'dejavu-new.zip' is ready to be published to the chromestore"
fi
