import { STATS } from './constants';

const setStats = stats => ({
	type: STATS.SET_STATS,
	stats,
});

export default setStats;
