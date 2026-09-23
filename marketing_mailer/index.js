import Fastify from "fastify";
import formBody from "@fastify/formbody";
import { welcomeMail, confirmationMail } from "./mailTemplates.js";
import { sendMail } from "./services/mailer.js";
import { schedule } from "./services/scheduler.js";
import Lead from "./db.js";

const app = Fastify();
await app.register(formBody);

const port = process.env.PORT || 3000;

app.post("/subscribe", async (request, reply) => {
  const { email = process.env.GMAIL_TO } = request.body;
  console.log(`Received ${email}`);

  try {
    await Lead.create({ email });
    await sendMail(email, welcomeMail());
  } catch(e) {
    console.error("Could not save the Lead:", e.message);
  }
  reply.send({ message: "okay" });
});

app.get("/verify/:email", async (request,reply) => {
  const { email } = request.params;
  try {
    const lead = await Lead.findOne({ where: { email } });
    if(lead) {
      lead.verified = true,
      await lead.save();
      console.log(`${email} is vefified`);
      await sendMail(email, confirmationMail());
    }
  } catch(e) {
    console.error("Could not verify the Lead:", e.message);
    reply.send({ message: "Unbale to verify." });
  }
});

app.get("/campaign/:campainKey/user/:email/image.png", async (request,reply) => {
  const { email, campainKey } = request.params;
  try {
    const lead = await Lead.findOne({ where: { email } });
    if(lead) {
      lead.lastCampain = campainKey;
      await lead.save();
      console.log(`${email} opened ${campainKey}`);
    }
  } catch(e) {
    console.error("An error occured", e.message);
  }
  reply.send({ message: "okay" });
} );

app.ready(() => {
  console.log(app.printRoutes());
});

schedule({ second: 30 });

try {
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`Server running at http://localhost:${port}`);
} catch(err) {
  console.error(`Error starting server:`, err);
  process.exit(1);
}