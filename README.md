# Pass The Aux

## Overview
Many of us have had the responsibility of playing music at a party, sometimes the music you choose is not a hit with anyone and just the act of choosing is sapping all of your time. Pass the Aux is an application that allows guests at a party to select the music that they want to hear and allows the host to have a better time at their own party.

Developed using the MERN stack which is a combination of:  
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [React](https://reactjs.org/) + [Redux](https://redux.js.org/)
- [Node](https://nodejs.org/en/)

## Installation

### Dependencies
1. [NodeJS](https://nodejs.org/en/): Pass The Aux uses the default package manager that ships with NodeJS for installing node modules.
2. [MongoDB](https://www.mongodb.com/): Pass The Aux uses a MongoDB database for storing room data.
3. [Spotify](https://developer.spotify.com/): Pass The Aux plays music using the Spotify API and Playback SDK. You will need to set up a Spotify Developer Application (requires a Spotify Premium account) and configure the OAuth redirect URL in order to run the app on your local host. The redirect URL for a development environemnt is usually `http://localhost:3000/` unless you have changed the default port for the application.

### Environment Files
Pass The Aux loads configuration variables from two different locations, one for the client and another for the server. The following paths are relative to the repository root directory:

- `server/.env`: This file includes all of the configuration values for the server side of the application. There is an example file located at `server/.env.example` which looks like this:

  ```js
  MONGO_URI=mongodb://localhost:27017/pass-the-aux

  SPOTIFY_CLIENT_ID=<SPOTIFY_CLIENT_ID_HERE>
  SPOTIFY_CLIENT_SECRET=<SPOTIFY_CLIENT_SECRET_HERE>
  SPOTIFY_REDIRECT_URI=http://localhost:3000/
  ```

- `client/.env`: This file includes all of the configuration values for the client side of the application. There is an example file located at `client/.env.example` which looks like this:

  ```js
  REACT_APP_NAME=Pass The Aux
  SKIP_PREFLIGHT_CHECK=true
  ```

### Building and Serving
The `package.json` file in the repository root directory contains all the commands necessary for building and serving Pass The Aux. The commands can be run by entering `npm run <command name>`, with command name replaced with one of following commands:

- `install`: Installs package dependencies for the root directory, client directory, and server directory.
- `start`: Starts the server application in production mode.
- `client`: Starts the client application.
- `server`: Starts the server application in development mode.
- `dev`: Starts the client and server applications in development mode. When the application is running in development mode both the server and client will automatically recompile and reload the browser when any files are changed.

### Optional: Docker
Alternativly, instead of installing all the dependencies above, you can also use [Docker](https://www.docker.com/) to install and run the application using containers. This will still require you to set up a Spotify Developer Application for authorization but other than that the rest of the installation instructions can be skipped. 

Here is the official description of Docker from their website:
> Docker is a tool designed to make it easier to create, deploy, and run applications by using containers. Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and ship it all out as one package. By doing so, thanks to the container, the developer can rest assured that the application will run on any other Linux machine regardless of any customized settings that machine might have that could differ from the machine used for writing and testing the code.

#### Running the Application
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. In the root directory run `docker-compose up`  
   _Note: This command may take a while to execute on your first time running the application as it has to download and setup the virutal machines. All times after that it should go pretty quickly._

### Extra Notes
During installation on Windows, many command scripts are added. Delete the files browserlist and browserlist.cmd in the client folder. Do not commit everything on Windows operating systems. Only commit the files that you worked on.

## Contributing
1. Fork it!
2. Create your feature branch: git checkout -b feature/my-improvement
3. Make your changes and test them!
4. Commit & push your changes
5. Submit a pull request
