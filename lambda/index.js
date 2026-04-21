const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

const TABLE = process.env.TABLE_NAME || "todo-tasks";

const response = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  },
  body: JSON.stringify(body),
});

exports.handler = async (event) => {
  const method = event.httpMethod;
  const path = event.path || "";
  const id = event.pathParameters?.id;

  // Handle CORS preflight
  if (method === "OPTIONS") return response(200, {});

  try {
    // ── GET /tasks ──────────────────────────────────────────
    if (method === "GET" && path.endsWith("/tasks")) {
      const result = await db.send(new ScanCommand({ TableName: TABLE }));
      const items = (result.Items || []).sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      );
      return response(200, items);
    }

    // ── GET /tasks/{id} ─────────────────────────────────────
    if (method === "GET" && id) {
      const result = await db.send(
        new GetCommand({ TableName: TABLE, Key: { id } })
      );
      if (!result.Item) return response(404, { message: "Tarefa não encontrada" });
      return response(200, result.Item);
    }

    // ── POST /tasks ─────────────────────────────────────────
    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");
      if (!body.text?.trim())
        return response(400, { message: "O campo 'text' é obrigatório" });

      const item = {
        id: randomUUID(),
        text: body.text.trim(),
        done: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.send(new PutCommand({ TableName: TABLE, Item: item }));
      return response(201, item);
    }

    // ── PUT /tasks/{id} ─────────────────────────────────────
    if (method === "PUT" && id) {
      const body = JSON.parse(event.body || "{}");
      const fields = [];
      const values = {};
      const names = {};

      if (body.text !== undefined) {
        fields.push("#txt = :text");
        names["#txt"] = "text";
        values[":text"] = body.text.trim();
      }

      if (body.done !== undefined) {
        fields.push("done = :done");
        values[":done"] = Boolean(body.done);
      }

      if (!fields.length)
        return response(400, { message: "Nenhum campo para atualizar" });

      fields.push("updatedAt = :updatedAt");
      values[":updatedAt"] = new Date().toISOString();

      const result = await db.send(
        new UpdateCommand({
          TableName: TABLE,
          Key: { id },
          UpdateExpression: `SET ${fields.join(", ")}`,
          ExpressionAttributeValues: values,
          ...(Object.keys(names).length && { ExpressionAttributeNames: names }),
          ConditionExpression: "attribute_exists(id)",
          ReturnValues: "ALL_NEW",
        })
      );

      return response(200, result.Attributes);
    }

    // ── DELETE /tasks/{id} ──────────────────────────────────
    if (method === "DELETE" && id) {
      await db.send(
        new DeleteCommand({
          TableName: TABLE,
          Key: { id },
          ConditionExpression: "attribute_exists(id)",
        })
      );
      return response(200, { message: "Tarefa removida com sucesso" });
    }

    return response(404, { message: "Rota não encontrada" });
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException")
      return response(404, { message: "Tarefa não encontrada" });

    console.error("Erro:", err);
    return response(500, { message: "Erro interno do servidor" });
  }
};
