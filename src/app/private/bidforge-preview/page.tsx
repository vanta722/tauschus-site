import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BidForge Private Preview",
  description:
    "Private preview for BidForge Build My Bid, a contractor bid draft workflow.",
  robots: {
    index: false,
    follow: false,
  },
};

const scopeItems = [
  "Remove existing cracked driveway concrete.",
  "Haul away broken concrete and debris.",
  "Prepare and compact base as needed.",
  "Set forms for a 600 sq ft driveway area.",
  "Install reinforcement if included after site check.",
  "Pour and broom finish new concrete.",
  "Clean work area after the pour is complete.",
];

const questions = [
  "Would you actually send this to a customer?",
  "What would you change first?",
  "How long would this normally take you to write?",
  "Would this help you respond before another contractor does?",
];

export default function BidForgePrivatePreview() {
  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#16130f]">
      <section className="border-b border-[#d7d0c4] bg-[#25211b] text-[#fffaf0]">
        <div className="mx-auto grid min-h-[88vh] max-w-7xl gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded border border-[#c69a54]/60 bg-[#c69a54]/12 px-3 py-2 text-xs font-bold uppercase text-[#f2d7a6]">
                Private contractor preview
              </div>
              <p className="mb-3 text-sm font-bold uppercase text-[#c69a54]">
                BidForge
              </p>
              <h1 className="max-w-2xl text-5xl font-black leading-[0.96] sm:text-6xl lg:text-7xl">
                Turn messy job notes into a clean bid draft.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#ddd3c1]">
                Built for concrete, driveway, apron, patio, walkway, and small
                slab work. The goal is simple: help contractors get a clean bid
                in front of the customer faster.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded border border-white/12 bg-white/7 p-4">
                <p className="text-2xl font-black text-white">5 min</p>
                <p className="mt-1 text-sm text-[#d8cab5]">target draft time</p>
              </div>
              <div className="rounded border border-white/12 bg-white/7 p-4">
                <p className="text-2xl font-black text-white">Edit</p>
                <p className="mt-1 text-sm text-[#d8cab5]">before sending</p>
              </div>
              <div className="rounded border border-white/12 bg-white/7 p-4">
                <p className="text-2xl font-black text-white">Text</p>
                <p className="mt-1 text-sm text-[#d8cab5]">or email ready</p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded border border-[#d8c7aa]/40 bg-[#fffaf0] p-3 shadow-2xl shadow-black/30">
              <div className="rounded border border-[#d6cec0] bg-[#f7f1e8] p-3 text-[#201b15]">
                <div className="mb-3 flex items-center justify-between border-b border-[#d6cec0] pb-3">
                  <div>
                    <p className="text-xs font-black uppercase text-[#8b6537]">
                      BidForge
                    </p>
                    <p className="text-lg font-black">Build My Bid</p>
                  </div>
                  <span className="rounded border border-[#2f6e55]/30 bg-[#eaf5ef] px-3 py-2 text-xs font-bold text-[#2f6e55]">
                    Preview
                  </span>
                </div>

                <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded border border-[#d8d0c4] bg-white p-3">
                    <p className="text-xs font-bold uppercase text-[#8b6537]">
                      Job notes
                    </p>
                    <div className="mt-3 rounded border border-[#ded6ca] bg-[#fbf8f1] p-3 text-sm leading-6 text-[#514a40]">
                      600 sq ft driveway, tear out old cracked concrete, haul
                      away, broom finish, probably need rebar, easy access.
                    </div>
                    <button className="mt-3 rounded bg-[#25211b] px-4 py-2 text-sm font-bold text-white">
                      Build Bid
                    </button>
                  </div>

                  <div className="rounded border border-[#d8d0c4] bg-white p-3">
                    <p className="text-xs font-bold uppercase text-[#8b6537]">
                      Generated bid draft
                    </p>
                    <div className="mt-3 grid gap-2">
                      <div className="rounded bg-[#eaf5ef] px-3 py-2 text-xs font-bold text-[#2f6e55]">
                        Scope generated
                      </div>
                      <div className="rounded border border-[#ded6ca] p-3 text-sm leading-6 text-[#514a40]">
                        Remove and haul off old concrete. Prep base, form
                        driveway area, pour new broom-finish concrete, and
                        clean up after completion.
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs font-bold text-[#514a40]">
                        <div className="rounded bg-[#f1ece3] p-2">Demo</div>
                        <div className="rounded bg-[#f1ece3] p-2">Pour</div>
                        <div className="rounded bg-[#f1ece3] p-2">Cleanup</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d7d0c4] bg-[#fffaf7]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:px-10">
          <div>
            <p className="text-sm font-bold uppercase text-[#8b6537]">
              Example input
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              What a contractor might type or say.
            </h2>
            <div className="mt-5 rounded border border-[#d7d0c4] bg-[#f7f1e7] p-5 text-base leading-7 text-[#3d372f]">
              600 sq ft driveway, tear out old cracked concrete, haul away, broom
              finish, probably need rebar, easy access, customer wants it done
              next week if possible.
            </div>
          </div>

          <div className="rounded border border-[#d7d0c4] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#e5ded3] pb-4">
              <div>
                <p className="text-xs font-bold uppercase text-[#8b6537]">
                  Example output
                </p>
                <h3 className="mt-1 text-2xl font-black">Driveway bid draft</h3>
              </div>
              <span className="rounded border border-[#2f6e55]/30 bg-[#eaf5ef] px-3 py-2 text-xs font-bold uppercase text-[#2f6e55]">
                Preview
              </span>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <h4 className="text-sm font-black uppercase text-[#28241f]">
                  Scope of work
                </h4>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#453f37]">
                  {scopeItems.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#b88746]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded border border-[#e2dbcf] bg-[#faf7f1] p-4">
                <h4 className="text-sm font-black uppercase text-[#28241f]">
                  Missing info to confirm
                </h4>
                <div className="mt-3 grid gap-2 text-sm leading-6 text-[#514a40]">
                  <p>Concrete thickness and reinforcement type.</p>
                  <p>Final square footage after measurement.</p>
                  <p>Drainage, slope, and base condition.</p>
                  <p>Target schedule and access details.</p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded border border-[#d6cec0] bg-[#25211b] p-4 text-[#fffaf0]">
              <p className="text-xs font-bold uppercase text-[#d7b06a]">
                Short follow-up message
              </p>
              <p className="mt-2 text-sm leading-6 text-[#eee2cf]">
                I put together the driveway scope based on what we discussed.
                I still need to confirm thickness, reinforcement, and final
                measurements before locking the number in.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f1ea]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-10">
          <div className="rounded border border-[#d7d0c4] bg-white p-6">
            <p className="text-sm font-bold uppercase text-[#8b6537]">
              Private walkthrough
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              The real test is your last job.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#5f574d]">
              This preview shows the direction. In a walkthrough, the important
              part is using a real job you recently quoted and seeing whether
              the draft is something you would actually send.
            </p>

            <div className="mt-6 rounded border border-[#d7d0c4] bg-[#f7f1e7] p-4">
              <p className="text-sm font-black uppercase text-[#28241f]">
                Demo prompt
              </p>
              <p className="mt-2 text-lg font-bold leading-7">
                Talk through your last job like you&apos;re leaving yourself a
                voice note.
              </p>
            </div>
          </div>

          <div className="rounded border border-[#d7d0c4] bg-[#25211b] p-6 text-[#fffaf0]">
            <p className="text-sm font-bold uppercase text-[#d7b06a]">
              Feedback questions
            </p>
            <div className="mt-5 grid gap-3">
              {questions.map((question) => (
                <div
                  key={question}
                  className="rounded border border-white/12 bg-white/7 p-4 text-sm font-bold leading-6 text-[#f4ead9]"
                >
                  {question}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d7d0c4] bg-[#fffaf7]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <p className="text-sm font-bold uppercase text-[#8b6537]">
              Current status
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              Preview first. Live AI test by private walkthrough.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#5f574d]">
              BidForge is in private validation. The goal is not to sell a
              polished dashboard yet. The goal is to test whether a contractor
              would send the draft, edit it, or pay for faster quoting.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded border border-[#d7d0c4] bg-white p-5">
              <p className="text-lg font-black">Built for phone notes</p>
              <p className="mt-2 text-sm leading-6 text-[#645b50]">
                Type, paste, or dictate rough job details and turn them into a
                bid structure.
              </p>
            </div>
            <div className="rounded border border-[#d7d0c4] bg-white p-5">
              <p className="text-lg font-black">Contractor voice</p>
              <p className="mt-2 text-sm leading-6 text-[#645b50]">
                Plain language, short follow-up, no fake polished sales letter.
              </p>
            </div>
            <div className="rounded border border-[#d7d0c4] bg-white p-5">
              <p className="text-lg font-black">Editable before send</p>
              <p className="mt-2 text-sm leading-6 text-[#645b50]">
                The contractor stays in control and can change the draft before
                using it.
              </p>
            </div>
            <div className="rounded border border-[#d7d0c4] bg-white p-5">
              <p className="text-lg font-black">$19 founding test</p>
              <p className="mt-2 text-sm leading-6 text-[#645b50]">
                If it saves real quoting time, the first users can test a simple
                founding version.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
