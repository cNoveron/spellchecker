# Building and running the project

Build and run the containers:
```bash
$ docker build --no-cache -t "cnoveron-backend:Dockerfile" . \
docker run -it -d -p 31337:31337 --name spellcheck-backend-cn cnoveron-backend:Dockerfile
$ cd frontend
$ docker build --no-cache -t "cnoveron-frontend:Dockerfile" . \
docker run -it -d -p 3000:3000 --name spellcheck-frontend-cn cnoveron-frontend:Dockerfile
```

If the Docker builds fail, please run the following commands:
```
nvm use 14
npm install
npm start
cd frontend
npm install
npm start
```

In both cases go to http://localhost:3000/ to see the app running.