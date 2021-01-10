rm -rf ./build
rm -rf ./latest_production_build/
NODE_ENV=production npm run build
mv build latest_production_build
git add .
git commit -m "$@"
git push origin master
git push upstream master
npm start
