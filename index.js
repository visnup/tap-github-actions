const Parser = require("tap-parser");
const YAML = require("yaml");
const {issueCommand, issue} = require("@actions/core/lib/command");

process.stdin.pipe(
  new Parser(results => {
    issue("group", "Tap Annotations");
    for (const failure of results.failures) {
      const message = YAML.stringify(failure.diag);
      const [, file, line, col] = failure.diag.at.match(
        /\(([^:]+):(\d+):(\d+)\)$/
      );
      issueCommand("error", {file, line, col}, message);
    }
    issue("endgroup");
  })
);
