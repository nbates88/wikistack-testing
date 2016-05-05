var chai = require('chai');
var expect = chai.expect;
chai.should();
chai.use(require('chai-things'));

var supertest = require('supertest');
var app = require('../app.js');
var agent = supertest.agent(app);

var models = require('../models/');
var Page = models.Page;
var User = models.User;

describe('http requests', function () {
  var testPage;
  var similarPage;

  beforeEach(function(done) {
    Page.sync({force: true})
    .then(function() {
      return Page.create({
        title: "Title",
        content: "Stuff",
        tags: ["hey", "there"]
      })
    })
    .then(function(page){
      testPage = page;
      return Page.create({
          title: "Title2",
        content: "StuffAgain",
        tags: ["hey", "who"]
      })
    })
    .then(function(page){
      similarPage = page
      done();
    })
  })
  
  describe('GET /wiki/', function () {
    it('responds with 200', function(done) {
    	agent
    		.get('/wiki')
    		.expect(200, done);
    });
  });

  describe('GET /wiki/add', function () {
    it('responds with 200', function(done) {
      console.log(agent)
      agent
        .get('/wiki/add')
        .expect(200, done);
    });
  });

  describe('GET /wiki/:urlTitle', function () {
    it('responds with 404 on page that does not exist', function(done) {
        agent
          .get('/wiki/Blah')
          .expect(404, done);
      });

    it('responds with 200 on page that does exist', function(done) {
      agent
        .get('/wiki/Title')
        .expect(200, done);
    });

  });

  describe('GET /wiki/search', function () {
    it('responds with 200', function(done){
      agent
        .get('/wiki/search')
        .expect(200, done);
    });
  });

  describe('GET /wiki/:urlTitle/similar', function () {
    it('responds with 404 for page that does not exist', function(done){
       agent
          .get('/wiki/Blah/similar')
          .expect(404, done);
    });
    it('responds with 200 for similar page', function(done){
        agent
        .get('/wiki/Title2/similar')
        .expect(200, done);
    });
  });

  describe('POST /wiki', function () {
    it('responds with 302', function(){
      agent
      .post('/wiki/jjjj')
      .send({title: 'Title'})
    });
    it('creates a page in the database');
  });

});