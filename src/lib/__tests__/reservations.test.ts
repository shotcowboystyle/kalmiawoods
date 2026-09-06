import { describe, it, expect } from "vitest";
import { propertyLabel } from "../reservations";

describe("propertyLabel", () => {
    it("should return the correct label for main_house", () => {
        expect(propertyLabel("main_house")).toBe("Main House");
    });

    it("should return the correct label for workshop", () => {
        expect(propertyLabel("workshop")).toBe("Workshop");
    });

    it("should return the correct label for both", () => {
        expect(propertyLabel("both")).toBe("Both");
    });

    it("should return the value itself if it does not exist in PROPERTIES", () => {
        expect(propertyLabel("invalid_property")).toBe("invalid_property");
    });
});
