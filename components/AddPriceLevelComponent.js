import { useForm } from "react-hook-form";

export default function AddPriceLevelComponent() {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const addToStair = () => {
    const price = watch("");
    console.log(data);
  };

  return (
    <div className="min-h-[100px] bg-neutral-100 drop-shadow-2xl shadow-inner mt-2 pt-4 pb-4 text-center rounded-lg">
      <p className="text-xl">Höj priset till</p>

      <input
        autoComplete="off"
        className="py-2 mt-2 text-center text-2xl bg-neutral-100"
        type="number"
        placeholder="Ange pris"
        {...register("price2", { required: true, maxLength: 80 })}
      />
      <p className="text-xl mt-4">När x antal biljetter sålts</p>

      <input
        autoComplete="off"
        className="py-2 mt-2 text-center text-2xl bg-neutral-100"
        type="number"
        placeholder="Ange antal"
        {...register("amount2", { required: true, maxLength: 80 })}
      />
      <div className="flex px-8 gap-4 mt-4">
        <div className="py-4 flex-1 bg-red-200">Avbryt</div>
        <div
          onClick={() => console.log(watch("price2"))}
          className="py-4 flex-1 bg-green-200"
        >
          Ok
        </div>
      </div>
    </div>
  );
}
