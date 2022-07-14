import dynamoDb from "./lib/dynamo-db.js";

export const fetchData = (tableName) => {
  var params = {
    TableName: tableName,
  };

  dynamoDb.get(params, function (err, data) {
    if (!err) {
      console.log(data);
    } else {
      console.log(err);
    }
  });
};

export const putData = (tableName, data) => {
  var params = {
    TableName: tableName,
    Item: data,
  };

  dynamoDb.put(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
};
