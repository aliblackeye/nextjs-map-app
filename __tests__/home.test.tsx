jest.mock("@/components/map", () => ({
  Map: () => <div data-testid="location-map">Map Loaded</div>,
}));

import { render, screen } from "@testing-library/react";
import HomePage from "../app/(www)/(home)/page";

// Test case: HomePage bileşeninin doğru şekilde render edilmesi
describe("HomePage", () => {
  it("should render LocationMap and LocationDrawer components", async () => {
    render(<HomePage />);

    // Map script yüklenme durumunu atlıyoruz, haritanın kendisini mock'ladık
    const locationMap = await screen.findByTestId("location-map");
    expect(locationMap).toBeInTheDocument();

    const locationDrawer = await screen.findByTestId("location-drawer");
    expect(locationDrawer).toBeInTheDocument();
  });
});
