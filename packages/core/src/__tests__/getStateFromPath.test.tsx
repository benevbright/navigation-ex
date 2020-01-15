import getStateFromPath from '../getStateFromPath';
import getPathFromState from '../getPathFromState';

it('converts path string to initial state', () => {
  expect(
    getStateFromPath('foo/bar/baz%20qux?author=jane%20%26%20co&valid=true')
  ).toEqual({
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              state: {
                routes: [
                  {
                    name: 'baz qux',
                    params: { author: 'jane & co', valid: 'true' },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  });
});

it('converts path string to initial state with getPathFromState', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              state: {
                routes: [
                  {
                    name: 'baz qux',
                    params: { author: 'jane & co', valid: 'true' },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };
  expect(getStateFromPath(getPathFromState(state))).toEqual(state);
});

it('converts path string to initial state with config', () => {
  expect(
    getStateFromPath(
      '/few/bar/sweet/apple/baz/jane?count=10&answer=42&valid=true',
      {
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
      }
    )
  ).toEqual({
    routes: [
      {
        name: 'Foo',
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
  });
});

it('converts path string to initial state with config with getPathFromState', () => {
  const state = {
    routes: [
      {
        name: 'Foo',
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
  };
  expect(
    getStateFromPath(
      getPathFromState(state, {
        Foo: 'few',
        Bar: 'bar/:type/:fruit',
        Baz: {
          path: 'baz/:author',
          stringify: {
            author: author => author.toLowerCase(),
            id: id => `x${id}`,
          },
        },
      }),
      {
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
      }
    )
  ).toEqual(state);
});

it('handles leading slash when converting', () => {
  expect(getStateFromPath('/foo/bar/?count=42')).toEqual({
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              params: { count: '42' },
            },
          ],
        },
      },
    ],
  });
});

it('handles ending slash when converting', () => {
  expect(getStateFromPath('foo/bar/?count=42')).toEqual({
    routes: [
      {
        name: 'foo',
        state: {
          routes: [
            {
              name: 'bar',
              params: { count: '42' },
            },
          ],
        },
      },
    ],
  });
});

it('handles route without param', () => {
  expect(getStateFromPath('foo/bar')).toEqual({
    routes: [
      {
        name: 'foo',
        state: {
          routes: [{ name: 'bar' }],
        },
      },
    ],
  });
});

it('handles route without param with getStateFromPath', () => {
  const state = {
    routes: [
      {
        name: 'foo',
        state: {
          routes: [{ name: 'bar' }],
        },
      },
    ],
  };
  expect(getStateFromPath(getPathFromState(state))).toEqual(state);
});

it('returns undefined for invalid path', () => {
  expect(getStateFromPath('//')).toBe(undefined);
});

it('converts path string to initial state with config with nested screens', () => {
  expect(
    getStateFromPath(
      '/few/bar/sweet/apple/baz/jane?count=10&answer=42&valid=true',
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
    )
  ).toEqual({
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
  });
});

it('converts path string to initial state with config with nested screens with getPathFromState', () => {
  const state = {
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
  };
  expect(
    getStateFromPath(
      getPathFromState(state, {
        Foo: {
          Foe: 'few',
        },
        Bar: 'bar/:type/:fruit',
        Baz: {
          path: 'baz/:author',
          stringify: {
            author: author => author.toLowerCase(),
            id: id => `x${id}`,
            unknown: _ => 'x',
          },
        },
      }),
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
    )
  ).toEqual(state);
});

it('converts path string to initial state with config with nested screens and unused parse functions', () => {
  expect(
    getStateFromPath('/few/baz/jane?count=10&answer=42&valid=true', {
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
          id: Boolean,
        },
      },
    })
  ).toEqual({
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
  });
});

it('converts path string to initial state with config with nested screens and unused parse functions with getPathFromState', () => {
  const state = {
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
  };
  expect(
    getStateFromPath(
      getPathFromState(state, {
        Foo: {
          Foe: 'few',
        },
        Baz: {
          path: 'baz/:author',
          stringify: {
            author: (author: string) =>
              author.replace(/^\w/, c => c.toLowerCase()),
          },
        },
      }),
      {
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
            id: Boolean,
          },
        },
      }
    )
  ).toEqual(state);
});

it('handles nested object with unused configs and with parse in it', () => {
  expect(
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
    )
  ).toEqual({
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
  });
});

it('handles nested object with unused configs and with parse in it with getPathFromState', () => {
  const state = {
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
  };
  expect(
    getStateFromPath(
      getPathFromState(state, {
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
      }),
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
    )
  ).toEqual(state);
});

it('handles parse in nested object for second route depth', () => {
  expect(
    getStateFromPath('/baz', {
      Foo: {
        path: 'foo',
        Foe: 'foe',
        Bar: {
          Baz: 'baz',
        },
      },
    })
  ).toEqual({
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
  });
});

it('handles parse in nested object for second route depth with getPathFromState', () => {
  const state = {
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
  };
  expect(
    getStateFromPath(
      getPathFromState(state, {
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
  ).toEqual(state);
});

it('handles parse in nested object for second route depth and and path and parse in roots', () => {
  expect(
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
    })
  ).toEqual({
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
  });
});

it('handles parse in nested object for second route depth and and path and parse in roots with getPathFromState', () => {
  const state = {
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
  };
  expect(
    getStateFromPath(
      getPathFromState(state, {
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
      }),
      {
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
      }
    )
  ).toEqual(state);
});
