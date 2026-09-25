import Block from "./block.js";

class Blockchain {
  constructor(chain, pendingTransactions = []) {
    this.chain = chain || [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = pendingTransactions;
    this.miningReward = 100;
  }
  createGenesisBlock() {
    return new Block([], null);
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  async mineBlock() {
    const targetPrefix = "0".repeat(this.difficulty);
    const previousBlock = this.getLatestBlock();
    const newBlock = new Block(this.pendingTransactions, previousBlock.hash);

    while(newBlock.hash.substring(0, this.difficulty) !== targetPrefix){
      newBlock.nonce++;
      newBlock.hash = newBlock.calculateHash();
    }

    previousBlock.nextHash = newBlock.hash;
    this.chain.push(newBlock);
    this.pendingTransactions = [];
  }
}
export default Blockchain;