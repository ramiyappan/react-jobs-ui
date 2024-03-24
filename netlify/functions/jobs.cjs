// netlify/functions/jobs/jobs.cjs

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const data = require('../../src/jobs.json')

exports.handler = async (event, context) => {
  //console.log('Event path:', event.path);
  const currentDirectory = process.cwd();
  console.log('Current directory:', currentDirectory);
  try {

    // handle requests based on query string parameters to return a subset of jobs
    if (event.path === '/api/jobs' && event.httpMethod === 'GET') {
      const queryParams = event.queryStringParameters || {};
      const limit = queryParams._limit ? parseInt(queryParams._limit, 10) : undefined;
      
      let filteredData = data.jobs;
      if (limit !== undefined) {
        filteredData = filteredData.slice(0, limit);
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredData),
      };
    }

    // If the path matches '/job/{id}', return the job record with the specified ID
    const pathParts = event.path.split('/');
    if (pathParts.length === 4 && event.httpMethod === 'GET') {
      const jobId = pathParts[3];
      const job = data.jobs.find(job => job.id === jobId);

      if (job) {
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(job),
        };
      } else {
          return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Job not found' }),
          };
      }
    } 
    
    // Handle PUT requests to edit a job
    if (event.httpMethod === 'PUT') {
      const jobId = pathParts[3];
      const requestBody = JSON.parse(event.body);

      const index = data.jobs.findIndex(job => job.id === jobId);

      if (index !== -1) {
        data.jobs[index] = { ...data.jobs[index], ...requestBody };

        const jsonFilePath = path.resolve(__dirname, '/src/jobs.json');
        console.log('resolve path: ', jsonFilePath)
        fs.writeFileSync(jsonFilePath, JSON.stringify(data));

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data.jobs[index]),
        };
      } else {
          return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Job not found' }),
          };
      }
    }

    // Handle POST requests to add a new job
    if (event.httpMethod === 'POST') {
      const requestBody = JSON.parse(event.body);
      const jobId = uuidv4();

      requestBody.id = jobId;
      data.jobs.push(requestBody);

      const jsonFilePath = path.resolve(__dirname, '/src/jobs.json');
      fs.writeFileSync(jsonFilePath, JSON.stringify(data));

      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      };
    }

    // Handle DELETE requests to delete an existing job
    if (event.httpMethod === 'DELETE') {
      const jobIdToDelete = event.path.split('/').pop();
      const indexToDelete = data.jobs.findIndex(job => job.id === jobIdToDelete);

      if (indexToDelete !== -1) {
        const deletedJob = data.jobs.splice(indexToDelete, 1)[0];

        const jsonFilePath = path.resolve(__dirname, '/src/jobs.json');
        fs.writeFileSync(jsonFilePath, JSON.stringify(data));

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(deletedJob),
        };
      } else {
          return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Job not found' }),
          };
      }
    }


    // Return 404 for any other paths
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not found' }),
    };

  } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
      };
  }
};
