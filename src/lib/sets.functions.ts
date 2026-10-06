import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getSetDetails = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { setDetails } = await import("./set-details.server");
    return setDetails[data.slug] ?? { images: [], description: "" };
  });
