const mongoose = require('mongoose');
const Rule = require('../models/ruleModel');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createTestRule = async () => {
  try {
    const testRule = new Rule({
      Rule_subject: 'Test Rule',
      discription: 'This is a test rule to verify the system is working.'
    });

    const savedRule = await testRule.save();
    console.log('Test rule created successfully:', savedRule);
    console.log('Rule ID:', savedRule._id);
  } catch (error) {
    console.error('Error creating test rule:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestRule(); 