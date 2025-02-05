import { decodeBase64 } from "./base64.ts";
import { init as canvasKitInit } from "./canvaskit.ts";
import { CanvasKit } from "./types.ts";

let canvas: CanvasKit;

export async function init(options?: any): Promise<CanvasKit> {
  if (canvas) return canvas;
  canvas = await canvasKitInit(options);
  return canvas;
}

export function dataURLtoFile(dataurl: string) {
  let arr: string[] = dataurl.split(",");
  return decodeBase64(arr[1]);
}

export async function loadImage(url: string | Uint8Array) {
  let data;

  if (url instanceof Uint8Array) {
    data = url;
  } else if (typeof url === "string") {  // Eğer url bir string ise işlem yap
    if (url.startsWith("http")) {
      data = await fetch(url)
        .then((response) => response.arrayBuffer())
        .then((buffer) => new Uint8Array(buffer));
    } else if (url.startsWith("data")) {
      data = dataURLtoFile(url);
    } else {
      try {
        data = await Deno.readFile(url);
      } catch (error) {
        throw new Error(`File read error: ${error.message}`);
      }
    }
  } else {
    throw new TypeError(`Invalid URL type: ${typeof url}`);
  }

  if (!data) {
    throw new Error("Failed to load image data.");
  }

  const img = canvas.MakeImageFromEncoded(data);
  if (!img) throw new Error("Invalid image data.");

  return img;
}


export const createCanvas = (width: number, height: number) => {
  return canvas.MakeCanvas(width, height);
};

export * from "./types.ts";
export * from "./base64.ts";
