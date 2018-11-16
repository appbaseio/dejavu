import { TERMS_AGGREGATIONS } from './constants';

export default termsAggregations => ({
	type: TERMS_AGGREGATIONS.FETCH_TERMS_AGGREGATIONS_SUCCESS,
	termsAggregations,
});
