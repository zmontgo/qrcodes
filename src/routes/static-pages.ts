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
    }
    const errorCorrectionOptions = {
      "l": "L",
      "m": "M",
      "q": "Q",
      "h": "H",
    }
    const colorOptions = {
      "w": "#ffffff",
      "t": "#0000"
    }

    if (!body || !body.url || !body.size || !sizeOptions[body.size] || !body.error || !errorCorrectionOptions[body.error] || !body.color || !colorOptions[body.color] || !body.margin || isNaN(parseInt(body.margin))) return ctx.redirect("/");

    const size = sizeOptions[body.size];
    const errorCorrection = errorCorrectionOptions[body.error];

    const generateQR = async text => {
      try {
        return await QRCode.toDataURL(text, { errorCorrectionLevel: errorCorrection, width: size, color: { light: colorOptions[body.color] }, margin: parseInt(body.margin) });
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
