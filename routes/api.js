'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      console.log(project);

      res.type('text').send('Test');
    })
    
    .post(function (req, res){
      let project = req.params.project;
      console.log(project); 
      
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
