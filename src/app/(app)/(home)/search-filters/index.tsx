import Container from "../Container";
import Categories from "./categories";
import SearchInput from "./SearchInput";

interface Props {
  data: any;
}

export const SearchFilters = ({ data }: Props) => {
  return (
    <Container>
      <div className="flex items-center gap-12 pt-4">
        <div className="w-[77%]">
          <Categories data={data} />
        </div>
        <div className="w-[23%]">
          <SearchInput />
        </div>
      </div>
    </Container>
  );
};
