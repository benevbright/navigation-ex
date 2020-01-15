import getPathFromState from '../getPathFromState';
import getStateFromPath from '../getStateFromPath';

it('converts state to path string', () => {
  expect(
    getPathFromState({
      routes: [
        {
          name: 'foo',
          state: {
            index: 1,
            routes: [
              { name: 'boo' },
              {
                name: 'bar',
                params: { fruit: 'apple' },
                state: {
                  routes: [
                    {
                      name: 'baz qux',
                      params: { author: 'jane', valid: true },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    })
  ).toMatchInlineSnapshot(`"/foo/bar/baz%20qux?author=jane&valid=true"`);
});

it('converts state to path string with getStateFromPath', () => {
  expect(
    getPathFromState(
      getStateFromPath('/foo/bar/baz%20qux?author=jane&valid=true')
    )
  ).toMatchInlineSnapshot(`"/foo/bar/baz%20qux?author=jane&valid=true"`);
});

it('converts state to path string with config', () => {
  expect(
    getPathFromState(
      {
        routes: [
          {
            name: 'Foo',
            state: {
              index: 1,
              routes: [
                { name: 'boo' },
                {
                  name: 'Bar',
                  params: { fruit: 'apple', type: 'sweet', avaliable: false },
                  state: {
                    routes: [
                      {
                        name: 'Baz',
                        params: { author: 'Jane', valid: true, id: 10 },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      {
        Foo: 'few',
        Bar: 'bar/:type/:fruit',
        Baz: {
          path: 'baz/:author',
          stringify: {
            author: author => author.toLowerCase(),
            id: id => `x${id}`,
          },
        },
      }
    )
  ).toMatchInlineSnapshot(`"/few/bar/sweet/apple/baz/jane?id=x10&valid=true"`);
});

it('converts state to path string with config with getStateFromPath', () => {
  expect(
    getPathFromState(
      getStateFromPath('/few/bar/sweet/apple/baz/jane?id=x10&valid=true', {
        Foo: 'few',
        Bar: 'bar/:type/:fruit',
        Baz: {
          path: 'baz/:author',
          parse: {
            author: (author: string) =>
              author.replace(/^\w/, c => c.toUpperCase()),
            count: Number,
            valid: Boolean,
          },
        },
      }),
      {
        Foo: 'few',
        Bar: 'bar/:type/:fruit',
        Baz: {
          path: 'baz/:author',
          stringify: {
            author: author => author.toLowerCase(),
          },
        },
      }
    )
  ).toMatchInlineSnapshot(`"/few/bar/sweet/apple/baz/jane?id=x10&valid=true"`);
});

it('handles route without param', () => {
  expect(
    getPathFromState({
      routes: [
        {
          name: 'foo',
          state: {
            routes: [{ name: 'bar' }],
          },
        },
      ],
    })
  ).toBe('/foo/bar');
});

it('handles route without param with getStateFromPath', () => {
  expect(getPathFromState(getStateFromPath('/foo/bar'))).toMatchInlineSnapshot(
    `"/foo/bar"`
  );
});

it('handles state with config with nested screens', () => {
  expect(
    getPathFromState(
      {
        routes: [
          {
            name: 'Foo',
            state: {
              routes: [
                {
                  name: 'Foe',
                  state: {
                    routes: [
                      {
                        name: 'Bar',
                        params: { fruit: 'apple', type: 'sweet' },
                        state: {
                          routes: [
                            {
                              name: 'Baz',
                              params: {
                                author: 'Jane',
                                count: '10',
                                answer: '42',
                                valid: true,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      {
        Foo: {
          Foe: 'few',
        },
        Baz: {
          path: 'baz/:author',
          stringify: {
            author: author => author.toLowerCase(),
            id: id => `x${id}`,
            unknown: _ => 'x',
            count: value => `${value}0`,
          },
        },
        Bar: 'bar/:type/:fruit',
      }
    )
  ).toMatchInlineSnapshot(
    `"/few/bar/sweet/apple/baz/jane?answer=42&count=100&valid=true"`
  );
});

it('works with getStateFromPath correctly for nested config with params', () => {
  expect(
    getPathFromState(
      getStateFromPath(
        '/few/bar/sweet/apple/baz/jane?answer=42&count=10&valid=true',
        {
          Foo: {
            Foe: 'few',
          },
          Bar: 'bar/:type/:fruit',
          Baz: {
            path: 'baz/:author',
            parse: {
              author: (author: string) =>
                author.replace(/^\w/, c => c.toUpperCase()),
              count: Number,
              valid: Boolean,
            },
          },
        }
      ),
      {
        Foo: {
          Foe: 'few',
        },
        Baz: {
          path: 'baz/:author',
          stringify: {
            author: author => author.toLowerCase(),
            id: id => `x${id}`,
            unknown: _ => 'x',
          },
        },
        Bar: 'bar/:type/:fruit',
      }
    )
  ).toMatchInlineSnapshot(
    `"/few/bar/sweet/apple/baz/jane?answer=42&count=10&valid=true"`
  );
});

it('handles state with config with nested screens and unused configs', () => {
  expect(
    getPathFromState(
      {
        routes: [
          {
            name: 'Foo',
            state: {
              routes: [
                {
                  name: 'Foe',
                  state: {
                    routes: [
                      {
                        name: 'Baz',
                        params: {
                          author: 'Jane',
                          count: 10,
                          answer: '42',
                          valid: true,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      {
        Foo: {
          Foe: 'few',
        },
        Baz: {
          path: 'baz/:author',
          stringify: {
            author: (author: string) =>
              author.replace(/^\w/, c => c.toLowerCase()),
            unknown: _ => 'x',
          },
        },
      }
    )
  ).toMatchInlineSnapshot(`"/few/baz/jane?answer=42&count=10&valid=true"`);
});

it('handles state with config with nested screens and unused configs with getStateFromPath', () => {
  expect(
    getPathFromState(
      getStateFromPath('/few/baz/jane?answer=42&count=10&valid=true', {
        Foo: {
          Foe: 'few',
        },
        Baz: {
          path: 'baz/:author',
          parse: {
            author: (author: string) =>
              author.replace(/^\w/, c => c.toUpperCase()),
            count: Number,
            valid: Boolean,
          },
        },
      }),
      {
        Foo: {
          Foe: 'few',
        },
        Baz: {
          path: 'baz/:author',
          stringify: {
            author: (author: string) =>
              author.replace(/^\w/, c => c.toLowerCase()),
            unknown: _ => 'x',
          },
        },
      }
    )
  ).toMatchInlineSnapshot(`"/few/baz/jane?answer=42&count=10&valid=true"`);
});

it('handles nested object with stringify in it', () => {
  expect(
    getPathFromState(
      {
        routes: [
          {
            name: 'Bar',
            params: { fruit: 'apple', type: 'sweet' },
            state: {
              routes: [
                {
                  name: 'Foo',
                  state: {
                    routes: [
                      {
                        name: 'Foe',
                        state: {
                          routes: [
                            {
                              name: 'Baz',
                              state: {
                                routes: [
                                  {
                                    name: 'Bis',
                                    params: {
                                      author: 'Jane',
                                      count: 10,
                                      answer: '42',
                                      valid: true,
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      {
        Foo: {
          Foe: 'few',
        },
        Bar: 'bar/:type/:fruit',
        Baz: {
          Bos: 'bos',
          Bis: {
            path: 'bis/:author',
            stringify: {
              author: (author: string) =>
                author.replace(/^\w/, c => c.toLowerCase()),
            },
          },
        },
      }
    )
  ).toMatchInlineSnapshot(
    `"/bar/sweet/apple/few/bis/jane?answer=42&count=10&valid=true"`
  );
});

it('works with getStateFromPath correctly for nested config with params and unused configs', () => {
  expect(
    getPathFromState(
      getStateFromPath(
        '/bar/sweet/apple/few/bis/jane?count=10&answer=42&valid=true',
        {
          Foo: {
            Foe: 'few',
          },
          Bar: 'bar/:type/:fruit',
          Baz: {
            Bos: 'bos',
            Bis: {
              path: 'bis/:author',
              parse: {
                author: (author: string) =>
                  author.replace(/^\w/, c => c.toUpperCase()),
                count: Number,
                valid: Boolean,
              },
            },
          },
        }
      ),
      {
        Foo: {
          Foe: 'few',
        },
        Bar: 'bar/:type/:fruit',
        Baz: {
          Bos: 'bos',
          Bis: {
            path: 'bis/:author',
            stringify: {
              author: (author: string) =>
                author.replace(/^\w/, c => c.toLowerCase()),
            },
          },
        },
      }
    )
  ).toMatchInlineSnapshot(
    `"/bar/sweet/apple/few/bis/jane?answer=42&count=10&valid=true"`
  );
});

it('handles nested object for second route depth', () => {
  expect(
    getPathFromState(
      {
        routes: [
          {
            name: 'Foo',
            state: {
              routes: [
                {
                  name: 'Bar',
                  state: {
                    routes: [{ name: 'Baz' }],
                  },
                },
              ],
            },
          },
        ],
      },
      {
        Foo: {
          path: 'foo',
          Foe: 'foe',
          Bar: {
            Baz: 'baz',
          },
        },
      }
    )
  ).toMatchInlineSnapshot(`"/baz"`);
});

it('handles nested object for second route depth with getStateFromPath', () => {
  expect(
    getPathFromState(
      getStateFromPath('/baz', {
        Foo: {
          path: 'foo',
          Foe: 'foe',
          Bar: {
            Baz: 'baz',
          },
        },
      }),
      {
        Foo: {
          path: 'foo',
          Foe: 'foe',
          Bar: {
            Baz: 'baz',
          },
        },
      }
    )
  ).toMatchInlineSnapshot(`"/baz"`);
});

it('handles nested object for second route depth and and path and stringify in roots', () => {
  expect(
    getPathFromState(
      {
        routes: [
          {
            name: 'Foo',
            state: {
              routes: [
                {
                  name: 'Bar',
                  state: {
                    routes: [{ name: 'Baz' }],
                  },
                },
              ],
            },
          },
        ],
      },
      {
        Foo: {
          path: 'foo/:id',
          stringify: {
            id: id => `id=${id}`,
          },
          Foe: 'foe',
          Bar: {
            path: 'bar/:id',
            stringify: {
              id: id => `id=${id}`,
            },
            Baz: 'baz',
          },
        },
      }
    )
  ).toMatchInlineSnapshot(`"/baz"`);
});

it('works with getStateFromPath correctly for nested config', () => {
  expect(
    getPathFromState(
      getStateFromPath('/baz', {
        Foo: {
          path: 'foo/:id',
          parse: {
            id: Number,
          },
          Foe: 'foe',
          Bar: {
            path: 'bar/:id',
            parse: {
              id: Number,
            },
            Baz: 'baz',
          },
        },
      }),
      {
        Foo: {
          path: 'foo/:id',
          stringify: {
            id: id => `id=${id}`,
          },
          Foe: 'foe',
          Bar: {
            path: 'bar/:id',
            stringify: {
              id: id => `id=${id}`,
            },
            Baz: 'baz',
          },
        },
      }
    )
  ).toMatchInlineSnapshot(`"/baz"`);
});
