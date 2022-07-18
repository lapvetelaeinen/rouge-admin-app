const FunctionCard = ({ task, icon }) => {
  return (
    <div className="flex flex-col items-center text-center bg-neutral-300 mr-4">
      <p>{task}</p>
    </div>
  );
};
export default FunctionCard;
