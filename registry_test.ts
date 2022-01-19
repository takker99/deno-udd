import { lookup, REGISTRIES } from "./registry.ts";
import { assert, assertEquals, FakeRegistry } from "./test_deps.ts";

const urls = [
  {
    before: "https://fakeregistry.com/foo@0.0.1/mod.ts",
    version: "0.0.1",
    after: "https://fakeregistry.com/foo@0.0.2/mod.ts",
  },
  {
    before: "https://deno.land/std@0.35.0/foo.ts",
    version: "0.35.0",
    after: "https://deno.land/std@0.0.2/foo.ts",
  },
  {
    before: "https://deno.land/x/foo@0.1.0/foo.ts",
    version: "0.1.0",
    after: "https://deno.land/x/foo@0.0.2/foo.ts",
  },
  {
    before: "https://unpkg.com/foo@0.1.0/foo.ts",
    version: "0.1.0",
    after: "https://unpkg.com/foo@0.0.2/foo.ts",
  },
  {
    before: "https://denopkg.com/bar/foo@0.1.0/foo.ts",
    version: "0.1.0",
    after: "https://denopkg.com/bar/foo@0.0.2/foo.ts",
  },
  {
    before: "https://dev.jspm.io/npm:foo@0.1.0/",
    version: "0.1.0",
    after: "https://dev.jspm.io/npm:foo@0.0.2/",
  },
  {
    before: "https://cdn.pika.dev/foo@0.1.0/",
    version: "0.1.0",
    after: "https://cdn.pika.dev/foo@0.0.2/",
  },
  {
    before: "https://cdn.skypack.dev/foo@0.1.0/",
    version: "0.1.0",
    after: "https://cdn.skypack.dev/foo@0.0.2/",
  },
  {
    before: "https://esm.sh/foo@0.1.0/",
    version: "0.1.0",
    after: "https://esm.sh/foo@0.0.2/",
  },
  {
    before: "https://raw.githubusercontent.com/bar/foo/0.1.0/foo.ts",
    version: "0.1.0",
    after: "https://raw.githubusercontent.com/bar/foo/0.0.2/foo.ts",
  },
  {
    before: "https://gitlab.com/bar/foo/-/raw/0.1.0/foo.ts",
    version: "0.1.0",
    after: "https://gitlab.com/bar/foo/-/raw/0.0.2/foo.ts",
  },
  {
    before: "https://cdn.jsdelivr.net/gh/bar/foo@0.1.0/foo.ts",
    version: "0.1.0",
    after: "https://cdn.jsdelivr.net/gh/bar/foo@0.0.2/foo.ts",
  },
  {
    before: "https://x.nest.land/foo@0.1.0/foo.ts",
    version: "0.1.0",
    after: "https://x.nest.land/foo@0.0.2/foo.ts",
  },
];

let i = 0;
for (const registry of [FakeRegistry, ...REGISTRIES]) {
  const { before, version, after } = urls[i++];
  Deno.test(`registry${registry.name}`, () => {
    const v = lookup(before, [FakeRegistry, ...REGISTRIES]);
    assert(v !== undefined);
    assert(v.version() === version);
    const vAt = v!.at("0.0.2");
    assertEquals(vAt.url, after);
  });
}

Deno.test("registryFakeregistryMissing", () => {
  const url = "https://fakeregistry.com/foo@0.0.1/mod.ts";
  const v = lookup(url, REGISTRIES);
  assert(v === undefined);
});
