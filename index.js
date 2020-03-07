#!/usr/bin/env node

const Parser = require("tap-parser");
const YAML = require("yaml");
const {issueCommand, issue} = require("@actions/core/lib/command");

let fail = false;
const regex = /\(([^:]+):(\d+):(\d+)\)$/;
process.stdin.pipe(
  new Parser()
    .once("assert", () => {
      issue("group", "Tap Annotations");
    })
    .on("assert", ({ok, diag}) => {
      if (ok) return;
      const message = YAML.stringify(diag);
      const stack = diag.stack.split("\n");
      let match = diag.at.match(regex);
      while (!match || (match[1].includes("node_modules") && stack.length))
        match = stack.shift().match(regex);
      const [, file, line, col] = match;
      issueCommand("error", {file, line, col}, message);
    })
    .on("complete", () => {
      issue("endgroup");
    })
);

process.on("exit", status => {
  if (status === 1 || fail) process.exit(1);
});
