FROM dockerfile/nodejs

WORKDIR /data
RUN apt-get install gcc make build-essential

# Install Mean.JS Prerequisites
RUN npm install -g grunt-cli
RUN npm install -g bower

# Add this to your Dockerfile, after your deps, but before your app code.
ADD package.json /tmp/package.json
ADD .bowerrc /tmp/.bowerrc
ADD bower.json /tmp/bower.json
RUN cd /tmp && npm install
RUN cd /tmp && bower install --config.interactive=false --allow-root -f
RUN cp -a /tmp/node_modules /data/ && mkdir -p /data/public/lib && cp -a /tmp/public/lib /data/public/
