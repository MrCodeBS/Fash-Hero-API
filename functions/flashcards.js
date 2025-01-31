const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

exports.handler = async (event, context) => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('flashcards');
    
    // Handle different HTTP methods
    switch (event.httpMethod) {
      case 'GET':
        if (event.path.includes('/categories')) {
          const categories = await db.collection('flashcards').distinct('category');
          return {
            statusCode: 200,
            body: JSON.stringify(categories)
          };
        }
        // ... handle other GET cases
        break;
      // ... handle other methods
    }
    
    client.close();
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
