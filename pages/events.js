import useSWR from "swr";
import axios from "axios";
import React, { useEffect } from "react";
import EventCard from "../components/EventCard";

const fetcher = (url) => axios.get(url).then((res) => res.data);

// Learn more about using SWR to fetch data from
// your API routes -> https://swr.vercel.app/
export default function Events() {
  const { data, error } = useSWR("/api/events", fetcher);

  //   useEffect(() => {
  //     const fetchPostsFromApi = async () => {
  //       const allPosts = await API.graphql({ query: listPosts });

  //       if (allPosts.data) {
  //         setPosts(allPosts.data.listPosts.items);
  //         return allPosts.data.listPosts.items;
  //       }
  //       throw new Error("Could not get posts");
  //     };

  //     fetchPostsFromApi();
  //   }, []);

  if (error) return "An error has occurred.";
  if (!data) return "Loading...";
  console.log(error);

  return (
    <>
      {data.map((event) => (
        <EventCard key={event.eventId} id={event.eventId} event={event} />
      ))}
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
