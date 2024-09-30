"use client";

// @ts-expect-error qrcode is not typed, and would be a pain to type. In the future, it might make sense to separate the QR code generation into a separate service.
import QRCode from "qrcode";
import { useState } from "react";

import Joi from "joi";

import Image from "next/image";
import Link from "next/link";

export default function GenerationForm() {
  const errorCorrectionOptions = {
    l: "L",
    m: "M",
    q: "Q",
    h: "H",
  };
  const colorOptions = {
    "Black on White": "#ffffff",
    "Black on Transparent": "#0000",
  };

  const [text, setText] = useState("");
  const [size, setSize] = useState("");
  const [errorCorrection, setErrorCorrection] = useState("m");
  const [color, setColor] = useState("w");
  const [margin, setMargin] = useState("0");
  const [qrCode, setQrCode] = useState(null);

  // Errors
  const [textError, setTextError] = useState("");
  const [sizeError, setSizeError] = useState("");
  const [marginError, setMarginError] = useState("");

  const schema = Joi.object({
    url: Joi.string().uri().required(),
  });

  const generateQR = async (width: number) => {
    try {
      return await QRCode.toDataURL(text, {
        errorCorrectionLevel: errorCorrection,
        width: width,
        color: { light: colorOptions[color as keyof typeof colorOptions] },
        margin: margin,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Form */}
      {!qrCode && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setTextError("");
            setMarginError("");

            if (!text) {
              setTextError("Please enter a URL");
              return;
            }

            const { error } = schema.validate({ url: text });
            if (error) {
              setTextError("Please enter a valid URL");
              return;
            }

            if (!margin || isNaN(parseInt(margin))) {
              setMarginError("Please enter a number");
              return;
            }

            if (!size || isNaN(parseInt(size))) {
              setSizeError("Please enter a number");
              return;
            }

            setQrCode(await generateQR(parseInt(size)));
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col">
            <label htmlFor="text" className="text-sm">
              Text
            </label>

            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              id="text"
              className="border border-gray-300 rounded-md p-2 w-full"
            />

            <span className="text-sm font-bold text-red-700">{textError}</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="size" className="text-sm">
              Size
            </label>

            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              id="size"
              className="border border-gray-300 rounded-md p-2 w-full"
              list="sizes"
            />
            <datalist id="sizes">
              <option value="100" />
              <option value="200" />
              <option value="300" />
              <option value="400" />
              <option value="500" />
              <option value="600" />
              <option value="700" />
              <option value="800" />
              <option value="900" />
              <option value="1000" />
            </datalist>
            <span className="text-sm font-bold text-red-700">{sizeError}</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="color" className="text-sm">
              Color
            </label>

            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              id="color"
              className="border border-gray-300 bg-white rounded-md p-2 w-full cursor-pointer"
            >
              {Object.keys(colorOptions).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="margin" className="text-sm">
              Margin
            </label>

            <input
              type="text"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              id="margin"
              className="border border-gray-300 rounded-md p-2 w-full"
            />

            <span className="text-sm font-bold text-red-700">
              {marginError}
            </span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="errorCorrection" className="text-sm">
              Error Correction
            </label>

            <select
              value={errorCorrection}
              onChange={(e) => setErrorCorrection(e.target.value)}
              id="errorCorrection"
              className="border border-gray-300 bg-white rounded-md p-2 w-full cursor-pointer"
            >
              {Object.keys(errorCorrectionOptions).map((key) => (
                <option key={key} value={key}>
                  {
                    errorCorrectionOptions[
                      key as keyof typeof errorCorrectionOptions
                    ]
                  }
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-amber-700 text-amber-50/90 hover:text-amber-50 transition w-max px-4 p-2 rounded-md"
          >
            Generate QR Code
          </button>
        </form>
      )}

      {/* QR Code */}
      {qrCode && (
        <div>
          <div className="flex flex-col items-center gap-2">
            <Image
              alt={`QR code pointing to ${text}`}
              src={qrCode}
              width={parseInt(size)}
              height={parseInt(size)}
            />
            <span className="text-center text-sm text-amber-950/80">
              Points to{" "}
              <Link
                href={text}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-950 transition"
              >
                {text}
              </Link>
            </span>
          </div>

          <div className="mt-4 flex flex-col-reverse md:flex-row gap-x-4 gap-y-2">
            <button
              onClick={() => setQrCode(null)}
              className="bg-gray-700 text-gray-50/90 hover:text-gray-50 transition flex-1 px-4 p-2 rounded-md"
            >
              Go Back
            </button>
            {/* Download */}
            <a
              href={qrCode}
              download="qr-code.png"
              className="bg-amber-700 text-amber-50/90 hover:text-amber-50 transition flex-1 px-4 p-2 rounded-md text-center"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
