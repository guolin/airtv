apt-get install gcc make build-essential

echo "-------------------- npm install    --------------------"
npm install

echo "-------------------- bower install  --------------------"
/data/node_modules/bower/bin/bower install --allow-root

echo "--------------------  start server  --------------------"
# export NODE_ENV=prodeuction
/data/node_modules/.bin/grunt server