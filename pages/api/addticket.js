import * as uuid from "uuid";
import dynamoDb from "../../lib/dynamo-db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { Attributes } = await dynamoDb.update({
      Key: {
        eventId: req.body.ticket[0].eventId,
      },
      UpdateExpression: "SET tickets = list_append(tickets, :newtickets)",
      ExpressionAttributeValues: {
        ":newtickets": [
          {
            class: req.body.ticket[0].class,
            price: req.body.ticket[0].price,
            amount: req.body.ticket[0].amount,
          },
        ],
      },
      ReturnValues: "ALL_NEW",
    });

    res.status(200).json(Attributes);
  }
}
