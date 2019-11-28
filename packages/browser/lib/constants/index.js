"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SETTINGS = exports.IMPORTER_LINK = exports.LOCAL_CONNECTIONS = exports.MODES = void 0;
const MODES = {
  VIEW: 'view',
  EDIT: 'edit'
};
exports.MODES = MODES;
const LOCAL_CONNECTIONS = 'localConnections';
exports.LOCAL_CONNECTIONS = LOCAL_CONNECTIONS;
const IMPORTER_LINK = 'https://importer.appbase.io/?app=';
exports.IMPORTER_LINK = IMPORTER_LINK;
const SETTINGS = {
  'index.max_ngram_diff': 10,
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
exports.SETTINGS = SETTINGS;