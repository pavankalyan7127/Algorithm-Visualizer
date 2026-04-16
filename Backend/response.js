import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";
import path from "path";

export default async function sendData(algorithm, image) {
  try {
    const formData = new FormData();

    // send algorithm text
    formData.append("algorithm", algorithm);

    if (image) {
      const filePath = image.path;
      const fileName = image.originalname || path.basename(filePath);

      // determine mime type from extension
      let mimeType = "image/png";
      if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) mimeType = "image/jpeg";
      if (fileName.endsWith(".svg")) mimeType = "image/svg+xml";

      formData.append("image", fs.createReadStream(filePath), {
        filename: fileName,
        contentType: mimeType,
      });
    }

    const response = await fetch(
      "https://n8n-nnim.onrender.com/webhook-test/d4bc903d-1552-4521-b909-d8415442bab8",
      {
        method: "POST",
        headers: formData.getHeaders(),
        body: formData,
      }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        `Upstream webhook error: ${response.status} ${response.statusText} ${text}`
      );
    }

    const rawText = await response.text();
    console.log("Raw response from n8n:", rawText);
    
    let data;
    try {
      data = JSON.parse(rawText);
      // N8N often wraps the response in an array, unwrap it if it exists
      if (Array.isArray(data) && data.length > 0) {
        data = data[0];
      }
    } catch (e) {
      console.error("Failed to parse JSON. Raw text was:", rawText);
      throw e;
    }

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}