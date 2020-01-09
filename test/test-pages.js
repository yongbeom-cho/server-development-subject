var expect  = require('chai').expect;
var request = require('request');

describe('Status and content', function() {
    describe ('Index page', function() {
        it('status', function(done) {
            request('http://localhost:8080/', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
        
        it('content', function(done) {
            request('http://localhost:8080' , function(error, response, body) {           
                expect(body).to.equal("<!DOCTYPE html>\r\n<html>\r\n  <head>\r\n    <title>kakao enterprise subject</title>\r\n    <link rel='stylesheet' href='/stylesheets/style.css' />\r\n    <meta charset=\"utf-8\" />\r\n  </head>\r\n  <body>\r\n \t\t<h1>kakao enterprise subject</h1>\r\n \t\t<br>\r\n \t\t<br>\r\n \t\t<a href=\"https://kauth.kakao.com/oauth/authorize?client_id=6b859aebf0d0964a0f9248653dffbd29&amp;redirect_uri=http://localhost:8080/callback&amp;response_type=code\"><button>login</button></a>\r\n \t\t<br>\r\n  </body>\r\n</html>");
                done();
            });
        });
    });

    describe ('Not available page', function() {
        it('status', function(done) {
            request('http://localhost:8080/about', function(error, response, body) {
                expect(response.statusCode).to.equal(404);
                done();
            });
        });

    });
});