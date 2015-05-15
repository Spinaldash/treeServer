'use strict';


var Tree = require('../../../models/tree');

exports.register = function(server, options, next){
  server.route({
    method: 'DELETE',
    path: '/trees/{treeId}/destroy',
    config: {
      description: 'destroy a tree',
      handler: function(request, reply){
        var daOwnerId = request.auth.credentials._id;
        Tree.findOneAndRemove({ownerId: daOwnerId, _id: request.params.treeId}, function(err, tree){
          console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
          console.log('tree to destroy:', tree);
          return reply(tree).code(err ? 400 : 200);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'trees.destroy'
};
