docker build -t niftycrawler:v1 .
docker run --mount type=bind,source="$(pwd)",target=/usr/src/app/data niftycrawler:v1