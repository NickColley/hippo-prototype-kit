import { existsSync, writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { LAYOUTS_DIR, BUFFER_DIR } from "./constants.js";

// To get Nunjucks to process the file using a constructed throwaway temporary file.
// Since when you try to render a string with Nunjucks it wont take into account template inheritance.
export default function createNunjucksFileToRender(fileContents, layoutName) {
  // Grab template to put our plain text content into.
  const template = readFileSync(LAYOUTS_DIR + layoutName, "utf-8");
  const filledTemplate = template.replace("{{ contents }}", fileContents);

  // Create buffer directory if it doesnt already exist.
  if (!existsSync(BUFFER_DIR)) {
    mkdirSync(BUFFER_DIR);
  }
  // Create a buffer file to process
  const fileHash = createHash("md5").update(fileContents).digest("hex");
  const bufferFileName = fileHash + ".njk";
  writeFileSync(BUFFER_DIR + bufferFileName, filledTemplate);
  return bufferFileName;
}
