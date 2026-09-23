import Fastify from "fastify";
import formbody from "@fastify/formbody";
import amqp from "amqplib";

const app = Fastify();
await app.register(formbody);
const PORT = process.env.PORT || 3001;
let channel, connection;

async function connect() {
  try {
    const rabbitHost = process.env.RABBITMQ_HOST || "localhost";
    connection = await amqp.connect(`amqp://${rabbitHost}:5672`);
    channel = await connection.createChannel();
    await channel.assertQueue("drink-order");
    await channel.assertQueue("analyticts");
  } catch(err) {
    console.log(err);
  }
}

await connect();

async function sendOrderData(data) {
  await channel.sendToQueue("analytics", Buffer.from(JSON.stringify(data)));
}

channel.consume("drink-order", async (data) => {
  const { content } = data;
  const { order, customer } = JSON.parse(content.toString());
  console.log(`${order} being fulfilled for ${customer}`);
  channel.ack(data);
  await sendOrderData({ order, customer });
});

try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`Server listenning on http://localhost:${PORT}`);
} catch(err) {
  console.error(`Error starting server:`, err);
  process.exit(1);
}
