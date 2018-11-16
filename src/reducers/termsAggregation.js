import { TERMS_AGGREGATIONS } from '../actions/constants';

const termsAggregations = (state = {}, action) => {
	switch (action.type) {
		case TERMS_AGGREGATIONS.FETCH_TERMS_AGGREGATIONS_SUCCESS:
			return action.termsAggregations;
		default:
			return state;
	}
};

export const getTermsAggregations = state => state.termsAggregations;

export default termsAggregations;
