'use strict';


var Tree = require('../../../models/tree');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/trees',
    config: {
      description: 'Create a new tree',
      handler: function(request, reply){
        var tree = new Tree();
        tree.ownerId = request.auth.credentials._id;
        tree.save(function(err){
          console.log('err is: ', err);
          return reply(tree);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'trees.create'
};
