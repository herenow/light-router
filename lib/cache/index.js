//Max size for each hashtable
MAX_SIZE = 10000

//Construct a new cache object given a key
function Cache(opt) {
   if(typeof opt === 'undefined') {
       opt = {}
   }

   this.table    = {} //Hashtable
   this.max_size = opt.max_size || MAX_SIZE //Max size
   this.index    = [] //Index array, its used to control the max size of the hashtable
   this.next = 0 //When the cache gets full, this indicates what position to insert in next

   return this
}

//Add entry to cache
Cache.prototype.add = function Add(hash, value) {
   //Hashtable size
   var size = this.index.length

   //Add to hashtable, this is going in no matter what :)
   this.table[hash] = value

   //Check if the hashtable size maxed out
   if(size >= this.max_size) {
       var use = this.next;

       //Manage index table
       this.table[ this.index[use] ] = null //set for gc
       this.index[use] = hash

       //Set next position to fill
       this.next++;

       //Check if needs a reset
       if(this.next >= this.max_size) {
           this.next = 0
       }
   }
   //Not full yet, fill it
   else {
       this.index[size] = hash
   }
}

//Find entry in cache
Cache.prototype.find = function Find(hash) {
   return this.table[hash]
}

//Clear hashtable
Cache.prototype.clear = function Clear() {
   this.table = {}
}


//Exports
module.exports = Cache
