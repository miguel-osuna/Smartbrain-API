# Smartbrain-API

## :book: Description

Back-End application for Multiple Face Detection in Smarbrain-App.

### :dart: Features

- REST API created with Node.js and Express.js
- Clarifai API
- PostgreSQL Database

## :bulb: Getting Started

Follow the instructions below to get a copy of the project, whether it's for development or testing purposes.

### :clipboard: Prerequisites

You'll need Git and Node.js (which comes with npm) installed on your computer

```
node@v12.13.0 or higher
npm@6.13.1 or higher
git@2.17.1 or higher
```

### :computer: Installation

```
# Clone this repository
$ git clone https://github.com/miguel-osuna/Smartbrain-API

# Go into the repository from the terminal
$ cd Smartbrain-API

# Remove current origin repository
$ git remote remove origin

# Install project dependencies
$ npm install

# Start and watch the project
$ npm start
```

Generate your [Clarifai API Key](https://portal.clarifai.com/signup?hsLang=en) to chage the project's variables.

Create a .env with te content of .env_sample, replacing your server's url with the value in caps.

```
API_CLARIFAI = YOUR_API_KEY_HERE
DATABASE_URL = YOUR_DATABASE_URL_HERE
PORT = YOUR_PORT_HERE
```

## :rocket: Deployment

Once you are ready to deploy your project, choose your preferred hosting for the API.

Don't forget to replace the .env variables with your hosting environmental variables.

## :wrench: Built With

- [Node.js](https://nodejs.org/) - Run Time Environment for Javascript
- [Express.js](https://expressjs.com) - Back-End Framework for Node.js
- [Knex.js](http://knexjs.org/) - SQL Query Builder
- [Heroku](https://heroku.com/) - Hosting Platform
- [PostgreSQL](https://postgresql.org) - Relational Database

## :performing_arts: Authors

- **Miguel Osuna** - https://github.com/miguel-osuna

## :ledger: License

This project is licensed under the MIT License - see the LICENSE.md file for details.
