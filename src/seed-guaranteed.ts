import { MongoClient } from "mongodb";

const categories = [
  {
    name: "لباس مردانه",
    color: "#f3f4f6",
    slug: "menproducts",
    subcategories: [
      { name: "تیشرت مردانه", slug: "menshirt" },
      { name: "شلوار مردانه", slug: "menpants" },
    ],
  },
  {
    name: "لباس زنانه",
    color: "#fdf2f8",
    slug: "womenproducts",
    subcategories: [{ name: "شلوار زنانه", slug: "womenpant" }],
  },
];

const seedGuaranteed = async () => {
  const client = new MongoClient(
    "mongodb+srv://Masoud:Bfpxr9mNrIwnYT5f@cluster0.lxsuafg.mongodb.net/shop"
  );

  try {
    await client.connect();

    const db = client.db("shop");
    const categoriesCollection = db.collection("categories");

    await categoriesCollection.deleteMany({});

    for (const category of categories) {
      const parentResult = await categoriesCollection.insertOne({
        name: category.name,
        slug: category.slug,
        color: category.color,
        parent: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (category.subcategories && category.subcategories.length > 0) {
        for (const subCategory of category.subcategories) {
          await categoriesCollection.insertOne({
            name: subCategory.name,
            slug: subCategory.slug,
            parent: parentResult.insertedId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    const allCategories = await categoriesCollection.find({}).toArray();
    allCategories.forEach((cat) => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    await client.close();
    console.log("🔌 MongoDB connection closed");
  }
};

seedGuaranteed();
