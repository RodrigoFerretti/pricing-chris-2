import { Client } from "../domain/client"
import { Seller } from "../domain/seller"
import { Product } from "../domain/product"

import { ClientModel } from "../setup/DBModels/Client"
import { SellerModel } from "../setup/DBModels/Seller"
import { ProductModel } from "../setup/DBModels/Product"

import { requestJSON } from "../app"


export class RequestEntities {

    public async from(requestJSON: requestJSON) {
        const client: Client = await this.getClientById(requestJSON.clientId);
        const seller: Seller = await this.getSellerById(requestJSON.sellerId);
        const product: Product = await this.getProductById(requestJSON.productId);
        const requestContext: RequestContext = new RequestContext({
            client: client, 
            seller: seller, 
            product: product, 
            priceOffer: requestJSON.priceOffer
        });
        return requestContext;
    };

    private async getClientById(clientId: number) {
        const clientQueryResult: ClientModel[`columns`] = await new ClientModel().select().where({
            id: clientId
        }).limit();
        const client: Client = new Client({
            id: clientQueryResult.id,
            name: clientQueryResult.name,
            tpv: clientQueryResult.tpv,
            segmentId: clientQueryResult.segment_id,
            locationId: clientQueryResult.location_id
        });
        return client;
    };

    private async getSellerById(sellerId: number) {
        const sellerQueryResult: SellerModel[`columns`] = await new SellerModel().select().where({
            id: sellerId
        }).limit();
        const seller: Seller = new Seller({
            id: sellerQueryResult.id,
            name: sellerQueryResult.name,
            type: sellerQueryResult.type
        });
        return seller;
    };

    private async getProductById(productId: number) {
        const productQueryResult: ProductModel[`columns`] = await new ProductModel().select().where({
            id: productId
        }).limit();
        const product: Product = new Product({
            id: productQueryResult.id,
            name: productQueryResult.name,
            fabricationCosts: productQueryResult.fabrication_costs
        });
        return product;
    };
};

export class RequestContext {
    client: Client;
    seller: Seller;
    product: Product;
    priceOffer: number;

    constructor(requestContext: RequestContext) {
        this.client = requestContext.client;
        this.seller = requestContext.seller;
        this.product = requestContext.product;
        this.priceOffer = requestContext.priceOffer;
    };
};