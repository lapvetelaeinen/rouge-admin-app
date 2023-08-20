export default function RougeButton({ type, text, action }) {
  return (
    <button
      className={`${
        type === "main"
          ? "bg-purple-500 text-white"
          : "bg-transparent border-2 border-neutral-800 text-neutral-800"
      }  py-4 px-12 text-2xl  rounded-full w-full`}
      onClick={action}
    >
      {text}
    </button>
  );
}
