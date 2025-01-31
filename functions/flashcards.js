// functions/flashcards.js
const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  let client;
  
  try {
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('flashcards');
    const collection = db.collection('flashcards');

    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    };

    // Handle different routes
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers
      };
    }

    if (event.httpMethod === 'GET') {
      // Get categories
      if (event.path === '/.netlify/functions/flashcards/categories') {
        const categories = await collection.distinct('category');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(categories)
        };
      }
      
      // Get flashcards by category
      if (event.path.startsWith('/.netlify/functions/flashcards/category/')) {
        const category = event.path.split('/category/')[1];
        const flashcards = await collection.find({ category }).toArray();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(flashcards)
        };
      }

      // Get all flashcards
      const flashcards = await collection.find({}).toArray();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(flashcards)
      };
    }

    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
      const result = await collection.insertOne(data);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(result)
      };
    }

    // Add other methods as needed...

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    if (client) await client.close();
  }
};
