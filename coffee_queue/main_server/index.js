import Fastify from "fastify";
import formbody from "@fastify/formbody";
import amqp from "amqplib";
import { createClient } from "redis";

const app = Fastify();
await app.register(formbody);
const PORT = process.env.PORT || 3000;
let channel, connection;

async function connect() {
  try {
    const rabbitHost = process.env.RABBITMQ_HOST || "localhost";
    connection = await amqp.connect(`amqp://${rabbitHost}:5672`);
    channel = await connection.createChannel();
    await channel.assertQueue("drink-order");
  } catch(err) {
    console.log(err);
  }
}

await connect();

async function sendOrderData(data) {
  await channel.sendToQueue(
    "drink-order",
    Buffer.from(JSON.stringify(data)),
    { persistent: true },
  );
}

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
  const { drinkOrder: order, cost, customer } = requset.body;
  const data = { order, customer };
  await sendOrderData(data);
  console.log(`Drink: ${order} is being processed for ${customer}.`);
  reply.send("Order Processing.");
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
