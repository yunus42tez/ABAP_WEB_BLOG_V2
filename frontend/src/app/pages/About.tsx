import { Code, Users, BookOpen, Target, GraduationCap, Briefcase } from 'lucide-react';
import { SEO } from '@/app/components/SEO';

export function About() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <SEO
        title="About Yunus Tez"
        description="Learn more about Yunus Tez, an ABAP Developer and lifelong learner. Discover his journey, academic background, and mission to share SAP knowledge."
        keywords="Yunus Tez, About Yunus Tez, ABAP Developer, SAP Career"
      />

      <div className="max-w-[1400px] mx-auto px-6 py-12 animate-fade-in">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold text-[#32363a] mb-3">Yunus Tez</h1>
          <p className="text-lg text-[#6a6d70]">
            ABAP Developer & Lifelong Learner
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#d9d9d9] rounded p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-lg text-[#32363a] mb-6 font-light leading-relaxed">
                Hello, I’m Yunus Tez. This blog is a record of my career journey and my ongoing adventure of learning new things. Born in 1999, I set out on this path with the belief that different disciplines nourish and strengthen one another. Since 2024, I have been working as an ABAP developer.
              </p>

              <h2 className="text-2xl font-semibold text-[#32363a] mb-4 border-t pt-6">
                Why This Blog?
              </h2>
              <p className="text-[#6a6d70] mb-4">
                I created this platform with two main goals in mind:
              </p>
              <ul className="space-y-4 text-[#6a6d70]">
                <li className="flex items-start gap-3 group">
                  <span className="w-2 h-2 bg-[#0A6ED1] rounded-full mt-2 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                  <div>
                    <strong className="text-[#32363a]">A Personal Notebook:</strong>
                    <p>SAP ABAP is a constantly evolving and deep ocean. This blog serves as my personal learning journal where I document new techniques I’ve learned, challenges I’ve faced, solutions I’ve found, and those moments when I think, “I wish I had known this earlier.”</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 group">
                  <span className="w-2 h-2 bg-[#0A6ED1] rounded-full mt-2 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                  <div>
                    <strong className="text-[#32363a]">Helping Others:</strong>
                    <p>Knowledge grows when it is shared. My aim is to provide a resource for anyone who is following a similar path, just starting their SAP ABAP career, or looking to improve themselves in this field. If my experiences can help someone solve a problem more quickly, then this blog has achieved its purpose.</p>
                  </div>
                </li>
              </ul>
              <p className="mt-6 text-[#6a6d70]">
                Thank you for joining me on this learning journey. I hope the content here sheds light on your own path as well.
              </p>
            </div>

            <div className="bg-white border border-[#d9d9d9] rounded p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-2xl font-semibold text-[#32363a] mb-4">
                Academic Background: Management and Technology
              </h2>
              <p className="text-[#6a6d70]">
                My educational journey began with a degree in Public Administration from Manisa Celal Bayar University. The knowledge I gained in this field provided me with a strong analytical foundation in understanding how organizations operate, how business processes are managed, and how efficiency is achieved.
              </p>
              <p className="mt-4 text-[#6a6d70]">
                However, my deep interest in technology and software pushed me to develop myself further in this area as well. I transformed this passion into technical expertise by completing an ERP bootcamp at Smartpro and graduating from the Computer Programming program at Anadolu University’s Open Education Faculty.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-[#d9d9d9] rounded p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
              <div className="flex items-center gap-4">
                <Briefcase className="w-10 h-10 text-[#0A6ED1] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" />
                <div>
                  <div className="text-lg font-semibold text-[#32363a]">Current Role</div>
                  <div className="text-sm text-[#6a6d70]">ABAP Developer</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#d9d9d9] rounded p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
              <div className="flex items-center gap-4">
                <GraduationCap className="w-10 h-10 text-[#0A6ED1] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300" />
                <div>
                  <div className="text-lg font-semibold text-[#32363a]">Education</div>
                  <div className="text-sm text-[#6a6d70]">Public Admin. & Comp. Prog.</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#d9d9d9] rounded p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
              <div className="flex items-center gap-4">
                <Target className="w-10 h-10 text-[#0A6ED1] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" />
                <div>
                  <div className="text-lg font-semibold text-[#32363a]">Focus Areas</div>
                  <div className="text-sm text-[#6a6d70]">ABAP, SAP BTP, Cloud</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
