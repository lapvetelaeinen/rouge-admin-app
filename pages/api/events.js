import { RolesAnywhere } from "aws-sdk";
import * as uuid from "uuid";
import dynamoDb from "../../lib/dynamo-db";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const item = {
      eventId: uuid.v4(),
      title: req.body.title,
      image: req.body.image,
      date: req.body.date,
      description: req.body.description,
      createdAt: Date.now(),
    };

    await dynamoDb.put({
      Item: item,
    });

    res.status(201).json(item);
  }

  if (req.method === "GET") {
    const { Items } = await dynamoDb.scan({ TableName: "events" });

    res.status(200).json(Items);

    console.log(Items);
  }

  if (req.method === "POST") {
    const { Attributes } = await dynamoDb.update({
      Key: {
        id: req.body.id,
      },
      UpdateExpression: "SET content = :content",
      ExpressionAttributeValues: {
        ":content": req.body.content || null,
      },
      ReturnValues: "ALL_NEW",
    });

    res.status(200).json(Attributes);
  }

  if (req.method === "DELETE") {
    await dynamoDb.delete({
      Key: {
        id: req.query.id,
      },
    });

    res.status(204).json({});
  }
}
