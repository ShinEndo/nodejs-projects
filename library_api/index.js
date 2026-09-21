import Fastify from 'fastify';
import formbody from '@fastify/formbody';
const app = Fastify();
const PORT = 3000;
await app.register(formbody);


app.get("/", async (_request, reply) => {
  reply.send({message: "ok"});
});

app.setNotFoundHandler((request, reply) => {
  const { message, statusCode } = request.error || {};
  reply.status(statusCode || 500).send({ message });
});

try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`Listening at http://localhost:${PORT}`);
} catch(err) {
  console.error(err);
  process.exit(1);
}