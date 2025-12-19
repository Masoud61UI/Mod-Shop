import { MongoClient } from "mongodb";

const categories = [
  {
    name: "لباس مردانه",
    color: "#f3f4f6",
    slug: "menproducts",
    order: 1,
    subcategories: [
      { name: "تیشرت مردانه", slug: "menshirt", order: 1 },
      { name: "شلوار مردانه", slug: "menpants", order: 2 },
      { name: "هودی مردانه", slug: "menhoodie", order: 3 },
    ],
  },
  {
    name: "لباس زنانه", 
    color: "#f3f4f6",
    slug: "womenproducts",
    order: 2,
    subcategories: [
      { name: "شلوار زنانه", slug: "womenpant", order: 1 },
      { name: "بلوز زنانه", slug: "womenblouse", order: 2 },
      { name: "دامن زنانه", slug: "womenskirt", order: 3 },
    ],
  },
  {
    name: "اکسسوری", 
    color: "#f3f4f6",
    slug: "accessories",
    order: 3,
    subcategories: [
      { name: "عینک آفتابی", slug: "sunglasses", order: 1 },
      { name: "ساعت مچی", slug: "watch", order: 2 },
      { name: "کیف دستی", slug: "handbag", order: 3 },
      { name: "کمربند", slug: "belt", order: 4 },
      { name: "جواهرات", slug: "jewelry", order: 5 },
    ],
  },
];

const seedCategories = async () => {
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
        order: category.order,
        parent: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (category.subcategories && category.subcategories.length > 0) {
        for (const subCategory of category.subcategories) {
          await categoriesCollection.insertOne({
            name: subCategory.name,
            slug: subCategory.slug,
            order: subCategory.order,
            parent: parentResult.insertedId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }
    
    const allCategories = await categoriesCollection
      .find({ parent: null })
      .sort({ order: 1 })
      .toArray();
    
    allCategories.forEach((cat) => {
      console.log(`   👉 ${cat.name} (${cat.slug}) - order: ${cat.order}`);
    });
    
  } catch (error) {
    console.error("❌ Seed با خطا مواجه شد:", error);
  } finally {
    await client.close();
  }
};

seedCategories();