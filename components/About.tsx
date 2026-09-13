"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, Calendar, User } from "lucide-react";

// ---------- TYPES ----------
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  status: "Published" | "Draft";
  embedUrl?: string;
}

export default function CentraClinicFeatures() {
  const features = [
    { name: "Modern Equipment", description: "State-of-the-art medical devices for accurate diagnosis and treatment." },
    { name: "Experienced Doctors", description: "Board-certified physicians with years of experience in their specialties." },
    { name: "Personalized Care", description: "Tailored treatment plans to meet your unique health needs." },
    { name: "Convenient Appointments", description: "Flexible scheduling and online booking for your convenience." },
    { name: "Hygienic Environment", description: "Clean, safe, and sanitized facilities for your peace of mind." },
    { name: "Comprehensive Services", description: "From general consultations to specialized treatments, we cover it all." },
  ];

  const images = [
    { src: "/image.png", alt: "Doctor attending a patient in consultation room" },
    { src: "/Clean.jpg", alt: "Modern diagnostic equipment in Centra Clinic" },
    { src: "/Pain.jpg", alt: "Nurse assisting patient with care" },
    { src: "/ear.jpg", alt: "Reception and waiting area at Centra Clinic" },
  ];

  const links = [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/service' },
    { name: 'Our FAQs', href: '/FAQs' },
    { name: 'Meet our doctor', href: '#' },
  ];

  const stats = [
    { name: 'Clinics Nationwide', value: '1' },
    { name: 'Dedicated Healthcare Professionals', value: '50+' },
    { name: 'Patients Served Weekly', value: '100+' },
    { name: 'Years of Trusted Care', value: '3+' },
  ];

  return (
    <>
      {/* Features Section */}
      <section className="bg-[#fafaf8]">
        <div className="mx-auto max-w-[1400px] px-6 py-20 sm:py-24 lg:px-10 lg:py-28">
          <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-2 lg:items-center lg:gap-x-16">
            <div>
              <h2 className="text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#0c2222] sm:text-4xl lg:text-[42px]">
                Discover Centra Clinic
                <br />
                <span className="italic font-normal text-[#1d8d8a]">Product Features</span>
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-[1.75] text-[#5f7b79] sm:text-base">
                Centra Clinic PH offers advanced healthcare solutions designed for your convenience, comfort, and safety.
              </p>

              <dl className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature.name} className="border-t border-[#0c2222]/8 pt-4">
                    <dt className="text-[15px] font-semibold text-[#0c2222]">{feature.name}</dt>
                    <dd className="mt-1.5 text-sm leading-[1.65] text-[#68817f]">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  className="rounded-[20px] border border-[#0c2222]/6 bg-[#edf6f5] object-cover w-full h-full shadow-[0_8px_24px_-12px_rgba(16,37,37,0.1)]"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Work With Us */}
        <div className="relative isolate overflow-hidden bg-[#0c2222] py-20 sm:py-24">
          <img
            alt=""
            src="/DESK.jpg"
            className="absolute inset-0 -z-10 w-full h-full object-cover object-right opacity-[0.08] md:object-center"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-[#1d8d8a]/30 blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-[#e6b422]/10 blur-[100px]"
          />

          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-[56px]">
                Work with <span className="italic font-normal text-[#4dd0c8]">us</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-[1.75] text-white/70 sm:text-lg">
                We're seeking passionate individuals who are eager to make an impact at Centra Clinic.
              </p>
            </div>

            <div className="mx-auto mt-8 max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10">
                {links.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 transition-colors hover:text-[#4dd0c8]"
                  >
                    <span className="border-b border-white/20 pb-0.5 transition group-hover:border-[#4dd0c8]">
                      {link.name}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ))}
              </div>

              <dl className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.name} className="flex flex-col-reverse gap-1 border-t border-white/10 pt-5">
                    <dt className="text-xs font-medium uppercase tracking-wider text-white/50">{stat.name}</dt>
                    <dd className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Blog Section */}
      <BlogSection />
    </>
  );
}

// ============================================================
// BLOG SECTION - DYNAMIC (kumukuha mula sa /api/blog)
// ============================================================
function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          const published = data.filter((p: BlogPost) => p.status === "Published");
          setBlogPosts(published);
        } else {
          console.error("Failed to fetch blog posts");
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Helper to generate a consistent gradient based on title
  const getColorFromTitle = (title: string) => {
    const gradients = [
      "from-[#1d8d8a] to-[#2ba8a4]",
      "from-[#0c2222] to-[#1a3a3a]",
      "from-[#177a77] to-[#1d8d8a]",
      "from-[#2ba8a4] to-[#4dd0c8]",
      "from-[#0f5f5c] to-[#177a77]",
      "from-[#1a3a3a] to-[#2ba8a4]",
    ];
    const index = title.length % gradients.length;
    return gradients[index];
  };

  // Loading state
  if (loading) {
    return (
      <section className="bg-[#fafaf8] py-20 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#7b9290]">
              05 — From the Blog
            </span>
            <span className="h-px flex-1 bg-[#0c2222]/10" />
          </div>

          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#0c2222] sm:text-4xl lg:text-[42px]">
              Insights &amp;{" "}
              <span className="italic font-normal text-[#1d8d8a]">Updates</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-[1.75] text-[#5f7b79] sm:text-base">
              Learn how Centra Clinic PH enhances patient care.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[24px] border border-[#0c2222]/6 bg-white"
              >
                <div className="h-48 animate-pulse bg-[#e9f7f6]" />
                <div className="space-y-3 p-5">
                  <div className="h-3 w-24 animate-pulse rounded bg-[#e9f7f6]" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[#e9f7f6]" />
                  <div className="h-3 w-full animate-pulse rounded bg-[#e9f7f6]" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-[#e9f7f6]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#fafaf8] py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Section number */}
        <div className="mb-8 flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#7b9290]">
            05 — From the Blog
          </span>
          <span className="h-px flex-1 bg-[#0c2222]/10" />
        </div>

        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#0c2222] sm:text-4xl lg:text-[42px]">
              Insights &amp;{" "}
              <span className="italic font-normal text-[#1d8d8a]">Updates</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-[1.75] text-[#5f7b79] sm:text-base">
              Learn how Centra Clinic PH enhances patient care.
            </p>
          </div>

          {blogPosts.length > 3 && (
            <a
              href="/blog"
              className="group inline-flex items-center gap-3 self-start rounded-full border border-[#0c2222]/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#0c2222] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:border-[#1d8d8a]/30 hover:shadow-[0_8px_24px_rgba(16,37,37,0.08)]"
            >
              View all posts
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0c2222] text-white transition group-hover:bg-[#1d8d8a]">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
          )}
        </div>

        {blogPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-[#0c2222]/10 bg-white/50 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e9f7f6] text-[#1d8d8a]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0c2222]">
                No blog posts yet
              </p>
              <p className="mt-1 text-xs text-[#7b9290]">
                New articles will appear here once published.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => {
              const hasImage = post.image && post.image !== "";
              const gradientColor = getColorFromTitle(post.title || "Blog");
              const displayDate = post.date || "Recent";
              const displayAuthor = post.author || "CENTRA Clinic";
              const displayExcerpt =
                post.excerpt ||
                post.content?.substring(0, 100) + "..." ||
                "Read more about this topic";

              return (
                <a
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-[24px] border border-[#0c2222]/6 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1d8d8a]/20 hover:shadow-[0_24px_48px_-16px_rgba(16,37,37,0.15)]"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    {hasImage ? (
                      <>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c2222]/40 via-transparent to-transparent"
                        />
                      </>
                    ) : (
                      <>
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor}`} />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `
                              linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)
                            `,
                            backgroundSize: "32px 32px",
                          }}
                        />
                      </>
                    )}

                    {/* Category/Date chip */}
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0c2222]/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                      <Calendar className="h-3 w-3" />
                      {displayDate}
                    </span>

                    {/* Arrow indicator top-right */}
                    <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-[#0c2222]">
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Title */}
                    <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-[#0c2222] transition-colors group-hover:text-[#1d8d8a] sm:text-lg">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="mt-2.5 line-clamp-2 text-sm leading-[1.65] text-[#68817f]">
                      {displayExcerpt}
                    </p>

                    {/* Footer */}
                    <div className="mt-auto flex items-center gap-2 pt-5 text-xs text-[#7b9290]">
                      <User className="h-3 w-3" />
                      <span className="font-medium">{displayAuthor}</span>
                    </div>
                  </div>

                  {/* Bottom accent bar on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-gradient-to-r from-[#1d8d8a] to-[#2ba8a4] transition-transform duration-300 group-hover:scale-x-100"
                  />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
