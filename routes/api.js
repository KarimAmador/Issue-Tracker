'use strict';

module.exports = function (app, getModel) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;

      const Project = getModel(project);
      let issues = await Project.find().select({__v: 0}).exec();

      res.json(issues);
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      console.log(req.body);

      const Project = getModel(project);
      let issue = new Project(req.body);
      await issue.save();

      res.json({test:'test'});
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
