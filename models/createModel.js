const { Schema, model } = require('mongoose');

const projectSchema = new Schema({
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_on: {
    type: String,
    default: () => new Date().toISOString()
  },
  updated_on: {
    type: String,
    default: () => new Date().toISOString()
  },
  created_by: {
    type: String,
    required: true
  },
  assigned_to: String,
  open: {
    type: Boolean,
    required: true,
    default: true
  },
  status_text: String
});

const createModel = (projectName) => {
  return model('project', projectSchema, projectName);
}

module.exports = createModel;
