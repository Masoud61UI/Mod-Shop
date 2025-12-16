// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
// import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Orders } from "./collections/Orders";
import { Reviews } from "./collections/Reviews";
import { Products } from "./collections/Products";
import { Categories } from "./collections/Categories";
import { ShippingSettings } from "./collections/ShippingSettings";
import { ContactMessages } from "./collections/ContactMessages";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    ShippingSettings,
    Orders,
    Reviews,
    ContactMessages,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    //vercelBlobStorage({
    //  enabled: true,
    //  collections: {
    //    media: true,
    //  },
    //  token: process.env.BLOB_READ_WRITE_TOKEN,
    //}),
  ],
});
