(NODE_ENV=production BABEL_ENV=server babel src --ignore assets --out-dir tmp &
NODE_ENV=production npm run js) &&
npm run css &&
cp -r src/assets tmp/assets
cp package.json tmp/package.json
cp secrets.sh tmp/secrets.sh

rsync --archive --verbose --exclude-from '.deployignore' tmp/ wundf@wunderundfitzig.de:website
rm -r tmp
