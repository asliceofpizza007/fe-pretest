import Link from "next/link";

export default function Home() {
  return (
    <section className="w-full px-4 xl:m-auto xl:w-[800px]">
      <h1 className="font-bold text-2xl">Home</h1>
      <div className="flex items-center gap-4">
        <Link
          className="rounded bg-au-primary p-1"
          href={`/booking?${new URLSearchParams([
            ["adult", "4"],
            ["child", "2"],
          ])}`}
        >
          Test Case 1
        </Link>
        <Link
          className="rounded bg-au-primary p-1"
          href={`/booking?${new URLSearchParams([
            ["adult", "7"],
            ["child", "3"],
          ])}`}
        >
          Test Case 2
        </Link>
        <Link
          className="rounded bg-au-primary p-1"
          href={`/booking?${new URLSearchParams([
            ["adult", "16"],
            ["child", "0"],
          ])}`}
        >
          Test Case 3
        </Link>
      </div>
    </section>
  );
}
