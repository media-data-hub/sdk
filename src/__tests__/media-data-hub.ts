import { assert } from "chai";
import Client from "pocketbase";

import { MediaDataHub } from "../media-data-hub.js";

const client = new Client("url");
const mdh = new MediaDataHub("url");

describe("Test MediaDataHub", () => {
  it("should match f() with filter()", async () => {
    const params = {
      test1: "a'b'c'",
      test2: null,
      test3: true,
      test4: false,
      test5: 123,
      test6: -123.45,
      test7: 123.45,
      test8: new Date("2023-10-18 10:11:12"),
      test9: [1, 2, 3, "test'123"],
      test10: { a: "test'123" }
    };

    let raw = "";
    for (const key in params) {
      if (raw) {
        raw += " || ";
      }
      raw += `${key}={:${key}}`;
    }
    const expected = client.filter(raw, params);
    const actual = mdh.f`test1=${params.test1} || test2=${params.test2} || test3=${params.test3} || test4=${params.test4} || test5=${params.test5} || test6=${params.test6} || test7=${params.test7} || test8=${params.test8} || test9=${params.test9} || test10=${params.test10}`;
    assert.equal(actual, expected);
  });
});
