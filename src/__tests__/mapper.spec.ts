
// @ts-nocheck
import { Mapper } from "../shapers/mapper";
import { productApiResponse } from "../mocks/product";

describe("Mapper", () => {
  const settings = {
    schema: {},
    map: {
      products: {
        availableForSale: "available",
        productType: "type",
        name: "title",
        variants: {
          title: "name",
          compareAtPrice: "price",
          image: {
            _name: "photo",
            src: "url"
          },
          hasNextPage: "next"
        }
      }
    }
  };

  const settingsSingleEntity = {
    availableForSale: "available",
    productType: "type",
    title: "name",
  };

  const singleEntity = {
    title: "name",
    compareAtPrice: "price",
    image: {
      _name: "photo",
      src: "url"
    },
    hasNextPage: "next"
  }

  const mapper = new Mapper();
  mapper.settings = settings;

  describe('Mapper.isMappable', () => {
    it('should return false if settings isnt set', () => {
      expect(mapper.isMappable(undefined, {})).toBe(false);
    });

    it('should return true if settings and entity are set and settings has the map property', () => {
      // @ts-ignore
      expect(mapper.isMappable(settings, {})).toBe(true);
    });

    it('should return false if settings is set but entity is not set', () => {
      // @ts-ignore
      expect(mapper.isMappable(settings, undefined)).toBe(false);
    });
  });

  describe('Mapper.isEntity', () => {
    it('should return false if settings isnt set', () => {
      expect(mapper.isEntity(undefined, singleEntity)).toBe(false);
    });

    it('should return true if settings and entity are set and settings has the map property', () => {
      expect(mapper.isEntity(settings, singleEntity)).toBe(true);
    });

    it('should return false if settings is set but entity is not an object', () => {
      expect(mapper.isEntity(settings, "string")).toBe(false);
    });
  });

  describe('Mapper.isCollection', () => {
    it('should return true if entity map is an object and entity is an array of objects', () => {
      expect(mapper.isCollection(settings, [singleEntity])).toBe(true);
    });

    it('should return false if entity map is an object and entity is an array of non-objects', () => {
      expect(mapper.isCollection(settings, [])).toBe(false);
    });

    it('should return false if entity map is not an object', () => {
      expect(mapper.isCollection("string", [])).toBe(false);
    });
  });

  describe('Mapper.mapCollection', () => {
    const formatted = mapper.mapCollection(settings.map.products.variants, productApiResponse.variants);
    expect(Array.isArray(formatted)).toBe(true);
    expect(formatted[0].name).toBeDefined();
    expect(formatted[0].available).toBeDefined();
    expect(formatted[0].price).toBeDefined();
    expect(formatted[0].next).toBeDefined();
  });

  describe("Mapper.mapKeys", () => {
    mapper.settings = {
      map: singleEntity
    };

    const formatted = mapper.mapKeys(singleEntity, productApiResponse.variants[0]);
    expect(formatted.name).toBeDefined();
    expect(formatted.available).toBeDefined();
    expect(formatted.price).toBeDefined();
    expect(formatted.photo).toBeDefined();
  });

  describe('mapSingleEntity', () => {
    const spyIsCollection = jest.spyOn(mapper, "isCollection");
    const mapCollectionSpy = jest.spyOn(mapper, "mapCollection");
    const spyMapSingleEntity = jest.spyOn(mapper, "mapSingleEntity");
    const result = mapper.mapSingleEntity(settingsSingleEntity, productApiResponse);
    expect(spyIsCollection).toBeCalledTimes(1);
    expect(mapCollectionSpy).not.toBeCalled();
    expect(spyMapSingleEntity).toBeCalledTimes(1);
    expect(spyMapSingleEntity).toBeCalledWith(settingsSingleEntity, productApiResponse);
    expect(result.available).toBeDefined();
    expect(result.type).toBeDefined();
    expect(result.name).toBeDefined();
  });

  afterEach(() => {
    mapper.settings = settings;
    jest.restoreAllMocks();
  })
})

