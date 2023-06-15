#!/usr/bin/env node
const { Parser } = require("tap-parser");
const YAML = require("yaml");
const { issueCommand } = require("@actions/core/lib/command");

const output = process.stdout;

const cwd = new RegExp(process.cwd() + "/", "g");
const regex = /\(?([^\s:]+):(\d+):(\d+)\)?$/;
let suite;
process.stdin.pipe(
  new Parser()
    .on("comment", (comment) => {
      output.write(comment);
      suite = comment.trim();
    })
    .on("assert", ({ ok, name, diag }) => {
      if (ok) return;
      if (!diag || !diag.at || !diag.stack)
        return output.write(JSON.stringify(diag) + "\n");
      diag.at = diag.at.replace(cwd, "");
      diag.stack = diag.stack.replace(cwd, "");
      const message = `${suite} - ${name}\n\n${YAML.stringify(diag)}`;
      const stack = diag.stack.split("\n");
      let match = diag.at.match(regex);
      while (
        !match ||
        (match[1].match(/^(internal|node_modules)\//) && stack.length)
      )
        match = stack.shift().match(regex);
      const [, file, line, col] = match;
      issueCommand("error", { file, line, col }, message);
    })
    .on("complete", ({ ok }) => {
      process.on("exit", (status) => {
        if (status === 1 || !ok) process.exit(1);
      });
    })
);
