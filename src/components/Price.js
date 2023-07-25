export default function Price({ price, description, icon }) {
    return (
      <div className="py-6 px-3 bg-white rounded-xl shadow-lg flex items-center justify-initial gap-2">
        <div className="basis-1/4">
          <img className="h-14 w-14 mx-auto" src={icon} alt="Energy Symbol"></img>
        </div>
        <div className="basis-3/4">
          <div className="text-xl font-medium text-black">{description}</div>
            <p className="text-slate-500 font-bold">{price}</p>
        </div>
      </div>
    );
  }