FROM dockerfile/nodejs

WORKDIR /data
Run npm install -g cnpm --registry=https://registry.npm.taobao.org

# Install Mean.JS Prerequisites
RUN cnpm install -g grunt-cli
RUN cnpm install -g bower

# Install Mean.JS packages
ADD package.json /home/mean/package.json
RUN cnpm install

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
