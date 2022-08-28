import dynamoDb from "../../lib/dynamo-db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { Attributes } = await dynamoDb.update({
      Key: {
        eventId: req.body.eventId,
      },
      UpdateExpression:
        "SET title = :newtitle, description = :newdescription, date = :newdate",
      ExpressionAttributeValues: {
        ":newtitle": req.body.title,
        ":newdescription": req.body.description,
        ":newdate": req.body.date,
      },
      ReturnValues: "ALL_NEW",
    });

    res.status(200).json(Attributes);
  }
}
