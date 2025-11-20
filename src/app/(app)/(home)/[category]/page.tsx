interface Props {
  params: Promise<{
    category: string;
  }>;
}

export default async function page({ params }: Props) {
  const { category } = await params;

  return <div>category: {category}</div>;
}
