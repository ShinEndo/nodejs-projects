import Fastify from "fastify";
import formBody from "@fastify/formbody";
import { welcomeMail } from "./mailTemplates.js";
import { sendMail } from "./services/mailer.js";

const app = Fastify();
await app.register(formBody);

const port = process.env.PORT || 3000;

app.post("/subscribe", async (request, reply) => {
  const { email = process.env.GMAIL_TO } = request.body;
  console.log(`Received ${email}`);

  await sendMail(email, welcomeMail());
  reply.send({ message: "okay" });
});

try {
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`Server running at http://localhost:${port}`);
} catch(err) {
  console.error(`Error starting server:`, err);
  process.exit(1);
}