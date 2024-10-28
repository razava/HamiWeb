"use client";

import { Hydrate as RQHydrate, HydrateProps } from "@tanstack/react-query";

function Hydrate(HydrateProps) {
  return <RQHydrate {...HydrateProps} />;
}

export default Hydrate;
