rm -Rf /tmp/LZMA-JS-TMP && \
mkdir -p /tmp/LZMA-JS-TMP/src && \
mkdir -p /tmp/LZMA-JS-TMP/demos && \
cp -r src/*   /tmp/LZMA-JS-TMP/src/ && \
cp -r demos/* /tmp/LZMA-JS-TMP/demos/ && \
git checkout gh-pages && \
cp -r /tmp/LZMA-JS-TMP/src ./ && \
cp -r /tmp/LZMA-JS-TMP/demos ./ && \
rm -R /tmp/LZMA-JS-TMP/ && \
git add . && \
git commit -m "Syncing gh-pages" && \
git push origin gh-pages && \
git checkout master
