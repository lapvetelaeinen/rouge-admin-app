import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const addEvent = async (params) => {
  await axios.put("/api/item", params);
};

// Learn more about using SWR to fetch data from
// your API routes -> https://swr.vercel.app/
export default function Events() {
  const { data, error } = useSWR("/api/events", fetcher);

  if (error) return "An error has occurred.";
  if (!data) return "Loading...";
  console.log(error);

  return (
    <>
      <p>{JSON.stringify(data, null, 2)}</p>
      <button
        className="p-4 bg-violet-300 rounded-md shadow-lg"
        onClick={() => addEvent({ title: "hooja" })}
      >
        Add event
      </button>
    </>
  );
}
