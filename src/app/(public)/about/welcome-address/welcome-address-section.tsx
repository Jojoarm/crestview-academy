import SectionHeading from '@/components/SectionHeading';
import { LinksCard } from '@/components/LinksCard';

export default function WelcomeAddressSection() {
  return (
    <section className="section-pad bg-(--warm-white)">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 xl:gap-24 mb-20 md:mb-28">
          {/* ── Left: sticky label + meta ── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Welcome Address"
              heading={`A Word From\nOur Principal`}
            />

            {/* Principal card */}
            <div
              className="mt-10 p-6 border"
              style={{
                borderColor: 'var(--border-sand)',
                background: 'var(--warm-white-dark)',
              }}
            >
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'var(--terracotta-pale)' }}
              >
                <span
                  className="font-heading font-bold text-lg"
                  style={{ color: 'var(--terracotta)' }}
                >
                  AO
                </span>
              </div>

              <p
                className="font-body font-semibold text-sm mb-0.5"
                style={{ color: 'var(--charcoal)' }}
              >
                Mrs. Adaeze Okonkwo
              </p>
              <p
                className="font-body text-xs tracking-wide mb-4"
                style={{ color: 'var(--charcoal-100)', opacity: 0.6 }}
              >
                Principal, Crestview Academy
              </p>

              <div
                className="w-8 mb-4"
                style={{ height: '1px', background: 'var(--terracotta-light)' }}
              />

              <p
                className="font-body text-xs leading-relaxed"
                style={{ color: 'var(--charcoal-100)', opacity: 0.7 }}
              >
                B.Ed (Hons) English Language — University of Lagos
                <br />
                M.Ed Educational Leadership — University of Ibadan
                <br />
                20+ years in education, 12 at Crestview
              </p>
            </div>
          </div>

          {/* ── Right: the letter ── */}
          <div className="relative">
            {/* Giant decorative opening quote */}
            <span
              className="absolute -top-6 -left-4 font-accent leading-none select-none pointer-events-none"
              style={{
                fontSize: 'clamp(7rem, 14vw, 11rem)',
                color: 'var(--terracotta)',
                opacity: 0.07,
              }}
              aria-hidden="true"
            >
              &ldquo;
            </span>

            {/* Pull quote — the one sentence they'll remember */}
            <blockquote className="relative mb-12">
              <p
                className="font-heading text-2xl md:text-3xl leading-snug"
                style={{ color: 'var(--charcoal)' }}
              >
                Every child carries within them the seeds of greatness. Our role
                is simply to nurture the right conditions for those seeds to
                flourish.
              </p>
              <div
                className="mt-6 w-16"
                style={{ height: '2px', background: 'var(--terracotta)' }}
              />
            </blockquote>

            {/* Full address body */}
            <div
              className="flex flex-col gap-6 font-body text-base leading-relaxed"
              style={{ color: 'var(--charcoal-100)', opacity: 0.85 }}
            >
              <p>
                It is a privilege to welcome you to Crestview Academy, a school
                that has, for over three decades, held firm to a belief that
                excellence and warmth are not competing values, but inseparable
                ones. Whether you are a current family, a prospective parent, or
                simply someone curious about who we are, I am glad you are here.
              </p>
              <p>
                When I first joined Crestview twelve years ago, what struck me
                most was not the results, although they have always been strong,
                but the quality of the relationships, between teachers and
                students, between the school and families, and among the
                students themselves. That relational culture is not incidental
                to our success; it is the foundation of it. Children learn best
                when they feel safe, known, and genuinely valued, and that is
                what we strive to provide every single day.
              </p>

              {/* Inset pull stat */}
              <div
                className="my-2 px-6 py-5 border-l-4"
                style={{
                  borderColor: 'var(--terracotta)',
                  background: 'var(--warm-white-dark)',
                }}
              >
                <p
                  className="font-heading text-4xl mb-1"
                  style={{ color: 'var(--terracotta)' }}
                >
                  98%
                </p>
                <p
                  className="font-body text-sm"
                  style={{ color: 'var(--charcoal-100)', opacity: 0.7 }}
                >
                  of our 2025 SS3 graduates achieved five credits including
                  English and Mathematics in WAEC, a result we are proud of, but
                  never complacent about.
                </p>
              </div>

              <p>
                Academically, we hold our students to high standards because we
                believe they are capable of meeting them. Our WAEC results speak
                for themselves, but what they do not capture is the debate
                student who finds her voice in JSS2, the quiet boy who discovers
                a love of mathematics in Primary 5, or the young artist who sees
                the world differently because a teacher took the time to notice.
                These are the moments that define a Crestview education.
              </p>
              <p>
                Beyond the classroom, our co-curricular life is rich and
                intentional. From our Inter House Sports Day to our annual
                Cultural Showcase, our STEM clubs to our student led community
                service projects, we want every child to find something here
                that is uniquely theirs, something that builds confidence,
                character, and a sense of belonging.
              </p>
              <p>
                As we mark another exciting chapter in our school&rsquo;s
                history, our commitment remains unchanged: to provide a
                rigorous, joyful education that builds not just scholars, but
                young people of integrity, empathy, and ambition. We do not
                measure success only in examination grades, we measure it in the
                kind of people our students become.
              </p>
              <p>
                To families who have trusted us with their children for years:
                thank you. Your partnership is what makes this school what it
                is. To those considering Crestview for the first time: we warmly
                invite you to visit us, walk our grounds, meet our teachers, and
                see for yourself the community we have built together.
              </p>
              <p
                style={{ opacity: 1, color: 'var(--charcoal)' }}
                className="font-body font-medium"
              >
                There is no better way to understand who we are than to
                experience it in person.
              </p>
            </div>

            {/* Signature block */}
            <div
              className="mt-12 pt-8"
              style={{ borderTop: '1px solid var(--border-sand)' }}
            >
              <div className="flex items-start gap-5">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-1"
                  style={{ background: 'var(--terracotta-pale)' }}
                >
                  <span
                    className="font-heading font-bold"
                    style={{ color: 'var(--terracotta)' }}
                  >
                    AO
                  </span>
                </div>
                <div>
                  {/* Stylised signature text standing in for a real image */}
                  <p
                    className="font-accent text-2xl mb-1 leading-none"
                    style={{ color: 'var(--charcoal)', opacity: 0.75 }}
                  >
                    Adaeze Okonkwo
                  </p>
                  <p
                    className="font-body font-semibold text-sm mb-0.5"
                    style={{ color: 'var(--charcoal)' }}
                  >
                    Mrs. Adaeze Okonkwo
                  </p>
                  <p
                    className="font-body text-xs tracking-wide"
                    style={{ color: 'var(--charcoal-100)', opacity: 0.6 }}
                  >
                    Principal, Crestview Academy · Lagos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-(--border-sand)">
          {[
            { label: 'Our History', href: '/about/history' },
            { label: 'Vision & Values', href: '/about/vision' },
            { label: 'Apply Now', href: '/admissions/apply' },
          ].map((item, i) => (
            <LinksCard key={i} href={item.href} label={item.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
