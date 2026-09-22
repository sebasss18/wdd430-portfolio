export default function Contact() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <h1 className="mb-6 text-4xl font-bold text-slate-900 dark:text-slate-100">
          Contact Me
        </h1>

        <div className="space-y-6 text-lg text-slate-700 dark:text-slate-300">
          <p>
            Id love to hear from you! If you have a question, want to talk about
            a project, or would like to connect, feel free to reach out.
          </p>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Get in Touch
            </h2>

            <div className="space-y-3 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:sebasbernals11@gmail.com"
                  className="text-slate-700 hover:underline dark:text-slate-300 dark:hover:text-white"
                >
                  sebasbernals11@gmail.com
                </a>
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+526621415468"
                  className="text-slate-700 hover:underline dark:text-slate-300 dark:hover:text-white"
                >
                  662-141-5468
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Social Media
            </h2>

            <div className="space-y-3 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
              <p>
                <strong>Instagram:</strong>{" "}
                <a
                  href="https://www.instagram.com/seb_sso"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:underline dark:text-slate-300 dark:hover:text-white"
                >
                  @seb_sso
                </a>
              </p>

              <p>
                <strong>Facebook:</strong>{" "}
                <a
                  href="https://www.facebook.com/sebastian.bernal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:underline dark:text-slate-300 dark:hover:text-white"
                >
                  Sebastián Bernal
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
