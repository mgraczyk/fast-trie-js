const strInsert = (s, at, value) => {
  return s ? s.substr(0, at) + value + s.substr(at) : value;
}

const binarySearch = (cs, firstChar) => {
  let k;
  let min = 0;
  let max = cs.length;

  while (min < max) {
    k = Math.floor((min + max) / 2);
    if (cs[k] <= firstChar) {
      min = k + 1;
    } else  {
      max = k;
    }
  }

  return min;
}

const findChildIdx = (cs, firstChar) => {
  if (cs === undefined) return 0;

  for (let k = 0; k < cs.length; ++k) {
    if (cs[k] > firstChar) {
      return k;
    }
  }
  return cs.length;
}

// Find the least node in the tree above the path s.
// Returns [i, j, node,] where
// i is the an index into s "one past the end" of the longest match
// j is the an index into j "one past the end" of the matched path
// node is the last node on the path
const find = (node, s, iStart=0) => {
  const sl = s.length;
  let i = iStart;

  while (true) {
    // Consume the path portion of the node.
    const p = node.path || '';
    const pl = p.length;
    let j = 0;
    while (i < sl && j < pl && s[i] === p[j]) {
      ++i; ++j;
    }

    if (i === sl || (i < sl && j < pl)) {
      // No search left.
      return [i, j, node];
    }

    // Try to traverse down the tree.
    const childIdx = findChildIdx(node.cmap, s[i]);
    if (childIdx === 0 || node.cmap[childIdx - 1] !== s[i]) {
      // No matching child.
      return [i, j, node];
    }

    // Travese down one, consuming the matched character.
    ++i;
    node = node.children[childIdx - 1];
  }
}

class FlatValuesTrie {
  constructor(root=null, flatValues=null) {
    this.flatValues = flatValues || [];
    if (flatValues === null) {
      this.root = this._buildRecursively(
        root || {values: []},
        this.flatValues);
    } else {
      this.root = root;
    }
  }

  _buildRecursively(node, flatValues) {
    const start = flatValues.length;
    Array.prototype.push.apply(flatValues, node.values);

    const children = node.children.map(c => this._buildRecursively(c, flatValues));

    const result = {s: start};

    const subLen = flatValues.length - start;
    if (subLen !== 1) {
      result.l = subLen;
    }
    if (node.path) {
      result.path = node.path;
    }
    if (children && children.length) {
      result.cmap = node.cmap;
      result.children = children;
    }
    return result;
  }

  getSubValues(s) {
    const [i, j, node] = find(this.root, s);
    if (i === s.length) {
      const subLen = node.l === undefined ? 1 : node.l;
      return this.flatValues.slice(node.s, node.s + subLen);
    } else {
      return [];
    }
  }

  getValuesForRange(start, end) {
    return this.flatValues.slice(start, end);
  }

  getSubRange(s) {
    const [i, j, node] = find(this.root, s);
    if (i === s.length) {
      const subLen = node.l === undefined ? 1 : node.l;
      return [node.s, node.s + subLen];
    } else {
      return [0, 0];
    }
  }
}

class Trie {
  constructor(root=null) {
    this.root = root || {path: '', values: [], children: []};
  }

  toFrozen() {
    return new FlatValuesTrie(this.root);
  }

  // Always build in reverse sorted order for efficiency.
  insert(s, v) {
    const [i, j, node] = find(this.root, s);

    // Cases
    // 1. Split a node
    //    a.
    // 2. Insert into existing
    // 3. Add new child
    if (j < node.path.length) {
      const nodePrefix = node.path.slice(0, j);
      const pBranch = node.path[j];
      const pChild = {...node, path: node.path.slice(j + 1)};
      let newCmap, newChildren, newValues;

      if (i === s.length) {
        // s: kab
        // p:  abcd -> X
        // -->
        // p: ab -> [c]d -> X
        newCmap = pBranch
        newValues = [v];
        newChildren = [pChild];
      } else {
        // s: abgh
        // p: abef
        // -->
        // p: ab -> { [e]f -> X, [g]h }
        const sBranch = s[i];
        const sChild = {path: s.slice(i + 1), values: [v], children: []};

        newCmap = sBranch < pBranch ? sBranch + pBranch : pBranch + sBranch;
        newChildren = sBranch < pBranch ? [sChild, pChild] : [pChild, sChild];
        newValues = [];
      }

      node.path = nodePrefix;
      node.cmap = newCmap;
      node.children = newChildren;
      node.values = newValues;
    } else if (i === s.length && j === node.path.length) {
      node.values.push(v);
    } else {
      const newNodePath = s.slice(i + 1);
      const childPos = findChildIdx(node.cmap, s[i]);
      const newNode = {path: newNodePath, values: [v], children: []};
      node.cmap = strInsert(node.cmap, childPos, s[i]);
      node.children.splice(childPos, 0, newNode);
    }
  }

  get(s) {
    const [i, j, node] = find(this.root, s);

    if (i === s.length && j === node.path.length) {
      return node.values;
    } else {
      return [];
    }
  }

  getSubTrie(s) {
    const [i, j, node] = find(this.root, s);
    if (i === s.length) {
      return new Trie(node);
    } else {
      return new Trie();
    }
  }

  toList() {
    return this.root.values.concat(...this.root.children.map(c => (new Trie(c)).toList()));
  }
};

export default Trie;
