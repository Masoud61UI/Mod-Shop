import { UsersIcon } from "lucide-react";
import { teamMembersData } from "../../data/aboutData";

export default function TeamSection() {
  return (
    <section className="mb-22 md:mb-30 lg:mb-38">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium mb-4">
            <UsersIcon className="h-4 w-4" />
            تیم حرفه‌ای
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            مغزهای متفکر مد کالکشن
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-base">
            متخصصانی که پشت هر تجربه خرید بی‌نقص ما هستند
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {teamMembersData.map((member, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white rounded-2xl md:rounded-3xl border border-gray-100 p-6 md:p-8 hover:border-purple-200 hover:shadow-lg transition-all duration-500 cursor-default"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-transparent opacity-60 rounded-full -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-700"></div>
              <div className="absolute top-4 right-4 text-5xl md:text-6xl font-bold text-gray-50 z-0">
                0{index + 1}
              </div>

              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
                    {member.name}
                  </h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 text-purple-600 rounded-full text-sm font-semibold border border-purple-200">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    {member.role}
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-purple-50 group-hover:border-purple-100 transition-colors">
                  <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed">
                    {member.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-px bg-purple-300"></div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      حوزه‌های تخصصی
                    </span>
                    <div className="w-6 h-px bg-purple-300"></div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {member.expertise.split(" • ").map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all duration-300 group-hover:shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-11 md:mt-15">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <div className="w-20 h-px bg-gray-200"></div>
            <span>تیم ما همچنان در حال گسترش است</span>
            <div className="w-20 h-px bg-gray-200"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
