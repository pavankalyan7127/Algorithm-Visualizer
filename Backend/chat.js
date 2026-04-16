import fetch from "node-fetch";

function cleanAiText(raw) {

  if (!raw) return "";

  return raw
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*•]\s+/gm, "")
    .replace(/(\*\*|__|\*|_)/g, "")
    .replace(/`/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

}

function deepCleanStrings(value) {

  if (typeof value === "string") {
    return cleanAiText(value);
  }

  if (Array.isArray(value)) {
    return value.map(deepCleanStrings);
  }

  if (value && typeof value === "object") {
    const cleaned = {};
    for (const [key, val] of Object.entries(value)) {
      cleaned[key] = deepCleanStrings(val);
    }
    return cleaned;
  }

  return value;

}

export default async function chatbox(visualizationData, stepIndex, question) {

  try {

    console.log("Chat request received");

    const payload = {
      sessionId: "main-user",
      mode: "chat",
      visualData: visualizationData,
      SI: stepIndex,
      Q: question
    };

    console.log(
      "Chat payload being sent to n8n:",
      JSON.stringify(payload, null, 2)
    );

    const response = await fetch(
      "https://n8n-nnim.onrender.com/webhook-test/d4bc903d-1552-4521-b909-d8415442bab8",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(
        `Chat webhook error: ${response.status} ${response.statusText} ${text}`
      );
      throw new Error(
        `Chat webhook error: ${response.status} ${response.statusText}`
      );
    }

    let rawData = await response.json();
    if (Array.isArray(rawData) && rawData.length > 0) {
      rawData = rawData[0];
    }

    const data = deepCleanStrings(rawData);

    console.log("Chat response from n8n (cleaned):", JSON.stringify(data));

    return data;

  } catch (error) {

    console.error("Chat Error:", error);
    throw error;

  }

}