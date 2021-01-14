# quickplay-portal

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
### Build Docker image (development)
```
DOCKER_BUILDKIT=1 docker build --tag quickplaymod/quickplay-portal-build-stage --target=build-stage --build-arg DOCKER_ENV=development --secret id=npmrc,src=.npmrc .
```

### Build Docker image (production)
```
DOCKER_BUILDKIT=1 docker build --tag quickplaymod/quickplay-portal --build-arg DOCKER_ENV=production --secret id=npmrc,src=.npmrc .
```

