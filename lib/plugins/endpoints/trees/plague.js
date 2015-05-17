'use strict';


var Tree = require('../../../models/tree');
var Joi = require('joi');
var Async = require('async');

exports.register = function(server, options, next){
  server.route({
    method: 'PUT',
    path: '/trees/plague',
    config: {
      validate: {
        payload: {
          damage: Joi.number().required(),
          name: Joi.string().required()
        }
      },
      description: 'Plague a tree set',
      handler: function(request, reply){
        var max = 50000;
        var daOwnerId = request.auth.credentials._id;
        var plagueObj = request.payload;
        console.log('plagueObj is:', plagueObj);
        Tree.find({ownerId: daOwnerId, height: {$lt: max}}, function(err, trees){
          console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
          console.log('trees:', trees);
          if(err){ return reply().code(400); }

          // modifying the trees
          trees = trees.map(function(tree){
            // damage each tree
            tree.health -= plagueObj.damage;
            // if it is dead kill it
            if(tree.health <= 0){
              tree.health = 0;
              tree.height = 0;
            }
            console.log('tree has been modified by: ', plagueObj.name);
            return tree;
          });

          var cb = function(callbackErr){
            if(callbackErr){
              console.log('An error has occured', callbackErr);
            } else{
              console.log('The plague has successfully swept over the land for ' + plagueObj.damage + ' points of damage');
            }
            return reply(trees).code(callbackErr ? 400 : 200);
          };

          // Save each tree with async
          Async.each(trees, function(oneTree, aSyncCallback){
            oneTree.save(aSyncCallback);
          }, cb);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'trees.plague'
};
