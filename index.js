#!/usr/bin/env node
'use strict';

const program = require('commander'),
      exec = require('child_process').exec,
      querystring = require('querystring'),
      https = require('https'),
      fs = require("fs"),
      moment = require('moment'),
      data = require('./data');

let performRequest = (host, endpoint, method, reqdata, username, password, success) => {
    
  var dataString = JSON.stringify(reqdata);
  var headers = {
      'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
  };
  
  endpoint += '?' + querystring.stringify(reqdata);

  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(resData) {
      responseString += resData;
    });

    res.on('end', function() {
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}

let getData = (host, username, password, sprint, action) => {
    let sprintQuery = 'Sprint="' + sprint + '"';

    performRequest(host, '/rest/api/2/search', 'GET', {
        "jql": sprintQuery,
        "expand": "changelog",
        "maxResults":1000}, username, password,
        action);
};

let getBasicStatistics = (options) => {
    getData(options.host, options.username, options.password, options.sprint, 
        function(s){
            data.getStoriesFrom(s);

            console.log("Total stories in the sprint: " + data.getNumberOfStories());
            console.log("Total stories finished: " + data.getNumberOfFinishedStories());
            console.log("% stories finished:" + data.percentageOfFinishedStories() + "%");
        }
    );
};

let getLeadTimes = (options) => {
    getData(options.host, options.username, options.password, options.sprint, 
        function(s){
            let stories = data.getStoriesFrom(s);

            console.log("Average lead time: " + data.averageLeadTime() );
        }
    );
};

program
  .version('0.0.1');

program
  .command('basics')
  .description('Get basic statistics of the sprint.')
  .option('-u, --username <required>','username to connect')
  .option('-p, --password <required>','password to use')
  .option('-j, --host <required>','host to use')
  .option('-s, --sprint <required>','sprint to get info from')
  .action(getBasicStatistics);

program
  .command('leadtime')
  .description('Get lead times.')
  .option('-u, --username <username>','username to connect')
  .option('-p, --password <password>','password to use')
  .option('-j, --host <host>','host to use')
  .option('-s, --sprint <sprint>','sprint to get info from')
  .action(getLeadTimes); 

program.parse(process.argv); // notice that we have to parse in a new statement.

// if program was called with no arguments, show help.
if (program.args.length === 0) program.help();