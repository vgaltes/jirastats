'use strict';

var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');

var data = require('./../data');
var testData;

describe('getNumberOfStories', function() {
    before(function(done){
        fs.readFile('./tests/results.json', 'utf8', function(err, fileContents) {
        if (err) throw err;
        testData = JSON.parse(fileContents);
        done();
        });
    });

  it('Should return 0 stories for an empty data json', function() {
    data.getStoriesFrom({});
    let numberOfStories = data.getNumberOfStories();

    expect(numberOfStories).to.equal(0);
  });

  it('Should return 3 stories from the test data', function(){
    data.getStoriesFrom(testData);
    let numberOfStories = data.getNumberOfStories();

    expect(numberOfStories).to.equal(3);
  });
});

describe('getNumberOfFinishedStories', function() {
    before(function(done){
        fs.readFile('./tests/results.json', 'utf8', function(err, fileContents) {
        if (err) throw err;
        testData = JSON.parse(fileContents);
        done();
        });
    });

  it('Should return 0 finished stories for an empty data json', function() {
    data.getStoriesFrom({});
    let numberOfFinishedStories = data.getNumberOfFinishedStories();

    expect(numberOfFinishedStories).to.equal(0);
  });

  it('Should return 2 finished stories from the test data', function(){
    data.getStoriesFrom(testData);
    let numberOfFinishedStories = data.getNumberOfFinishedStories();

    expect(numberOfFinishedStories).to.equal(2);
  });
});

describe('percentageOfFinishedStories', function() {
    before(function(done){
        fs.readFile('./tests/results.json', 'utf8', function(err, fileContents) {
        if (err) throw err;
        testData = JSON.parse(fileContents);
        done();
        });
    });

  it('Should return 0 percentage of finished stories for an empty data json', function() {
    data.getStoriesFrom({});
    let percentageOfFinishedStories = data.percentageOfFinishedStories();

    expect(percentageOfFinishedStories).to.equal(0);
  });

  it('Should return 66.6 percentage of finished stories from the test data', function(){
    data.getStoriesFrom(testData);
    let percentageOfFinishedStories = data.percentageOfFinishedStories();

    expect(percentageOfFinishedStories).to.equal(66.66666666666667);
  });
});

describe('averageLeadTime', function() {
    before(function(done){
        fs.readFile('./tests/results.json', 'utf8', function(err, fileContents) {
        if (err) throw err;
        testData = JSON.parse(fileContents);
        done();
        });
    });

  it('Should return 0 average lead time for an empty data json', function() {
    data.getStoriesFrom({});
    let averageLeadTime = data.averageLeadTime();

    expect(averageLeadTime).to.equal(0);
  });

  it('Should return 3.5 for the test data', function(){
    data.getStoriesFrom(testData);
    let averageLeadTime = data.averageLeadTime();

    expect(averageLeadTime).to.equal(3.5);
  });
});