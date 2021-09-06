import { RequestContext } from "./requestEntities"

import { Seller } from "../domain/seller"
import { Client } from "../domain/client"
import { Product } from "../domain/product"
import { Segment } from "../domain/segment"
import { Location } from "../domain/location"
import { LocationPrice } from "../domain/locationPrice"
import { City } from "../domain/city"
import { CityPrice } from "../domain/cityPrice"
import { State } from "../domain/state"
import { StatePrice } from "../domain/statePrice"

import { SegmentModel } from "../setup/DBModels/Segment"
import { LocationModel } from "../setup/DBModels/Location";
import { LocationPriceModel } from "../setup/DBModels/LocationPrice"
import { CityModel } from "../setup/DBModels/City"
import { CityPriceModel } from "../setup/DBModels/CityPrice"
import { StateModel } from "../setup/DBModels/State"
import { StatePriceModel } from "../setup/DBModels/StatePrice"



export class NegotiationContext {
    client!: Client;
    product!: Product;
    seller!: Seller;
    priceOffer!: number;
    segment!: Segment;
    location!: Location;
    locationPrice!: LocationPrice;
    city!: City;
    cityPrice!: CityPrice;
    state!: State;
    statePrice!: StatePrice;

    public async from(requestContext: RequestContext) {
        const segment: Segment = await this.getSegment(requestContext.client);
        const location: Location = await this.getLocation(requestContext.client);
        const locationPrice: LocationPrice = await this.getLocationPrice(requestContext.product, location, segment);
        const city: City = await this.getCity(location);
        const cityPrice: CityPrice = await this.getCityPrice(requestContext.product, city, segment);
        const state: State = await this.getState(location);
        const statePrice: StatePrice = await this.getStatePrice(requestContext.product, state, segment);

        this.client = requestContext.client;
        this.product = requestContext.product;
        this.seller = requestContext.seller;
        this.priceOffer = requestContext.priceOffer;
        this.segment = segment;
        this.location = location;
        this.locationPrice = locationPrice;
        this.city = city;
        this.cityPrice = cityPrice;
        this.state = state;
        this.statePrice = statePrice;

        return this;
    };

    private async getSegment(client: Client) {
        const segmentQueryResult: SegmentModel[`columns`] = await new SegmentModel().select().where({
            id: client.segmentId
        }).limit();
        const segment: Segment = new Segment({
            id: segmentQueryResult.id,
            name: segmentQueryResult.name
        });
        return segment;
    };

    private async getLocation(client: Client) {
        const locationQueryResult: LocationModel[`columns`] = await new LocationModel().select().where({
            id: client.locationId
        }).limit();
        const location: Location = new Location({
            id: locationQueryResult.id,
            name: locationQueryResult.name,
            cityId: locationQueryResult.city_id,
            stateId: locationQueryResult.state_id
        });
        return location;
    };

    private async getLocationPrice(product: Product, location: Location, segment: Segment) {
        const locationPriceQueryResult: LocationPriceModel[`columns`] = await new LocationPriceModel().select().where({
            product_id: product.id, 
            location_id: location.id, 
            segment_id: segment.id
        }).limit();
        const locationPrice: LocationPrice = new LocationPrice({
            productId: locationPriceQueryResult.product_id,
            locationId: locationPriceQueryResult.location_id,
            segmentId: locationPriceQueryResult.segment_id,
            price: locationPriceQueryResult.price,
            transportationPrice: locationPriceQueryResult.transportation_price
        });
        return locationPrice;
    };

    private async getCity(location: Location) {
        const cityQueryResult: CityModel[`columns`] = await new CityModel().select().where({
            id: location.cityId
        }).limit();
        const city: City = new City({
            id: cityQueryResult.id,
            name: cityQueryResult.name,
            stateId: cityQueryResult.state_id
        });
        return city;
    };

    private async getCityPrice(product: Product, city: City, segment: Segment) {
        const cityPriceQueryResult: CityPriceModel[`columns`] = await new CityPriceModel().select().where({
            product_id: product.id, 
            city_id: city.id, 
            segment_id: segment.id
        }).limit();
        const cityPrice: CityPrice = new CityPrice({
            productId: cityPriceQueryResult.product_id,
            cityId: cityPriceQueryResult.city_id,
            segmentId: cityPriceQueryResult.segment_id,
            price: cityPriceQueryResult.price
        });
        return cityPrice;
    };

    private async getState(location: Location) {
        const stateQueryResult: StateModel[`columns`] = await new StateModel().select().where({
            id: location.id
        }).limit();
        const state: State = new State({
            id: stateQueryResult.id,
            name: stateQueryResult.name,
        });
        return state;
    };

    private async getStatePrice(product: Product, state: State, segment: Segment) {
        const statePriceQueryResult: StatePriceModel[`columns`] = await new StatePriceModel().select().where({
            product_id: product.id, 
            state_id: state.id, 
            segment_id: segment.id
        }).limit();
        const statePrice: StatePrice = new StatePrice({
            productId: statePriceQueryResult.product_id,
            stateId: statePriceQueryResult.state_id,
            segmentId: statePriceQueryResult.segment_id,
            price: statePriceQueryResult.price
        });
        return statePrice;
    };

};