const reorder = require('../dist/reorder.cjs');

const vows = require('vows'),
  assert = require('assert');

const suite = vows.describe('reorder.graph');

suite.addBatch({
  graph: {
    simple() {
      const nodes = [{ id: 0 }, { id: 1 }, { id: 2 }],
        links = [
          { source: 0, target: 1 },
          { source: 1, target: 2 },
        ];
      const graph = reorder.graph(nodes, links).init();
      assert.equal(graph.nodes().length, 3);
      assert.equal(graph.links().length, 2);

      assert.deepEqual(graph.edges(0), [links[0]]);
      assert.deepEqual(graph.neighbors(0), [nodes[1]]);
      assert.deepEqual(graph.neighbors(1), [nodes[0], nodes[2]]);
      assert.deepEqual(graph.neighbors(2), [nodes[1]]);
    },
  },
});

suite.export(module);
