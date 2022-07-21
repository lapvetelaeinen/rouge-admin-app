import * as uuid from "uuid";
import dynamoDb from "../../lib/dynamo-db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { Attributes } = await dynamoDb.update({
      Key: {
        eventId: "a0f5d69a-6ced-439f-89a2-b0449794a3fe",
      },
      UpdateExpression: "SET tickets = list_append(tickets, :newtickets)",
      ExpressionAttributeValues: {
        ":newtickets": [{ class: "student", price: 50, amount: 50 }],
      },
      ReturnValues: "ALL_NEW",
    });

    res.status(200).json(Attributes);
  }
}
