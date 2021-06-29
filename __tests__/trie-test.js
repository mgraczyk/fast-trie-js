import Trie from '..';

test('create empty', () => {
  const t = new Trie();
});

test('insert one', () => {
  const t = new Trie();
  const obj = {};

  t.insert('xxx', obj);
  const result = t.toList()

  expect(result).toEqual([obj]);
});

test('insert extend', () => {
  const t = new Trie();

  t.insert('abc', 1);
  t.insert('abcdef', 2);
  const result = t.toList()

  expect(result).toEqual([1, 2]);
  expect(t.get('abc')).toEqual([1]);
  expect(t.get('abcdef')).toEqual([2]);
});

test('insert append', () => {
  const t = new Trie();

  t.insert('abc', 1);
  t.insert('abc', 2);
  const result = t.toList()

  expect(result).toEqual([1, 2]);
  expect(t.get('abc')).toEqual([1, 2]);
});

test('insert split', () => {
  const t = new Trie();

  t.insert('abcdef', 2);
  t.insert('abc', 1);

  const result = t.toList()
  expect(result).toEqual([1, 2]);
  expect(t.get('abc')).toEqual([1]);
  expect(t.get('abcdef')).toEqual([2]);
  expect(t.get('')).toEqual([]);
  expect(t.get('abcde')).toEqual([]);
});

test('get nothing', () => {
  const t = new Trie();

  t.insert('abcdef', 2);
  t.insert('abc', 1);
  t.insert('abcdefg', 1);

  expect(t.get('')).toEqual([]);
  expect(t.get('ab')).toEqual([]);
  expect(t.get('abcde')).toEqual([]);
});

test('tall forward', () => {
  const t = new Trie();

  t.insert('', 6);
  t.insert('ab', 5);
  t.insert('abcd', 4);
  t.insert('abcde', 3);
  t.insert('abcdef', 2);
  t.insert('abcdefg', 1);

  const result = t.toList()
  expect(result).toEqual([6, 5, 4, 3, 2, 1]);

  expect(t.get('')).toEqual([6]);
  expect(t.get('ab')).toEqual([5]);
  expect(t.get('abcde')).toEqual([3]);
  expect(t.get('abc')).toEqual([]);
});

test('tall backward', () => {
  const t = new Trie();

  t.insert('abcdefg', 1);
  t.insert('abcdef', 2);
  t.insert('abcde', 3);
  t.insert('abcd', 4);
  t.insert('ab', 5);
  t.insert('', 6);

  const result = t.toList()
  expect(result).toEqual([6, 5, 4, 3, 2, 1]);

  expect(t.get('')).toEqual([6]);
  expect(t.get('ab')).toEqual([5]);
  expect(t.get('abcde')).toEqual([3]);
  expect(t.get('abc')).toEqual([]);
});

test('insert one', () => {
  const t = new Trie();

  t.insert('test', 1);

  const root = t.root;
  expect(root).toEqual({
    path: '',
    values: [],
    cmap: 't',
    children: [{
      path: 'est',
      values: [1],
      children: [],
    }],
  });
});

test('insert three order', () => {
  const t = new Trie();

  t.insert('r', 1);
  t.insert('t', 2);
  t.insert('o', 3);

  const root = t.root;
  expect(root).toEqual({
    path: '',
    values: [],
    cmap: 'ort',
    children: [
      { path: '', values: [3], children: [], },
      { path: '', values: [1], children: [], },
      { path: '', values: [2], children: [], },
    ],
  });
});

test('insert many', () => {
  const t = new Trie();

  t.insert('second', 1);
  t.insert('joe', 2);
  t.insert('harten', 3);
  t.insert('harry', 4);
  t.insert('harold', 5);
  t.insert('first second', 6);
  t.insert('first', 7);
  t.insert('don', 8);

  expect(t.root).toEqual({
    path: '',
    values: [],
    cmap: 'dfhjs',
    children: [
      { path: 'on', values: [8], children: [], },
      { path: 'irst', values: [7], cmap: " ", children: [
        { path: 'second', values: [6], children: []},
      ]},
      { path: 'ar', values: [], cmap: 'ort', children: [
        { path: 'ld', values: [5], children: [], },
        { path: 'y', values: [4], children: [], },
        { path: 'en', values: [3], children: [], },
      ]},
      { path: 'oe', values: [2], children: [], },
      { path: 'econd', values: [1], children: [], },
    ],
  });
});

test('insert two existing', () => {
  const t = new Trie();

  t.insert('abcdg', 1);
  t.insert('abcdef', 2);

  const root = t.root;
  expect(root).toEqual({
    path: '',
    values: [],
    cmap: 'a',
    children: [{
      path: 'bcd',
      values: [],
      cmap: 'eg',
      children: [{
        path: 'f',
        values: [2],
        children: [],
      }, {
        path: '',
        values: [1],
        children: [],
      }],
    }],
  });
});

test('insert split one', () => {
  const t = new Trie();

  t.insert('abcdef', 1);
  t.insert('abc', 2);
  t.insert('abc', 3);

  const root = t.root;
  expect(root).toEqual({
    path: '',
    values: [],
    cmap: 'a',
    children: [{
      path: 'bc',
      values: [2, 3],
      cmap: 'd',
      children: [{
        path: 'ef',
        values: [1],
        children: [],
      }],
    }],
  });
});


test('insert split long first', () => {
  const t = new Trie();

  t.insert('bril', 1);
  t.insert('brian', 2);

  const root = t.root;
  expect(root).toEqual({
    path: '',
    values: [],
    cmap: 'b',
    children: [{
      path: 'ri',
      values: [],
      cmap: 'al',
      children: [
        {path: 'n', values: [2], children: []},
        {path: '', values: [1], children: []},
      ],
    }],
  });
});

test('insert split three', () => {
  const t = new Trie();

  t.insert('brilliance', 0);
  t.insert('brian', 0);
  t.insert('brave', 0);

  const root = t.root;
  expect(root).toEqual({
    path: '',
    values: [],
    cmap: 'b',
    children: [{
      path: 'r',
      values: [],
      cmap: 'ai',
      children: [
        {path: 've', values: [0], children: []},
        {path: '', values: [], cmap: 'al', children: [
          {path: 'n', values: [0], children: []},
          {path: 'liance', values: [0], children: []},
        ]},
      ],
    }],
  });
});

test('insert split three frozen', () => {
  const t = new Trie();

  t.insert('brilliance', 0);
  t.insert('brian', 0);
  t.insert('brave', 0);

  const tFrozen = t.toFrozen();

  const root = tFrozen.root;
  expect(root).toEqual({
    s: 0,
    l: 3,
    cmap: 'b',
    children: [{
      path: 'r',
      s: 0,
      l: 3,
      cmap: 'ai',
      children: [
        {path: 've', s: 0},
        {s: 1, l: 2, cmap: 'al', children: [
          {path: 'n', s: 1},
          {path: 'liance', s: 2},
        ]},
      ],
    }],
  });
});


test('big frozen', () => {
  const t = new Trie();

  t.insert('codex', 0);
  t.insert('certik', 0);
  t.insert('celer', 0);

  const tFrozen = t.toFrozen();

  expect(t.get('codex')).toEqual([0]);
  expect(t.get('certik')).toEqual([0]);
  expect(t.get('celer')).toEqual([0]);

  expect(tFrozen.root).toEqual({
    s: 0,
    l: 3,
    cmap: 'c',
    children: [{
      s: 0,
      l: 3,
      cmap: 'eo',
      children: [
        {s: 0, l: 2, cmap: 'lr', children: [
          {path: 'er', s: 0},
          {path: 'tik', s: 1},
        ]},
        {path: 'dex', s: 2},
      ],
    }],
  });
});
