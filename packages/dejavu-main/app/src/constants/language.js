export default {
	universal: {
		analysis: {
			filter: {
				universal_stop: {
					type: 'stop',
					stopwords: '_english_',
				},
			},
			analyzer: {
				universal: {
					tokenizer: 'standard',
					filter: ['universal_stop'],
				},
			},
		},
	},
	arabic: {
		analysis: {
			filter: {
				arabic_stop: {
					type: 'stop',
					stopwords: '_arabic_',
				},
				arabic_stemmer: {
					type: 'stemmer',
					language: 'arabic',
				},
			},
			analyzer: {
				arabic: {
					tokenizer: 'standard',
					filter: [
						'lowercase',
						'decimal_digit',
						'arabic_stop',
						'arabic_normalization',
						'arabic_stemmer',
					],
				},
			},
		},
	},
	armenian: {
		analysis: {
			filter: {
				armenian_stop: {
					type: 'stop',
					stopwords: '_armenian_',
				},
				armenian_stemmer: {
					type: 'stemmer',
					language: 'armenian',
				},
			},
			analyzer: {
				armenian: {
					tokenizer: 'standard',
					filter: ['lowercase', 'armenian_stop', 'armenian_stemmer'],
				},
			},
		},
	},
	basque: {
		analysis: {
			filter: {
				basque_stop: {
					type: 'stop',
					stopwords: '_basque_',
				},
				basque_stemmer: {
					type: 'stemmer',
					language: 'basque',
				},
			},
			analyzer: {
				basque: {
					tokenizer: 'standard',
					filter: ['lowercase', 'basque_stop', 'basque_stemmer'],
				},
			},
		},
	},
	bengali: {
		analysis: {
			filter: {
				bengali_stop: {
					type: 'stop',
					stopwords: '_bengali_',
				},
				bengali_stemmer: {
					type: 'stemmer',
					language: 'bengali',
				},
			},
			analyzer: {
				bengali: {
					tokenizer: 'standard',
					filter: [
						'lowercase',
						'decimal_digit',

						'indic_normalization',
						'bengali_normalization',
						'bengali_stop',
						'bengali_stemmer',
					],
				},
			},
		},
	},
	brazilian: {
		analysis: {
			filter: {
				brazilian_stop: {
					type: 'stop',
					stopwords: '_brazilian_',
				},
				brazilian_stemmer: {
					type: 'stemmer',
					language: 'brazilian',
				},
			},
			analyzer: {
				brazilian: {
					tokenizer: 'standard',
					filter: [
						'lowercase',
						'brazilian_stop',
						'brazilian_stemmer',
					],
				},
			},
		},
	},
	bulgarian: {
		analysis: {
			filter: {
				bulgarian_stop: {
					type: 'stop',
					stopwords: '_bulgarian_',
				},
				bulgarian_stemmer: {
					type: 'stemmer',
					language: 'bulgarian',
				},
			},
			analyzer: {
				bulgarian: {
					tokenizer: 'standard',
					filter: [
						'lowercase',
						'bulgarian_stop',
						'bulgarian_stemmer',
					],
				},
			},
		},
	},
	catalan: {
		analysis: {
			filter: {
				catalan_elision: {
					type: 'elision',
					articles: ['d', 'l', 'm', 'n', 's', 't'],
					articles_case: true,
				},
				catalan_stop: {
					type: 'stop',
					stopwords: '_catalan_',
				},
				catalan_stemmer: {
					type: 'stemmer',
					language: 'catalan',
				},
			},
			analyzer: {
				catalan: {
					tokenizer: 'standard',
					filter: [
						'catalan_elision',
						'lowercase',
						'catalan_stop',
						'catalan_stemmer',
					],
				},
			},
		},
	},
	cjk: {
		analysis: {
			filter: {
				english_stop: {
					type: 'stop',
					stopwords: [
						'a',
						'and',
						'are',
						'as',
						'at',
						'be',
						'but',
						'by',
						'for',
						'if',
						'in',
						'into',
						'is',
						'it',
						'no',
						'not',
						'of',
						'on',
						'or',
						's',
						'such',
						't',
						'that',
						'the',
						'their',
						'then',
						'there',
						'these',
						'they',
						'this',
						'to',
						'was',
						'will',
						'with',
						'www',
					],
				},
			},
			analyzer: {
				cjk: {
					tokenizer: 'standard',
					filter: [
						'cjk_width',
						'lowercase',
						'cjk_bigram',
						'english_stop',
					],
				},
			},
		},
	},
	czech: {
		analysis: {
			filter: {
				czech_stop: {
					type: 'stop',
					stopwords: '_czech_',
				},
				czech_stemmer: {
					type: 'stemmer',
					language: 'czech',
				},
			},
			analyzer: {
				czech: {
					tokenizer: 'standard',
					filter: ['lowercase', 'czech_stop', 'czech_stemmer'],
				},
			},
		},
	},
	danish: {
		analysis: {
			filter: {
				danish_stop: {
					type: 'stop',
					stopwords: '_danish_',
				},
				danish_stemmer: {
					type: 'stemmer',
					language: 'danish',
				},
			},
			analyzer: {
				danish: {
					tokenizer: 'standard',
					filter: ['lowercase', 'danish_stop', 'danish_stemmer'],
				},
			},
		},
	},
	dutch: {
		analysis: {
			filter: {
				dutch_stop: {
					type: 'stop',
					stopwords: '_dutch_',
				},
				dutch_stemmer: {
					type: 'stemmer',
					language: 'dutch',
				},
				dutch_override: {
					type: 'stemmer_override',
					rules: [
						'fiets=>fiets',
						'bromfiets=>bromfiets',
						'ei=>eier',
						'kind=>kinder',
					],
				},
			},
			analyzer: {
				dutch: {
					tokenizer: 'standard',
					filter: [
						'lowercase',
						'dutch_stop',
						'dutch_override',
						'dutch_stemmer',
					],
				},
			},
		},
	},
	english: {
		analysis: {
			filter: {
				english_stop: {
					type: 'stop',
					stopwords: '_english_',
				},
				english_stemmer: {
					type: 'stemmer',
					language: 'english',
				},
				english_possessive_stemmer: {
					type: 'stemmer',
					language: 'possessive_english',
				},
			},
			analyzer: {
				english: {
					tokenizer: 'standard',
					filter: [
						'english_possessive_stemmer',
						'lowercase',
						'english_stop',
						'english_stemmer',
					],
				},
			},
		},
	},
	estonian: {
		analysis: {
			filter: {
				estonian_stop: {
					type: 'stop',
					stopwords: '_estonian_',
				},
				estonian_stemmer: {
					type: 'stemmer',
					language: 'estonian',
				},
			},
			analyzer: {
				estonian: {
					tokenizer: 'standard',
					filter: ['lowercase', 'estonian_stop', 'estonian_stemmer'],
				},
			},
		},
	},
	finnish: {
		analysis: {
			filter: {
				finnish_stop: {
					type: 'stop',
					stopwords: '_finnish_',
				},
				finnish_stemmer: {
					type: 'stemmer',
					language: 'finnish',
				},
			},
			analyzer: {
				finnish: {
					tokenizer: 'standard',
					filter: ['lowercase', 'finnish_stop', 'finnish_stemmer'],
				},
			},
		},
	},
	french: {
		analysis: {
			filter: {
				french_elision: {
					type: 'elision',
					articles_case: true,
					articles: [
						'l',
						'm',
						't',
						'qu',
						'n',
						's',
						'j',
						'd',
						'c',
						'jusqu',
						'quoiqu',
						'lorsqu',
						'puisqu',
					],
				},
				french_stop: {
					type: 'stop',
					stopwords: '_french_',
				},
				french_stemmer: {
					type: 'stemmer',
					language: 'light_french',
				},
			},
			analyzer: {
				french: {
					tokenizer: 'standard',
					filter: [
						'french_elision',
						'lowercase',
						'french_stop',
						'french_stemmer',
					],
				},
			},
		},
	},
	galician: {
		analysis: {
			filter: {
				galician_stop: {
					type: 'stop',
					stopwords: '_galician_',
				},
				galician_stemmer: {
					type: 'stemmer',
					language: 'galician',
				},
			},
			analyzer: {
				galician: {
					tokenizer: 'standard',
					filter: ['lowercase', 'galician_stop', 'galician_stemmer'],
				},
			},
		},
	},
	german: {
		analysis: {
			filter: {
				german_stop: {
					type: 'stop',
					stopwords: '_german_',
				},
				german_stemmer: {
					type: 'stemmer',
					language: 'light_german',
				},
			},
			analyzer: {
				german: {
					tokenizer: 'standard',
					filter: [
						'lowercase',
						'german_stop',
						'german_normalization',
						'german_stemmer',
					],
				},
			},
		},
	},
	greek: {
		analysis: {
			filter: {
				greek_stop: {
					type: 'stop',
					stopwords: '_greek_',
				},
				greek_lowercase: {
					type: 'lowercase',
					language: 'greek',
				},
				greek_stemmer: {
					type: 'stemmer',
					language: 'greek',
				},
			},
			analyzer: {
				greek: {
					tokenizer: 'standard',
					filter: ['greek_lowercase', 'greek_stop', 'greek_stemmer'],
				},
			},
		},
	},
	hindi: {
		analysis: {
			filter: {
				hindi_stop: {
					type: 'stop',
					stopwords: '_hindi_',
				},
				hindi_stemmer: {
					type: 'stemmer',
					language: 'hindi',
				},
			},
			analyzer: {
				hindi: {
					tokenizer: 'standard',
					filter: [
						'lowercase',
						'decimal_digit',

						'indic_normalization',
						'hindi_normalization',
						'hindi_stop',
						'hindi_stemmer',
					],
				},
			},
		},
	},
	hungarian: {
		analysis: {
			filter: {
				hungarian_stop: {
					type: 'stop',
					stopwords: '_hungarian_',
				},
				hungarian_stemmer: {
					type: 'stemmer',
					language: 'hungarian',
				},
			},
			analyzer: {
				hungarian: {
					tokenizer: 'standard',
					filter: [
						'lowercase',
						'hungarian_stop',
						'hungarian_stemmer',
					],
				},
			},
		},
	},
	indonesian: {
		analysis: {
			filter: {
				indonesian_stop: {
					type: 'stop',
					stopwords: '_indonesian_',
				},
				indonesian_stemmer: {
					type: 'stemmer',
					language: 'indonesian',
				},
			},
			analyzer: {
				indonesian: {
					tokenizer: 'standard',
					filter: [
						'lowercase',
						'indonesian_stop',
						'indonesian_stemmer',
					],
				},
			},
		},
	},
	irish: {
		analysis: {
			filter: {
				irish_hyphenation: {
					type: 'stop',
					stopwords: ['h', 'n', 't'],
					ignore_case: true,
				},
				irish_elision: {
					type: 'elision',
					articles: ['d', 'm', 'b'],
					articles_case: true,
				},
				irish_stop: {
					type: 'stop',
					stopwords: '_irish_',
				},
				irish_lowercase: {
					type: 'lowercase',
					language: 'irish',
				},
				irish_stemmer: {
					type: 'stemmer',
					language: 'irish',
				},
			},
			analyzer: {
				irish: {
					tokenizer: 'standard',
					filter: [
						'irish_hyphenation',
						'irish_elision',
						'irish_lowercase',
						'irish_stop',

						'irish_stemmer',
					],
				},
			},
		},
	},
	italian: {
		analysis: {
			filter: {
				italian_elision: {
					type: 'elision',
					articles: [
						'c',
						'l',
						'all',
						'dall',
						'dell',
						'nell',
						'sull',
						'coll',
						'pell',
						'gl',
						'agl',
						'dagl',
						'degl',
						'negl',
						'sugl',
						'un',
						'm',
						't',
						's',
						'v',
						'd',
					],
					articles_case: true,
				},
				italian_stop: {
					type: 'stop',
					stopwords: '_italian_',
				},
				italian_stemmer: {
					type: 'stemmer',
					language: 'light_italian',
				},
			},
			analyzer: {
				italian: {
					tokenizer: 'standard',
					filter: [
						'italian_elision',
						'lowercase',
						'italian_stop',
						'italian_stemmer',
					],
				},
			},
		},
	},
	latvian: {
		analysis: {
			filter: {
				latvian_stop: {
					type: 'stop',
					stopwords: '_latvian_',
				},
				latvian_stemmer: {
					type: 'stemmer',
					language: 'latvian',
				},
			},
			analyzer: {
				latvian: {
					tokenizer: 'standard',
					filter: ['lowercase', 'latvian_stop', 'latvian_stemmer'],
				},
			},
		},
	},
	lithuanian: {
		analysis: {
			filter: {
				lithuanian_stop: {
					type: 'stop',
					stopwords: '_lithuanian_',
				},
				lithuanian_stemmer: {
					type: 'stemmer',
					language: 'lithuanian',
				},
			},
			analyzer: {
				lithuanian: {
					tokenizer: 'standard',
					filter: [
						'lowercase',
						'lithuanian_stop',
						'lithuanian_stemmer',
					],
				},
			},
		},
	},
	norwegian: {
		analysis: {
			filter: {
				norwegian_stop: {
					type: 'stop',
					stopwords: '_norwegian_',
				},
				norwegian_stemmer: {
					type: 'stemmer',
					language: 'norwegian',
				},
			},
			analyzer: {
				norwegian: {
					tokenizer: 'standard',
					filter: [
						'lowercase',
						'norwegian_stop',
						'norwegian_stemmer',
					],
				},
			},
		},
	},
	persian: {
		analysis: {
			char_filter: {
				zero_width_spaces: {
					type: 'mapping',
					mappings: ['\\u200C=>\\u0020'],
				},
			},
			filter: {
				persian_stop: {
					type: 'stop',
					stopwords: '_persian_',
				},
			},
			analyzer: {
				persian: {
					tokenizer: 'standard',
					char_filter: ['zero_width_spaces'],
					filter: [
						'lowercase',
						'decimal_digit',
						'arabic_normalization',
						'persian_normalization',
						'persian_stop',
					],
				},
			},
		},
	},
	portuguese: {
		analysis: {
			filter: {
				portuguese_stop: {
					type: 'stop',
					stopwords: '_portuguese_',
				},
				portuguese_stemmer: {
					type: 'stemmer',
					language: 'light_portuguese',
				},
			},
			analyzer: {
				portuguese: {
					tokenizer: 'standard',
					filter: [
						'lowercase',
						'portuguese_stop',
						'portuguese_stemmer',
					],
				},
			},
		},
	},
	romanian: {
		analysis: {
			filter: {
				romanian_stop: {
					type: 'stop',
					stopwords: '_romanian_',
				},
				romanian_stemmer: {
					type: 'stemmer',
					language: 'romanian',
				},
			},
			analyzer: {
				romanian: {
					tokenizer: 'standard',
					filter: ['lowercase', 'romanian_stop', 'romanian_stemmer'],
				},
			},
		},
	},
	russian: {
		analysis: {
			filter: {
				russian_stop: {
					type: 'stop',
					stopwords: '_russian_',
				},
				russian_stemmer: {
					type: 'stemmer',
					language: 'russian',
				},
			},
			analyzer: {
				russian: {
					tokenizer: 'standard',
					filter: ['lowercase', 'russian_stop', 'russian_stemmer'],
				},
			},
		},
	},
	sorani: {
		analysis: {
			filter: {
				sorani_stop: {
					type: 'stop',
					stopwords: '_sorani_',
				},
				sorani_stemmer: {
					type: 'stemmer',
					language: 'sorani',
				},
			},
			analyzer: {
				sorani: {
					tokenizer: 'standard',
					filter: [
						'sorani_normalization',
						'lowercase',
						'decimal_digit',
						'sorani_stop',

						'sorani_stemmer',
					],
				},
			},
		},
	},
	spanish: {
		analysis: {
			filter: {
				spanish_stop: {
					type: 'stop',
					stopwords: '_spanish_',
				},
				spanish_stemmer: {
					type: 'stemmer',
					language: 'light_spanish',
				},
			},
			analyzer: {
				spanish: {
					tokenizer: 'standard',
					filter: ['lowercase', 'spanish_stop', 'spanish_stemmer'],
				},
			},
		},
	},
	swedish: {
		analysis: {
			filter: {
				swedish_stop: {
					type: 'stop',
					stopwords: '_swedish_',
				},
				swedish_stemmer: {
					type: 'stemmer',
					language: 'swedish',
				},
			},
			analyzer: {
				swedish: {
					tokenizer: 'standard',
					filter: ['lowercase', 'swedish_stop', 'swedish_stemmer'],
				},
			},
		},
	},
	turkish: {
		analysis: {
			filter: {
				turkish_stop: {
					type: 'stop',
					stopwords: '_turkish_',
				},
				turkish_lowercase: {
					type: 'lowercase',
					language: 'turkish',
				},
				turkish_stemmer: {
					type: 'stemmer',
					language: 'turkish',
				},
			},
			analyzer: {
				turkish: {
					tokenizer: 'standard',
					filter: [
						'apostrophe',
						'turkish_lowercase',
						'turkish_stop',
						'turkish_stemmer',
					],
				},
			},
		},
	},
	thai: {
		analysis: {
			filter: {
				thai_stop: {
					type: 'stop',
					stopwords: '_thai_',
				},
			},
			analyzer: {
				thai: {
					tokenizer: 'thai',
					filter: ['lowercase', 'decimal_digit', 'thai_stop'],
				},
			},
		},
	},
};
