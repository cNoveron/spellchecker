FROM debian:latest

# # Update OS
# RUN apk --no-cache add ca-certificates && update-ca-certificates

EXPOSE 31337
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
RUN apt-get install -y make

SHELL ["/bin/bash", "--login", "-c"]
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
# ENV NVM_DIR "$HOME/.nvm"
# RUN export NVM_DIR="$HOME/.nvm" \ 
# && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
# && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
# RUN export NODE_VERSION="lts/fermium"
# ENV NODE_PATH $NVM_DIR/$NODE_VERSION/lib/node_modules
# ENV PATH      $NVM_DIR/$NODE_VERSION/bin:$PATH

RUN nvm install lts/fermium
RUN nvm use lts/fermium

RUN apt-get -y install python3
RUN export PYTHONPATH=$PYTHONPATH:/Python3
RUN export PYTHON=$PYTHON:/usr/bin/python3
RUN export PATH=$PATH:/usr/bin/python3

# RUN apt-get install -y npm
RUN npm install -g node-gyp@latest

WORKDIR /opt/app
COPY . /opt/app
# RUN mv .bash_profile /.bash_profile

SHELL ["/bin/sh"]
RUN . .bash_profile

RUN npm install --no-optional
# RUN npm start