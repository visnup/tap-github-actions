const tape = require("tape");

tape("a failure", t => {
  t.deepEqual(1, 2, "one is not two");
  t.end();
});
