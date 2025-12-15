import { valuesData, icons } from "../../data/aboutData";

export default function ValuesSection() {
  return (
    <section className="mb-16 md:mb-20 lg:mb-24 max-w-6xl mx-auto px-4">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          ارزش‌های بنیادین ما
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
          چهار ستونی که مد کالکشن بر آنها استوار است
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {valuesData.map((value, index) => {
          const IconComponent = icons[value.iconName];
          return (
            <div
              key={index}
              className="group p-4 md:p-6 border border-gray-100 rounded-xl md:rounded-2xl hover:border-purple-200 hover:shadow-lg transition-all duration-300 bg-white cursor-default"
            >
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div
                  className={`p-2 ${value.bgColor} ${value.iconColor} rounded-lg md:rounded-xl group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base group-hover:text-purple-600 transition-colors">
                  {value.title}
                </h3>
              </div>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
