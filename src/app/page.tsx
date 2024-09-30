import GenerationForm from "../components/GenerationForm";

export default function Home() {
  return (
    <div className="px-4 md:px-8 lg:px-16 py-32 flex flex-col items-center">
      <div className="max-w-6xl w-full flex flex-col gap-4">
        <h1 className="font-[family-name:var(--font-geist-mono)] text-6xl font-bold">
          QR Code Generator
        </h1>

        <div className="max-w-3xl w-full bg-amber-100 rounded-xl border-2 border-amber-200 p-4">
          <p className="max-w-prose text-amber-950/80">
            This is a free tool that allows you to generate QR codes, especially
            for URLs, without any form of tracking or analytics attached to it.
            These QR codes are generated on the fly and are not stored on the
            server.
          </p>

          <div className="mt-4">
            <GenerationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
