import { router } from "../components/router";
import QRCode from 'qrcode';

export function init() {
  router.get("/", async (ctx) => {
    ctx.render("index.pug");
  });

  router.post("/generate", async (ctx) => {
    const body = ctx.request.body;
    const sizeOptions = {
      "s": 400,
      "m": 800,
      "l": 1600,
      "v": 3000,
      "n": 6000,
      "r": 12000,
      "no": 30000 
    }

    if (!body || !body.url || !body.size || !sizeOptions[body.size]) return ctx.redirect("/");

    const size = sizeOptions[body.size];

    const generateQR = async text => {
      try {
        return await QRCode.toDataURL(text, { errorCorrectionLevel: 'M', width: size })
      } catch (err) {
        console.error(err);
        return ctx.redirect("/");
      }
    }

    ctx.render("generate.pug", {
      qr: await generateQR(body.url)
    });
  })

  router.get("/humans.txt", async (ctx) => {
    ctx.body = "Made by Zachary Montgomery for Allusian.";
  });
}
