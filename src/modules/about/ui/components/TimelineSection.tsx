import { milestonesData, icons } from "../../data/aboutData";

export default function TimelineSection() {
  return (
    <section className="mb-20 md:mb-24 lg:mb-28 max-w-6xl mx-auto px-4">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          مسیر تحول ما
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          از ایده تا پلتفرم پیشرو
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-200 via-purple-300 to-purple-400 hidden lg:block"></div>
        <div className="absolute left-6 md:left-8 h-full w-0.5 bg-gradient-to-b from-purple-200 via-purple-300 to-purple-400 lg:hidden"></div>

        <div className="space-y-12 lg:space-y-0">
          {milestonesData.map((milestone, index) => {
            const IconComponent = icons[milestone.iconName];
            return (
              <div
                key={index}
                className={`relative lg:flex lg:items-center lg:justify-between ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div className="absolute left-6 md:left-8 lg:left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-purple-500 rounded-full z-10"></div>

                <div
                  className={`ml-12 md:ml-16 lg:ml-0 lg:w-[45%] ${
                    index % 2 === 0 ? "lg:pr-12" : "lg:pl-12"
                  }`}
                >
                  <div className="bg-white border border-purple-100 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 cursor-default">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="flex-shrink-0 p-2 md:p-3 bg-amber-100 text-purple-600 rounded-lg md:rounded-xl">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                          <span className="text-base md:text-lg font-bold text-gray-700">
                            {milestone.year}
                          </span>
                          <span className="text-xs md:text-sm font-medium px-2 md:px-3 py-1 bg-purple-50 text-purple-600 rounded-full">
                            {milestone.title}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs md:text-sm">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block lg:w-[45%]"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}