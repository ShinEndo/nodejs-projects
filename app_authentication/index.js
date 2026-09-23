import Fastify from "fastify";
import fastifyFormbody from "@fastify/formbody";
import fastyfyView from "@fastify/view";
import handlebars from "handlebars";

const app = Fastify();
const PORT = 3000;
const PUBLIC_HOST = process.env.APP_HOST || "localhost";
const PUBLIC_PORT = process.env.app_PORT || PORT;

await app.register(fastifyFormbody);
await app.register(fastyfyView, {
  engine: { handlebars },
  root: "views",
});

app.get("/", async (request,reply) => {
  reply.send("Welcome!");
});

try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`App listening on http://${PUBLIC_HOST}:${PUBLIC_PORT}`);
} catch(error) {
  console.error(error);
  process.exit();
}