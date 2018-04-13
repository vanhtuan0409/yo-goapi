const Generator = require("yeoman-generator");
const path = require("path");

module.exports = class GoAPIGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.rootUrl = this._getRepoUrl();
    this.appName = "";
  }

  prompting() {
    if (this.rootUrl == "") {
      this.log("YoGoAPI can only generate project within GOPATH");
      return;
    }

    return this.prompt([
      {
        type: "input",
        name: "appName",
        message: "Your project name:",
        validate: function(input) {
          if (!input) return "Project name is required";
          return true;
        }
      }
    ]).then(answer => {
      this.appName = answer.appName;
    });
  }

  writing() {
    if (this.rootUrl == "") return;

    this.fs.copyTpl(
      this.templatePath("_main.go"),
      this.destinationPath(`./${this.appName}/main.go`)
    );
  }

  _getRepoUrl() {
    const destinationPath = process.env.LOCAL_PATH || this.destinationRoot();
    const gopath = process.env.GOPATH;
    const shouldRemovePath = `${gopath}${path.sep}src`;
    let repoUrl = "";
    if (destinationPath.includes(shouldRemovePath)) {
      repoUrl = destinationPath.replace(shouldRemovePath, "");
      repoUrl = repoUrl[0] === path.sep ? repoUrl.substr(1) : repoUrl;
    }
    return repoUrl;
  }
};
