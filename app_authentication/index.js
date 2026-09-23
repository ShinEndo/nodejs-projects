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

const loginFormVars = {
  signup: {
    title: "Sign up",
    message: "Already have an account?",
    route: "/account",
    switchPage: "login",
    showExtraFeilds: true,
  },
  login: {
    title: "Log in",
    message: "Need to create an account",
    route: "/auth",
    switchPage: "signup",
    showExtraFeilds: false,
  }
}

app.get("/", async (request,reply) => {
  const { page } = request.query;
  const formVars = loginFormVars[page] || loginFormVars.signup;
  return reply.view("index", formVars);
});

const users = {};

app.post("/account", async (request,reply) => {
  const { username, password } = request.body;
  users[username] = password;
  return reply.send({ message: "Account created" });
});

app.post("/auth", async (request, reply) => {
  const { username, password } = request.body;
  if(users[username] && users[username] === password) {
    return reply.send({ message: "Logged in" });
  }
  return reply.redirect("/?page=login");
});

try {
  await app.listen({ port: PORT, host: "0.0.0.0" });
  console.log(`App listening on http://${PUBLIC_HOST}:${PUBLIC_PORT}`);
} catch(error) {
  console.error(error);
  process.exit();
}