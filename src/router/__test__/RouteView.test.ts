describe("RouteView", () => {
  it("matcher roles", () => {
    const matcher = (contain: string[], need: string[]) => {
      const set = new Set(contain);
      return !!need.reduce((a: null | boolean, role) => {
        if (a === false) {
          return false;
        }
        if (role.startsWith("+")) {
          return set.has(role.substring(1));
        }
        if (role.startsWith("-")) {
          return !set.has(role.substring(1));
        }
        if (set.has(role)) {
          return true;
        }
        return a;
      }, null);
    };
    expect(matcher(["USER", "ADMIN"], ["USER"])).toBe(true);
    expect(matcher(["USER"], ["ADMIN"])).toBe(false);
    expect(matcher(["USER"], ["+USER"])).toBe(true);
    expect(matcher(["USER", "ADMIN"], ["+USER", "+ADMIN"])).toBe(true);
    expect(matcher(["USER"], ["USER", "+ADMIN"])).toBe(false);
    expect(matcher(["ADMIN"], ["-USER"])).toBe(true);
    expect(matcher(["USER", "ADMIN"], ["-USER"])).toBe(false);
    expect(matcher(["USER"], ["+USER", "-ADMIN"])).toBe(true);
    expect(matcher(["ADMIN"], ["+USER", "-ADMIN"])).toBe(false);
    expect(matcher(["USER"], ["USER", "-ADMIN"])).toBe(true);
    expect(matcher(["ADMIN"], ["USER", "+ADMIN"])).toBe(true);
  });
});
