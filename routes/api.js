'use strict';

module.exports = function (app, getModel) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      let query = req.query;
      let issues;

      if (query) {
        switch (query.open) {
          case 'true':
            query.open = true
            break;
          case 'false':
            query.open = false;
            break;
        }
      }

      try {
        const Project = getModel(project);
        issues = await Project.find(query ? query : undefined).select({__v: 0}).exec();
  
        res.json(issues);
      } catch(err) {
        console.log(err);
        res.send();
      }
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      console.log(req.body);

      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) return res.json({error:'required field(s) missing'});

      const Project = getModel(project);
      
      let issue = new Project(req.body);
      await issue.save();
      issue = await Project.findById(issue._id).select({__v:0}).exec();

      res.json(issue);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
