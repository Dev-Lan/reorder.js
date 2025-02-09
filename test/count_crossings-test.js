const reorder = require('../dist/reorder.cjs');

const vows = require('vows');
const assert = require('assert');
const seedrandom = require('seedrandom');

seedrandom('reorder');

const suite = vows.describe('reorder.count_crossings');

function naive_count_crossings(graph, north, south) {
  const inv_north = reorder.inverse_permutation(north);
  const inv_south = reorder.inverse_permutation(south);

  let count = 0;
  let links = [];

  for (let i = 0; i < north.length; i++) {
    const v = north[i];
    links = links.concat(
      graph
        .outEdges(v)
        .map((e) => [inv_north[e.target.index], inv_south[e.source.index]])
    );
  }
  for (let i = 0; i < links.length; i++) {
    const e1 = links[i];
    for (let j = i + 1; j < links.length; j++) {
      const e2 = links[j];
      if (
        (e1[0] < e2[0] && e1[1] > e2[1]) ||
        (e1[0] > e2[0] && e1[1] < e2[1])
      ) {
        count++;
      }
    }
  }
  return count;
}

function dotest(mat) {
  const graph = reorder.mat2graph(mat, true);
  const comps = graph.components();
  const comp = comps.reduce((a, b) => (a.length > b.length ? a : b));
  comp.sort((a, b) => a - b);
  const layer1 = comp.filter((n) => graph.outEdges(n).length != 0);
  const layer2 = comp.filter((n) => graph.inEdges(n).length != 0);
  //console.time('fast_crossings');
  const c1 = reorder.count_crossings(graph, layer1, layer2);
  //console.timeEnd('fast_crossings');
  //console.time('naive_crossings');
  const c2 = naive_count_crossings(graph, layer1, layer2);
  //console.timeEnd('naive_crossings');
  // if (c1 != c2) {
  // 	var file = 'error_count_crossings.json';
  // 	jf.writeFile(file, mat, function(err) {
  // 	    console.log(err);
  // 	});
  // }
  assert.equal(c1, c2);
}

suite.addBatch({
  count_crossings: {
    simple() {
      const graph = reorder
        .graph()
        .nodes([
          { id: 0 },
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
        ])
        .links([
          { source: 0, target: 0 },
          { source: 1, target: 1 },
          { source: 1, target: 2 },
          { source: 2, target: 0 },
          { source: 2, target: 3 },
          { source: 2, target: 4 },
          { source: 3, target: 0 },
          { source: 3, target: 2 },
          { source: 4, target: 3 },
          { source: 5, target: 2 },
          { source: 5, target: 4 },
        ])
        .directed(true)
        .init();
      const comp = graph.components()[0];
      const layer1 = comp.filter((n) => graph.outEdges(n).length != 0);
      const layer2 = comp.filter((n) => graph.inEdges(n).length != 0);

      assert.equal(naive_count_crossings(graph, layer1, layer2), 12);
      assert.equal(reorder.count_crossings(graph, layer1, layer2), 12);
    },
    bug() {
      dotest([
        [
          0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
          1, 0, 0, 0, 1, 0, 0,
        ],
        [
          0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
        ],
        [
          0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 1,
        ],
        [
          1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 1,
        ],
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1,
          1, 0, 0, 1, 0, 0, 0,
        ],
        [
          1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
        ],
        [
          0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
        ],
        [
          1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
          0, 0, 1, 1, 0, 0, 0,
        ],
        [
          0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
          0, 0, 0, 0, 0, 0, 0,
        ],
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 1, 0, 1,
        ],
        [
          0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1,
          0, 0, 0, 0, 0, 0, 1,
        ],
        [
          0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0,
          1, 1, 1, 1, 0, 0, 0,
        ],
        [
          0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
        ],
        [
          0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1,
          0, 1, 0, 0, 0, 0, 1,
        ],
        [
          0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
          0, 0, 1, 0, 0, 0, 0,
        ],
        [
          0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
        ],
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 1, 0, 0,
        ],
        [
          0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
          0, 0, 0, 0, 0, 0, 1,
        ],
        [
          1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
        ],
        [
          0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
        ],
        [
          0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
          0, 0, 1, 0, 1, 0, 0,
        ],
        [
          0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
        ],
        [
          0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 1, 0, 0,
        ],
        [
          1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 1, 0, 0, 1, 0,
        ],
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0,
        ],
        [
          0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0,
          1, 0, 0, 0, 1, 1, 1,
        ],
        [
          0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 1, 0, 0, 0,
        ],
        [
          1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1,
          0, 0, 1, 0, 0, 0, 0,
        ],
        [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          1, 0, 1, 0, 0, 1, 0,
        ],
        [
          0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0,
          0, 0, 1, 0, 0, 0, 0,
        ],
      ]);
    },
    hard() {
      for (let i = 10; i < 100; i += 20) {
        for (let j = 10; j < 100; j += 20) {
          const mat = reorder.random_matrix(0.2, i, j, false);
          dotest(mat);
        }
      }
    },
  },
});

suite.export(module);
