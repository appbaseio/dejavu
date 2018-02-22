const analyzerSettings = {
	analysis: {
		analyzer: {
			autosuggest_analyzer: {
				filter: ['lowercase', 'asciifolding', 'autosuggest_filter'],
				tokenizer: 'standard',
				type: 'custom'
			},
			ngram_analyzer: {
				filter: ['lowercase', 'asciifolding', 'ngram_filter'],
				tokenizer: 'standard',
				type: 'custom'
			}
		},
		filter: {
			autosuggest_filter: {
				max_gram: '20',
				min_gram: '1',
				token_chars: ['letter', 'digit', 'punctuation', 'symbol'],
				type: 'edge_ngram'
			},
			ngram_filter: {
				max_gram: '9',
				min_gram: '2',
				token_chars: ['letter', 'digit', 'punctuation', 'symbol'],
				type: 'ngram'
			}
		}
	}
};

export default analyzerSettings;
