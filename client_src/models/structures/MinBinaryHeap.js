//ES6 version with help from:
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
  if (l < heap.length && compare(heap[l], heap[i]) < 0){
    smallest = l;
  }
  if (r < heap.length && compare(heap[r], heap[smallest]) < 0){
    smallest = r;
  }
  if (smallest !== i) {
    swap(tree, i, smallest);
    heapify(tree, smallest);
  }
}

function bubbleUp(tree, i){
  const { heap } = tree;
  const p = getParent(i)

  if(Number.isInteger(p) && compare(heap[i], heap[p]) < 0){
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
  this.map = new Map()
}

MinBinaryHeap.prototype.insert = function(key, value){
  this.map.set(key, this.heap.length);
  this.heap.push(new Node(key, value));
  bubbleUp(this, this.heap.length - 1);
}

MinBinaryHeap.prototype.decreaseKey = function(key, decreased){
  let i = this.map.get(key);
  this.heap[i].value = decreased;
  bubbleUp(this, i);
}

MinBinaryHeap.prototype.extractMin = function(){
  let min = this.heap[0]
  let max = this.heap[this.heap.length - 1];

  this.heap[0] = max;
  this.map.set(max.key, 0);

  this.heap[this.heap.length - 1] = min;
  this.heap.pop();
  this.map.delete(min.key);
  heapify(this, 0);
  return min;
} 

function swap(tree, a, b){
  const { heap, map } = tree;
  map.set(heap[a].key, b);
  map.set(heap[b].key, a);

  let temp = heap[a];
  heap[a] = heap[b];
  heap[b] = temp;
}

function compare(a, b){
  if(a.value > b.value) return 1;
  if(b.value > a.value) return -1;
  return 0;
}

export default MinBinaryHeap;