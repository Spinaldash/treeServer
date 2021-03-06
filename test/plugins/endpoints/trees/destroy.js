/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var Path = require('path');
var Sinon = require('sinon');
var Tree = require('../../../../lib/models/tree');
var CP = require('child_process');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;

var server;

describe('DELETE /trees/{treeId}/destroy', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../../scripts')}, function(){
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  it('should delete and return the tree', function(done){
    server.inject({method: 'DELETE', url: '/trees/ab0000000000000000000001/destroy', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.health).to.equal(100);
      expect(response.result.height).to.equal(1);
      done();
    });
  });

  it('should encounter db error', function(done){
    var stub = Sinon.stub(Tree, 'findOneAndRemove').yields(new Error());
    server.inject({method: 'DELETE', url: '/trees/ab0000000000000000000001/destroy', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
