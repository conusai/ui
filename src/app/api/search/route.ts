import { createFromSource } from "fumadocs-core/search/server";

import { source } from "@/lib/docs/source";

const search = createFromSource(source);

export const GET = search.GET;
