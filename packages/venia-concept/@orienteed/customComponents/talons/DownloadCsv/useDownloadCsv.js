import { useQuery } from '@apollo/client';
import {
    GET_FULL_CATALOG_REGULAR_PRICE,
    GET_FULL_CATALOG_DISCOUNT_PRICE
} from './getCatalog.gql';

export const useDownloadCsv = () => {
    const { data: catalogRegularPrice } = useQuery(
        GET_FULL_CATALOG_REGULAR_PRICE
    );
    const { data: catalogDiscountPrice } = useQuery(
        GET_FULL_CATALOG_DISCOUNT_PRICE
    );

    return { catalogRegularPrice, catalogDiscountPrice };
};
