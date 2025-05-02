import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
  Rule_subject: {
    type: String,
    required: true,
    trim: true
  },
  discription: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Rule = mongoose.model('Rule', ruleSchema);

export default Rule; 