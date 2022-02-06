export class Cart {
    items?: CartItem[];
}

export class CartItem {
    productId?: string;
    quantity?: number;
}

export class CardItemDetailed {
    product?: any;
    quantity?: any;
}