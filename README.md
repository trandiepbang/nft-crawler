
# Install steps

- Install NodeJS v12.19.0 via https://nodejs.org/uk/blog/release/v12.19.0/
- Run command "npm install" to install all necessary module for the script
- Run command "node index.js" to start crawler

Then you will see 3 file export in side dictory for OpenSea, NiftyGateway, MakerPlace.

# Edit user
- Edit config.js to add or remove users from the list.

# Note
- Everything you start script it will auto scrap from NifittyGateway, Opeansea, MakerPlace and save it to local .csv file.
- Current for NifityGateway and Opeansea the script will look for csv to check for if ID exist, if ID already exist in CSV the script won't rescape.
- For Makerplace don't have id on the page, so i'm not be able get any identity information for deduplicate purpose, so it will always add into the file even though record may already duplicate.

# Demo
https://www.youtube.com/watch?v=FTpQs9fXEtw


# How To Run with docker
- Run the run.sh script by typing "./run.sh" in terminal
    # Note :
    I'm not sure if Window can excute .sh script, if cannot you just copy paste command below into terminal and execute it.
    ```bash
    docker build -t niftycrawler:v1 .
    docker run --mount type=bind,source="$(pwd)",target=/usr/src/app/data niftycrawler:v1
    ```
