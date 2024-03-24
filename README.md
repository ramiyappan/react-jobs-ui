# React Jobs UI
This project involves designing an online Job Portal UI using React JS (Vite build), JSON Server as a mock backend, and Netlify functions.

![Live Website](/public/jobs-UI.png)

Website Live at https://stupendous-meerkat-014f48.netlify.app/

## Usage

If running locally, follow the below commands.

### Install Dependencies 
```
npm install
```

### Run JSON Server
The server will run on http://localhost:8000
```
npm run server
```

### Run Vite Frontend
React will run on http://localhost:5173
```
npm run dev
```

### Build for Production
```
npm run build
```

## Netlify Function - Usage
Refer the [jobs.cjs](/netlify/functions/jobs.cjs) file for the deployed netlify function that handles JSON requests from the React App. 
We use the [JSON Server](#run-json-server) while working locally. However, we can also test & use the netlify function locally, which runs on http://localhost:8888

```
netlify dev
```
After testing, we can deploy the netlify function by using:
```
netlify deploy
```

## Note
The structure of the code was tested locally using a mock JSON Server and then tweaked to run on the netlify website. Therefore, we may need to make some changes in the endpoints of the JSON requests for enabling the React App to fetch jobs data from the JSON file.

This involves changing the endpoints in the [Vite config](/vite.config.js), [Netlify config](/netlify.toml) and the [Netlify function](/netlify/functions/jobs.cjs) to the relevant local host address and port.
