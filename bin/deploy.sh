echo 'start';
# docker start 2ae &&
# cd /home/blog/app/ &&
pm2 stop app &&
git pull &&
yarn install --production=false &&
yarn build && pm2 restart app &&
# git apply migrate.patch;
# yarn compile &&
# yarn m:run &&
# git reset --hard HEAD &&
# docker build -t yyf/node-web-app . &&
# docker kill app &&
# docker rm app &&
# docker run --name app --network=host -p 3000:3000 -d yyf/node-web-app &&
echo 'OK!'

