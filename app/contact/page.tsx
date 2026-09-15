export default function Contact() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Contact Me</h1>

      <div className="space-y-6 text-lg">
        <p>
          Id love to hear from you! If you have a question, want to talk about
          a project, or would like to connect, feel free to reach out.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Get in Touch</h2>

          <div className="space-y-3">
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:sebasbernals11@gmail.com"
                className="text-blue-600 hover:underline"
              >
                sebasbernals11@gmail.com
              </a>
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              <a
                href="tel:+526621415468"
                className="text-blue-600 hover:underline"
              >
                662-141-5468
              </a>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Social Media</h2>

          <div className="space-y-3">
            <p>
              <strong>Instagram:</strong>{" "}
              <a
                href="https://www.instagram.com/seb_sso"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
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
                className="text-blue-600 hover:underline"
              >
                Sebastián Bernal
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
