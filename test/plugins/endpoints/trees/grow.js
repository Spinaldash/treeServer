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

describe('PUT /trees/{treeId}/grow', function(){
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

  it('should grow the tree', function(done){
    server.inject({method: 'PUT', url: '/trees/ab0000000000000000000001/grow', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.health).to.be.within(75, 100);
      expect(response.result.height).to.be.within(1, 50);
      done();
    });
  });

  it('should encounter db error', function(done){
    var stub = Sinon.stub(Tree, 'findOne').yields(new Error());
    server.inject({method: 'PUT', url: '/trees/ab0000000000000000000001/grow', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
// We are about to use Sinon to stub out Math.Random!!
  it('should cause the tree to take 13 damage', function(done){
    var stub = Sinon.stub(Math, 'random');
    stub.onCall(0).returns(0).onCall(1).returns(0.5);
    server.inject({method: 'PUT', url: '/trees/ab0000000000000000000001/grow', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.health).to.be.equal(87);
      expect(response.result.height).to.be.equal(1);
      stub.restore();
      done();
    });
  });

  it('should cause the tree to grow 26 points', function(done){
    var stub = Sinon.stub(Math, 'random');
    stub.onCall(0).returns(1).onCall(1).returns(0.5);
    server.inject({method: 'PUT', url: '/trees/ab0000000000000000000001/grow', credentials: {_id: 'a00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.health).to.be.equal(100);
      expect(response.result.height).to.be.equal(27);
      stub.restore();
      done();
    });
  });
});
