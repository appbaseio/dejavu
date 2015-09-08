var elasticsearch = require('elasticsearch')
var appbase = require('../')

var indexTest = require('./index_test.js')
var streamDocumentTests = require('./stream_document_test.js')
var streamSearchTests = require('./stream_search_test.js')

describe('Appbase', function() {
	this.timeout(5000)

	var client, streamingClient

	before(function() {
		client = new elasticsearch.Client({
			host: 'http://RIvfxo1u1:dee8ee52-8b75-4b5b-be4f-9df3c364f59f@scalr.api.appbase.io',
			apiVersion: '1.6'
		});

		streamingClient = new appbase({
			url: 'http://scalr.api.appbase.io',
			username: 'RIvfxo1u1',
			password: 'dee8ee52-8b75-4b5b-be4f-9df3c364f59f',
			appname: 'createnewtestapp01'
		})
	})

	describe('#index', function() {
		it('should index one document', function(done) {
			indexTest.indexOneDocument(streamingClient, done)
		})
	})

	describe('#streamDocument()', function () {
		it('should receive event when new document is inserted', function(done) {
			streamDocumentTests.streamOneDocument(client, streamingClient, done)
		})
		it('should receive only one event', function(done) {
			streamDocumentTests.stopStreamingDocument(client, streamingClient, done)
		})
	})

	describe('#streamSearch()', function () {
		it('should receive event when new document is inserted', function(done) {
			streamSearchTests.streamMatchAll(client, streamingClient, done)
		})
	})
})