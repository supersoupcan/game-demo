//with help from:
//https://www.growingwiththeweb.com/data-structures/binary-heap/overview/

function Node(key, value){
  this.key = key;
  this.value = value;
}

function heapify(tree, i){
  const { heap } = tree;
  let l = getLeft(i);
  let r = getRight(i);
  let smallest = i;
  if (l < heap.length && tree.compare(heap[l], heap[i]) < 0){
    smallest = l;
  }
  if (r < heap.length && tree.compare(heap[r], heap[smallest]) < 0){
    smallest = r;
  }
  if (smallest !== i) {
    swap(tree, i, smallest);
    heapify(tree, smallest);
  }
}

function bubbleUp(tree, i){
  const { heap } = tree;
  const p = getParent(i);

  if(Number.isInteger(p) && tree.compare(heap[i], heap[p]) < 0){
    swap(tree, i, p);
    bubbleUp(tree, p);
  }
}

function getLeft(i){
  return 2 * i + 1;
}

function getRight(i){
  return 2 * i + 2;
}

function getParent(i){
  const parent =  Math.floor((i - 1) / 2); 
  return parent < 0 ? null : parent;
}

const MinBinaryHeap = function(){
  this.heap = [];
  this.map = new Map();
}

MinBinaryHeap.prototype.build = function(values){
  this.heap = values.map((value, index) => {
    this.map.set(value, index);
    return new Node(Infinity, value);
  })
}

MinBinaryHeap.prototype.compare = function(a, b){
  if(a.key > b.key) return 1;
  if(b.key > a.key) return -1;
  return 0;
}

MinBinaryHeap.prototype.decreaseKey = function(value, decreased){
  let i = this.map.get(value);
  this.heap[i].key = decreased;
  bubbleUp(this, i);
}

MinBinaryHeap.prototype.extractMin = function(){
  let min = this.heap[0]
  let max = this.heap[this.heap.length - 1];

  this.heap[0] = max;
  this.map.set(max.value, 0);

  this.heap[this.heap.length - 1] = min;
  this.heap.pop();
  this.map.delete(min.value);
  heapify(this, 0);
  return min;
} 

function swap(tree, a, b){
  const { heap, map } = tree;
  map.set(heap[a].value, b);
  map.set(heap[b].value, a);

  let temp = heap[a];
  heap[a] = heap[b];
  heap[b] = temp;
}

export default MinBinaryHeap;