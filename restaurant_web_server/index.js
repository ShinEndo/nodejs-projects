import Fastify from "fastify";
import ejs from "ejs";
import fastifyView from "@fastify/view";
import fastifyStatic from "@fastify/static";
import { join } from "path";
const publicPath = join(process.cwd(), "public");

import operatingHours from './data/operatingHours.js';
import menuItems from './data/menuItems.js';

const app = Fastify();
const port = 3000;

app.register(fastifyStatic, {
  root: publicPath,
  prefix: "/public/",
});

app.register(fastifyView, {
  engine: {
    ejs: ejs,
  },
});

app.get("/", (req, reply) => {
  reply.view("views/index.ejs", { name: "What's Fare is Fair" });
});

app.get("/menu", (req, reply) => {
  reply.view("views/menu.ejs", { menuItems });
});

app.get("/hours", (req, reply) => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const dayIndex = new Date().getDay();
  const today = days[(dayIndex + 6) % 7];
  reply.view("views/hours.ejs", { operatingHours, days, today });
});

app.get("/about", (req, reply) => {
  reply.view("views/about.ejs");
});

await app.listen({ port, host: "0.0.0.0" });
console.log(`Web Server is listening at http://localhost:${port}`);
