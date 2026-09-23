import Fastify from "fastify";
import formbody from "@fastify/formbody";
import { createClient } from "redis";

const app = Fastify();
const PORT = 3000;

await app.register(formbody);

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const subscriber = createClient({ url: redisUrl });
await subscriber.connect();

const publisher = createClient({ url: redisUrl });
await publisher.connect();

await subscriber.subscribe("drink-order", (message) => {
  const { drink, customer } = JSON.parse(message);
  console.log(`Recieved a new ${drink} for ${customer}`);
});

app.post("/slow-order", async (request, reply) => {
  const { drinkOrder } = request.body;
  for(let i = 0; i < 10000000000; i++) {}
  console.log("ORDER PLACED");
  reply.send(`Drink order added to queue: ${drinkOrder}`);
});

const coffeeQueue = [];

app.post("/order", async (requset, reply) => {
  const { drinkOrder } = requset.body;
  await publisher.publish("drink-order", JSON.stringify({
    drink: drinkOrder,
    cost: 450,
    customer: "ShinEndo",
  }));
  coffeeQueue.push(drinkOrder);
  console.log(coffeeQueue.length);
  reply.send("Drink order added to queue");
});

app.get("/process-order", async (request, reply) => {
  const nextOrder = coffeeQueue.shift();
  if(nextOrder) {
    reply.send({ order: nextOrder });
  } else {
    reply.send("No drink orders in queue.");
  }
});

app.get("/order-count", async (request, reply) => {
  reply.send(`${coffeeQueue.length} drink orders in queue.`);
});

try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`Server listenning on http://localhost:${PORT}`);
} catch(err) {
  console.error(`Error starting server:`, err);
  process.exit(1);
}
