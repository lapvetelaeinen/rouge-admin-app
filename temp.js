const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

async function putItem(params) {
  try {
    const data = await docClient.put(params).promise();
    return data;
  } catch (err) {
    return err;
  }
}

exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  console.log("hmmm: ", body.type);

  if (body.type === "createEvent") {
    const { event } = body;

    const putParams = {
      TableName: "rouge-events",
      Item: {
        pk: event.eventName,
        sk: event.date.split("T")[0],
        info: event.info,
      },
    };

    try {
      await putItem(putParams);

      const response = {
        statusCode: 200,
        body: JSON.stringify("Event successfully created"),
      };
      return response;
    } catch (error) {
      const response = {
        statusCode: 502,
        body: JSON.stringify({ message: error }),
      };
      return response;
    }
  }

  console.log("THIS IS THE BODY: ", body);

  const response = {
    statusCode: 200,
    body: JSON.stringify("Add event to db"),
  };
  return response;
};
