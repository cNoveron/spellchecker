FROM debian:latest

# # Update OS
# RUN apk --no-cache add ca-certificates && update-ca-certificates

EXPOSE 3000
# CMD ["node", "src/index.js"]

# Create the working dir
RUN mkdir -p /opt/app && mkdir /cache
WORKDIR /opt/app

# Do not use cache when we change node dependencies in package.json
ADD package.json package-lock.json /cache/

# Install packages + Prepare cache file
RUN apt-get update -yq
RUN apt-get install -y wget

# Install openssl and configure it
WORKDIR /
RUN wget --no-check-certificate http://www.openssl.org/source/openssl-1.1.0f.tar.gz
RUN tar xzvf openssl-1.1.0f.tar.gz
WORKDIR /openssl-1.1.0f
RUN ./config -Wl,--enable-new-dtags,-rpath,'$(LIBRPATH)'

RUN apt-get install -y curl
RUN apt-get install -y nodejs
# RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash \
RUN export NVM_DIR="$HOME/.nvm"
RUN export NODE_VERSION="lts/fermium"
ENV NODE_PATH $NVM_DIR/$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/$NODE_VERSION/bin:$PATH
RUN [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
RUN [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

RUN bash - nvm install lts/fermium
RUN nvm use lts/fermium
RUN apt-get install -y npm
RUN npm install -g node-gyp@latest

COPY . /opt/app

RUN npm install --no-optional
RUN npm start