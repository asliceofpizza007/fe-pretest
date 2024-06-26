"use client";
import { useMemo } from "react";

import { RoomAllocation } from "@/components";
import { type RoomKey, type Room, getRooms } from "@/utils/allocation-utils";

export default function Booking({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const guest = useMemo(() => {
    return {
      adult: Number(searchParams.adult),
      child: Number(searchParams.child),
    };
  }, [searchParams]);

  const rooms = useMemo(() => {
    return getRooms(`${guest.adult},${guest.child}` as RoomKey);
  }, [guest]);

  return (
    <section className="w-full px-4 xl:m-auto xl:w-[800px]">
      <RoomAllocation
        guest={guest}
        rooms={rooms}
        onChange={(res) => {
          console.log(res);
        }}
      />
    </section>
  );
}
