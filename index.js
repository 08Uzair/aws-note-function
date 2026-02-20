import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand ,ScanCommand} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "ap-south-2",
});

const ddbDocClient = DynamoDBDocumentClient.from(client);
const DBName = "noteDB"
const app = express();
const PORT = 8083;
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// GET ALL NOTES

app.get("/notes", async (req, res) => {
  try {
    const params = {
      TableName: DBName,
    };

    const data = await ddbDocClient.send(new ScanCommand(params));

    return res.status(200).json({
      message: "Notes fetched successfully",
      count: data.Items ? data.Items.length : 0,
      notes: data.Items || [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// DELETE

app.delete("/notes/:note_id", async (req, res) => {
  try {
    const { note_id } = req.params;

    if (!note_id) {
      return res.status(400).json({ message: "note_id is required" });
    }

    const params = {
      TableName: DBName,
      Key: { note_id },
    };

    await ddbDocClient.send(new DeleteCommand(params));

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT : ${PORT}`);
});

