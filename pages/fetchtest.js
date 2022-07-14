import { fetchData, putData } from "../AwsFunctions";

export default function FetchTest() {
  const fetchDataFormDynamoDb = () => {
    fetchData("events");
  };

  const addDataToDynamoDB = async () => {
    const userData = {
      eventId: "200",
    };

    await putData("events", userData);
  };

  return (
    <>
      <button onClick={() => fetchDataFormDynamoDb()} className="bg-red-400">
        {" "}
        Fetch{" "}
      </button>

      <button onClick={() => addDataToDynamoDB()} className="bg-pink-400">
        {" "}
        Put{" "}
      </button>
    </>
  );
}
