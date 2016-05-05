var chai = require('chai');
var expect = require('chai').expect;
var spies = require('chai-spies');
chai.use(spies);

describe("Exercises", function() {
	// var obj, spy;
 //  beforeEach(function() {
 //    obj = {
 //      foobar: function() {
 //        console.log('foo');
 //        return 'bar';
 //      }
 //    };
 //    spy = chai.spy.on(obj, 'foobar');
 //  });

  it('adds two numbers', function() {
    expect(2 + 2).to.equal(4);
  });

  it('confirms Timeout', function(done) {
    var start = new Date();
    setTimeout(function() {
      var duration = new Date() - start;
      expect(duration).to.be.closeTo(1000, 50);
      done();
    }, 1000);
  });

  it('is a spy', function() {
  	var arr = [1, 2, 3];
  	var callback = function(n) {
  		return n*2;
  	};
  	var spy = chai.spy(callback);
  	arr.forEach(spy);
    expect(spy).to.have.been.called.exactly(arr.length);
    // expect(spy).to.have.been.called.once
  });

  
});
