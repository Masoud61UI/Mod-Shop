import Container from "../Container";
import { CustomCategory } from "../types";
import Categories from "./categories";
import SearchInput from "./SearchInput";

interface Props {
  data: CustomCategory[];
}

export const SearchFilters = ({ data }: Props) => {
  return (
    <Container>
      <div className="flex items-center gap-12 pt-4">
        <div className="hidden lg:block lg:w-[77%]">
          <Categories data={data} />
        </div>
        <div className="lg:w-[23%] w-full">
          <SearchInput data={data} />
        </div>
      </div>
    </Container>
  );
};
