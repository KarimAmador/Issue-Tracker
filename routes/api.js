'use strict';

module.exports = function (app, createModel) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      console.log(project);

      const Project = createModel(project);
      let issues = await Project.find().select({__v: 0}).exec();

      res.json(issues);
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      console.log(project); 
      console.log(req.body);

      const Project = createModel(project);
      let issue = new Project(req.body);
      await issue.save();

      res.json({test:'test'});
    })
    
    .put(function (req, res){
      let project = req.params.project;
      console.log(project);
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      console.log(project);
      
    });
    
};
