'use strict';

var defaultcomparator = function(a, b) {
  return a < b;
};

function Heap(elem, subheaps) {
  return {elem: elem, subheaps: subheaps};
}

function pushSubheaps(heap, newHeap) {
  if (heap.subheaps) {
    heap.subheaps.push(newHeap);
  } else {
    heap.subheaps = [newHeap];
  }
  return heap;
}

function PairingHeap(comparator) {
  if (!(this instanceof PairingHeap)) return new PairingHeap(comparator);
  this.h = undefined;
  this.size = 0;
  this.compare = comparator || defaultcomparator;
}


PairingHeap.prototype.insert = function(val) {
  this.h = meldNew(this.compare, val, this.h);
  this.size += 1;
};

PairingHeap.prototype.peek = function() {
  return this.h === undefined ? undefined : this.h.elem;
};

PairingHeap.prototype.popMin = function() {
  if (this.h === undefined) {
    return undefined;
  }

  var result = this.h.elem;
  this.h = mergePairs(this.compare, this.h.subheaps);
  this.size -= 1;
  return result;
};

PairingHeap.prototype.isEmpty = function() {
  return this.h === undefined;
};


function meld(compare, heap1, heap2) {
  if (heap1 === undefined) {
    return heap2;
  }

  if (heap2 === undefined) {
    return heap1;
  }

  if (compare(heap1.elem, heap2.elem)) {
    return pushSubheaps(heap1, heap2);
  } else {
    return pushSubheaps(heap2, heap1);
  }
};

function meldNew(compare, elem, heap2) {
  if (heap2 === undefined) {
    return Heap(elem, undefined);
  }

  if (compare(elem, heap2.elem)) {
    return Heap(elem, [heap2]);
  } else {
    return pushSubheaps(heap2, Heap(elem, undefined));
  }
};

function mergePairs(compare, heaps) {
  if (heaps === undefined || heaps.length === 0) {
    return undefined;
  }
  if (heaps.length === 1) {
    return heaps[0];
  }
  if (heaps.length === 2) {
    return meld(compare, heaps[0], heaps[1]);
  }

  // Two pass algorithm is fast in practice.
  // https://www.cise.ufl.edu/~sahni/dsaaj/enrich/c13/pairing.htm
  var evenLen = heaps.length % 2 === 0;
  var numPairs = evenLen ? 0 : 1;
  for (var i = evenLen ? 0 : 1; i < heaps.length; i += 2) {
    heaps[Math.round(i / 2)] = meld(compare, heaps[i], heaps[i + 1]);
    ++numPairs;
  }

  var result = heaps[numPairs - 1];
  for (var i = numPairs - 2; i >= 0; --i) {
    result = meld(compare, heaps[i], result);
  }

  return result;
};

var main = function() {
  var x = new PairingHeap(function(a, b) {
    return a < b;
  });
  x.insert(1);
  x.insert(0);
  x.insert(5);
  x.insert(4);
  x.insert(3);
  while (!x.isEmpty()) {
    console.log(x.popMin());
  }
};

if (require.main === module) {
  main();
}

module.exports = PairingHeap;
