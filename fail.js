const tape = require("tape");

tape("a failure", t => {
  t.deepEqual(1, 2, "one is deeply not two");
  t.end();
});

tape("another failure", t => {
  t.equal(1, 2, "one is not two");
  t.end();
});
