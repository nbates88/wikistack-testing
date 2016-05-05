var chai = require('chai')
var expect = chai.expect;
chai.should();
chai.use(require('chai-things'));

var models = require('../models/');
var Page = models.Page;
var User = models.User;

describe('Page model', function () {

	before(function (done) {
		Page.sync({force: true})
			.then(function () {
				done();
			})
			.catch(done);
	});
  describe('Virtuals', function () {

  	var page;
  	beforeEach(function() {
  		page = Page.build();
  	})

    describe('route', function () {
      it('returns the url_name prepended by "/wiki/"', function() {
      	page.urlTitle = "some_title";
      	expect(page.route).to.be.equal('/wiki/some_title');
      });
    });
    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function(){
      	page.content = "Content __in Markdown__";
      	expect(page.renderedContent).to.be.equal("<p>Content <strong>in Markdown</strong></p>\n")
      });
    });
  });

  describe('Class methods', function () {

  	beforeEach(function (done) {
  		Page.create({
			  title: 'foo',
			  content: 'bar',
			  tags: ['foo', 'bar']
			})
			.then(function () {
			  done();
			})
			.catch(done);
		});

    describe('findByTag', function () {
      it('gets pages with the search tag', function(done){
      	Page.findByTag('bar')
      		.then(function(pages) {
      			expect(pages).to.have.length(1)
      			done();
      		})
      		.catch(done)
      });
      it('does not get pages without the search tag', function(done){
      	Page.findByTag('cheese')
      		.then(function(pages) {
      			expect(pages).to.have.length(0);
      			done();
      		})
      		.catch(done);

      });
    });
  });

  describe('Instance methods', function () {
  	var basePage;
  	var similarPage, thirdPage;
  	beforeEach(function(done) {
  		Page.sync({force:true})
  			.then(function() {
  				return Page.create({
					  title: 'foo1',
					  content: 'bar1',
					  tags: ['foo', 'bar']
					})
  			})
				.then(function (value) {
					basePage = value
					// console.log("basePage is", basePage)
				  return Page.create({
					  title: 'foo2',
					  content: 'bar2',
					  tags: ['foo', 'cheese']
					});
				})
				
				.then(function (value) {
					similarPage = value
				  return Page.create({
					  title: 'foo3',
					  content: 'bar3',
					  tags: ['cat', 'dog']
					});
				})
				.then(function (value) {
					thirdPage = value;
				  done();
				})
				.catch(done);
  	})

    describe('findSimilar', function () {
      it('never gets itself', function(done){
      	basePage.findSimilar()
      		.then(function(pages) {
      			// console.log("this is the never gets itself it", pages)
      			// console.log(basePage)
      			expect(pages).should.not.include(basePage['dataValues']);
      			done();
      		})
      		.catch(function(err){
      			console.log(err)
      		})
      });
      it('gets other pages with any common tags', function(done){
      	basePage.findSimilar()
      		.then(function(pages) {
      			// console.log("this is the never gets itself it", pages)
      			// console.log(basePage)
      			expect(pages).length.to.be(1);
      			done();
      		})
      		.catch(function(err){
      			console.log(err)
      		})

      });
      it('does not get other pages without any common tags', function(done){
      	basePage.findSimilar()
      		.then(function(pages){
      			expect(pages).should.not.include(thirdPage['dataValues']);
      			done();
      		})
      		.catch(function(err){
      			console.log(err)
      		})
      });
    });
  });

  describe('Validations', function () {
  	var incorrectRow, badStatusRow
  	beforeEach(function(done){
  		Page.sync({force: true})
  		.then(function(){
  			incorrectRow = Page.build({
	  			date: "error",
	  		});
  		})
  		.then(function(){
  			badStatusRow = Page.build({
  				title: "hi",
  				content: "stuff",
  				status: 'banana'
  			})
  			done();
  		})
  	});

    it('errors without title', function(done) {
    	incorrectRow.validate()
    		.then(function(err){
    			expect(err).to.exist;
					expect(err.errors).to.exist
					expect(err.errors[0].path).to.equal('title');
					done()
     		})
    });

    it('errors without content', function(done) {
    	incorrectRow.validate()
    		.then(function(err){
    			expect(err).to.exist;
    			// console.log(err)
					expect(err.errors).to.exist
					// console.log(err.errors)
					expect(err.errors[2].path).to.equal('content');
					done()
     		})
    });
    it('errors given an invalid status', function(done) {
    	badStatusRow.save()
    		.then(function(){
    			console.log('success')
     		})
     		.catch(function(err) {
     			// console.log("bad status:", err)
     			expect(err.parent.code).to.equal("22P02");
     			done();
     		})
    });
  });

  describe('Hooks', function () {
  	var newPage;
  	beforeEach(function (done) {
  		Page.create({
			  title: 'foo& bar',
			  content: 'bar',
			})
			.then(function (value) {
				newPage = value
			  done();
			})
			.catch(done);
		});

    it('it sets urlTitle based on title before validating', function(){
    	expect(newPage.urlTitle).to.equal("foo_bar");
    });
  });

});