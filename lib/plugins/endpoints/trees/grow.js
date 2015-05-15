'use strict';


var Tree = require('../../../models/tree');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'PUT',
    path: '/trees/{treeId}/grow',
    config: {
      description: 'Create a new tree',
      handler: function(request, reply){
        var daOwnerId = request.auth.credentials._id;
        Tree.findOne({ownerId: daOwnerId, _id: request.params.treeId}, function(err, tree){
          console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
          console.log('tree:', tree);
          if(err){
            console.log(err);
            return reply().code(400);
          }
          // This is twice the max, so the chance to get hurt caps at 50%
          var max = 50000;
          var height = tree.height;
          var odds = height / max;
          var roll = Math.random();
          if(roll < odds){
            // take damage
            tree.health -= Math.floor(Math.random() * 26);
            // if the tree is dead, return a dead tree
            if(tree.health <= 0){
              tree.height = 0;
              tree.health = 0;
            }
          }else{
            // grow the tree
            tree.height += Math.floor(Math.random() * 51);
          }
          tree.save(function(){
            return reply(tree);
          });
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'trees.grow'
};