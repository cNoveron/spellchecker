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
RUN wget --no-check-certificate http://www.openssl.org/source/openssl-1.1.0f.tar.gz
RUN tar xzvf openssl-1.1.0f.tar.gz

WORKDIR openssl-1.1.0f
RUN ./config -Wl,--enable-new-dtags,-rpath,'$(LIBRPATH)' \
WORKDIR /opt/app

RUN apt-get install -y curl
RUN apt-get install -y nodejs
# RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash \
  && export NVM_DIR="$HOME/.nvm" \
  && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm \
  && [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

RUN nvm use lts/fermium
RUN apt-get install -y npm
RUN npm install -g node-gyp@latest

COPY . /opt/app

RUN npm install --no-optional