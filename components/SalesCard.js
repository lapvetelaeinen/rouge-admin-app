const SalesCard = ({ type, tickets, cash }) => {
  return (
    <div className="bg-neutral-100 w-[90vw] py-4 rounded-lg shadow-xl pt-10 pb-14">
      <div className="text-center text-2xl mb-4 text-neutral-800">{type}</div>
      <div className="text-center flex justify-center relative items-center text-center">
        <p className="w-full text-neutral-600 text-xl">{tickets}</p>
        <div className="absolute left-[50%] text-4xl font-thin text-neutral-300">
          |
        </div>
        <p className="w-full text-neutral-600 text-xl">{cash}</p>
      </div>
    </div>
  );
};
export default SalesCard;
