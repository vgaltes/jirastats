'use strict';

var moment = require('moment');

var e = exports;

var stories = [];

const buildStateId = '10104';
const doneStateId = '10000';

var getStoriesFrom = e.getStoriesFrom = function (data) {
    if (data.issues) {
        for (var issue of data.issues) {
            if (issue.fields.issuetype.name === 'Story' ||
                issue.fields.issuetype.name === 'Defect') {

                var storyToAdd = {
                    "key": issue.key,
                    "status": issue.fields.status.id,
                    "transitions": []
                };
                var statusChanges = [];
                for (var history of issue.changelog.histories) {
                    for (var item of history.items) {
                        if (item.field === 'status' && (item.to === buildStateId || item.to === doneStateId)) {
                            statusChanges.push({
                                "date": history.created,
                                "status": item.to
                            });
                        }
                    }
                }

                if (statusChanges.length > 2) {
                    statusChanges.splice(0, statusChanges.length - 2);
                }

                storyToAdd.transitions = statusChanges;
                stories.push(storyToAdd);
            }
        }
    }
    else {
        stories = [];
    }
};

var getNumberOfStories = e.getNumberOfStories = function () {
    return stories.length;
}

function IsDone(story) {
    return story.status === doneStateId;
}

var getNumberOfFinishedStories = e.getNumberOfFinishedStories = function () {
    return stories.filter(IsDone).length;
}

var percentageOfFinishedStories = e.percentageOfFinishedStories = function () {
    let stories = getNumberOfStories();

    if (stories === 0) return 0;

    let storiesFinished = getNumberOfFinishedStories();
    return storiesFinished * 100.0 / stories;
}

function hasBuild(story) {
    function hasBuildState(transition) {
        return transition.status === buildStateId;
    };

    return story.transitions.filter(hasBuildState).length > 0;
}

function getAvg(data) {
    return data.reduce(function (p, c) {
        return p + c;
    }) / data.length;
}

function getBusinessDatesCount(startDate, endDate) {
    var count = 0;
    var curDate = startDate;
    while (curDate <= endDate) {
        var dayOfWeek = curDate.day();
        if(!((dayOfWeek == 6) || (dayOfWeek == 0)))
           count++;
        curDate.date(curDate.date() + 1);
    }
    return count;
}

var averageLeadTime = e.averageLeadTime = function () {
    if (getNumberOfStories() === 0) return 0;

    let storiesFinished = stories.filter(IsDone);
    let storiesStartedAndFinished = storiesFinished.filter(hasBuild);
    let daysToFinish = [];
    for(var story of storiesStartedAndFinished){
        var build = moment(story.transitions[0].date);
        var done = moment(story.transitions[1].date);
        var diff = getBusinessDatesCount(build, done); 
        daysToFinish.push(diff);
    }

    return getAvg(daysToFinish);
}
