// import { useState } from "react";
// import { useQuery, gql } from "@apollo/client";
// import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
// import HouseList from "src/components/houseList";
// import { useLastData } from "src/utils/useLastData";
// import { useLocalState } from "src/utils/useLocalState";
// import { HousesQuery, HousesQueryVariables } from "src/generated/HousesQuery";

// layout is a component that receives a prop div
// this component is a subcomponent that lives in the _app file
export default function Home() {
  return <Layout main={
    <div className="flex">
      <div
        className="w-1/2 pb-4"
        style={{ maxHeight: "calc(100vh - 64px)", overflowX: "scroll" }}>
        HouseList
      </div>
      <div className="w-1/2 ">
        <Map />
      </div>
    </div>} />;
}
