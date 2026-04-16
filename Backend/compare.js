import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";

export default async function compareData(algorithm1, image1, algorithm2, image2) {
  try {
    const formData = new FormData();
    formData.append("algorithm1", algorithm1);
    formData.append("algorithm2", algorithm2);
    formData.append("mode", "compare");

    if (image1) {
      formData.append("image1", fs.createReadStream(image1.path), {
        filename: image1.originalname,
        contentType: image1.mimetype,
      });
    }

    if (image2) {
      formData.append("image2", fs.createReadStream(image2.path), {
        filename: image2.originalname,
        contentType: image2.mimetype,
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
    console.log("Raw response from n8n (compare):", rawText.substring(0, 200) + "...");
    
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("Failed to parse JSON. Raw text was:", rawText);
      throw e;
    }

    return data;
  } catch (error) {
    console.error("Error connecting to n8n Webhook:", error);
    throw error;
  }
}
