"use strict";

const ChangeLogCommit = require('./ChangeLogCommit');

class ChangeLogVersion {
  constructor(git, objects, id, previous) {
    this.git = git;
    this.objects = objects;
    this.id = id;
    this.previous = previous;
  }

  padding(num, length) {
        for(var len = (num + "").length; len < length; len = num.length) {
            num = "0" + num;            
        }
        return num;
  }

  tag() {
    if (this.isUnreleased()) return "HEAD";
    return "MoeLife_v" + this.padding(this.id, 3);
  }

  populateObjects() {
    const differences = this.diff();
    console.log("Diff for: " + this.id);
    for (let difference of differences) {
      console.log(difference);
      if (difference[0] == "A")
        this.populateObjectAtPath(difference[1]);
      else if (difference[0].startsWith("R"))
        this.populateObjectAtPath(difference[2]);
    }
  }

  diff() {
    if (!this.previous) return [];
    return this.git.fileChanges(this.previous.tag(), this.tag());
  }

  populateObjectAtPath(path) {
    const parts = path.split("/");
    if (parts[0] == "objects") {
      const object = this.objects[parts[1].split(".")[0]];
      if (object)
        object.version = this.id;
    }
  }

  jsonData() {
    const data = {id: this.id};
    const commits = this.fetchCommits();
    if (this.isReleased() && commits[0]) {
      data.date = commits[0].date;
    }
    data.commits = commits.filter(c => c.isRelavent()).map(c => c.jsonData());
    return data;
  }

  fetchCommits() {
    if (!this.previous) return [];
    if (!this.commits) {
      this.commits = this.git.log(this.previous.tag(), this.tag()).map(entry => {
        return new ChangeLogCommit(this, entry);
      });
    }
    return this.commits;
  }

  isUnreleased() {
    return this.id === "unreleased";
  }

  isReleased() {
    return this.id !== "unreleased";
  }
}

module.exports = ChangeLogVersion;
