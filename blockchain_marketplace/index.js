import Fastify from "fastify";
import MarketplaceNode from "./src/marketplaceNode.js";
const fastify = Fastify();
let [PORT] = process.argv.slice(2);
PORT = PORT || 0;

let marketplaceNode;

fastify.get("/", async (request, reply) => {
  reply.send({ message: "Marketplace running" });
});

fastify.post("/register-node", async (request, reply) => {
  const { url: newNodeUrl} = request.body;
  await marketplaceNode.registerNode(newNodeUrl);
  reply.send({ message: "Node Registered" });
});

fastify.post("/sync-peers", async (request,reply) => {
  const { peers } = request.body;
  marketplaceNode.peers = peers;
  console.log(`${marketplaceNode.url} synced ${marketplaceNode.peers}`);
  reply.send({ message: "Synced Peers" });
});

try {
  await fastify.listen({ port: PORT, host: "0.0.0.0" });
  PORT = fastify.server.address().port;
  console.log(`Running on http://localhost:${PORT}`);
} catch(err) {
  console.error(`Error starting server:`, err);
  process.exit(1);
}

const initializeNode = () => {
  const URL = process.env.NODE_URL || ` http://localhost:${PORT}`;
  const initialPeers =
    process.env.INITIAL_PEERS !== undefined
      ? process.env.INITIAL_PEERS.split(",").filter(Boolean)
      : ["http://localhost:3000"];
  marketplaceNode = new MarketplaceNode(URL, initialPeers);
}
initializeNode();
