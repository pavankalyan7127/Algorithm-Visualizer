import express from "express"
import cors from "cors"
import multer from "multer"
import sendData from "./response.js"
import compareData from "./compare.js"
import chatbox from "./chat.js"

const app = express()

app.use(cors())
app.use(express.json())

const upload = multer({ dest: "uploads/" })

let latestVisualizationData = null
let latestCompareData = null

app.post("/api/response", upload.single("image"), async (req, res) => {
  console.log("Request received from frontend")
  try {
    const algorithm = req.body.algorithm
    const image = req.file

    const data = await sendData(algorithm, image)
    latestVisualizationData = data
    latestCompareData = null

    return res.json(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to fetch response from backend." })
  }
})

app.post("/api/compare", upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }]), async (req, res) => {
  console.log("Compare Request received from frontend")
  try {
    const algorithm1 = req.body.algorithm1
    const image1 = req.files && req.files["image1"] ? req.files["image1"][0] : null
    
    const algorithm2 = req.body.algorithm2
    const image2 = req.files && req.files["image2"] ? req.files["image2"][0] : null

    // Send both inputs at once to n8n
    const rawData = await compareData(algorithm1, image1, algorithm2, image2)

    // Extract the separated structures from the returned N8n JSON array
    const data1 = rawData[0].algorithm1
    const data2 = rawData[0].algorithm2

    const compareDataResult = { data1, data2 }
    latestCompareData = compareDataResult
    latestVisualizationData = null

    return res.json(compareDataResult)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Failed to fetch compare response from backend." })
  }
})

app.post("/api/chat", async (req, res) => {
  try {
    const { stepIndex, question, algoIndex } = req.body

    let vizData = latestVisualizationData
    if (latestCompareData) {
      if (algoIndex === 2) {
        vizData = latestCompareData.data2
      } else {
        vizData = latestCompareData.data1
      }
    }

    if (!vizData) {
      return res.status(400).json({ error: "Visualization data not available." })
    }

    const data = await chatbox(
      vizData,
      stepIndex,
      question
    )

    return res.json(data)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Chatbot failed." })
  }
})

app.listen(4000, () => {
  console.log("Server started on port 4000")
})