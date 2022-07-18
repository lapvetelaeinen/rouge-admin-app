const SalesCard = ({ type, tickets, cash }) => {
  return (
    <div className="bg-neutral-100 mr-4 w-[150px] py-4 rounded-lg shadow-xl">
      <div className="text-center text-xl mb-4 text-neutral-800">{type}</div>
      <div className="text-center flex justify-center relative items-center">
        <p className="absolute left-3 text-neutral-600">{tickets}</p>
        <div className="text-4xl font-thin text-neutral-300">|</div>
        <p className="absolute right-3 text-neutral-600">{cash}</p>
      </div>
    </div>
  );
};
export default SalesCard;
