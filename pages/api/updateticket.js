import * as uuid from "uuid";
import dynamoDb from "../../lib/dynamo-db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { Attributes } = await dynamoDb.update({
      Key: {
        eventId: req.body.eventId,
      },
      UpdateExpression: "SET tickets = :newtickets",
      ExpressionAttributeValues: {
        ":newtickets": req.body.tickets,
      },
      ReturnValues: "ALL_NEW",
    });

    res.status(200).json(Attributes);
  }
}
