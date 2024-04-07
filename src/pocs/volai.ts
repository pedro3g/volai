import { Volai } from "..";

const volai = new Volai();

volai.get("/", () => {
  // console.log("GET /");
  return { hello: "volai" };
});

volai.listen(3000, () => {
  console.log("Server listening at http://localhost:3000");
});
