FROM dockerfile/nodejs

WORKDIR /data
# Run npm install -g cnpm --registry=https://registry.npm.taobao.org

RUN npm update
RUN apt-get install gcc make build-essential

# Install Mean.JS Prerequisites
RUN npm install -g grunt-cli
RUN npm install -g bower

# Install Mean.JS packages
ADD package.json /data/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /data/.bowerrc
ADD bower.json /data/bower.json
RUN bower install --config.interactive=false --allow-root -f

# Make everything available for start
ADD . /data

# currently only works for development
ENV NODE_ENV development

# Port 3000 for server
# Port 35729 for livereload
EXPOSE 3000 35729
