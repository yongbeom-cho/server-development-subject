var expect  = require('chai').expect;
var request = require('request');

var app_user_id = 1234567;
var nickname = "yongbeom-cho";
var modified_nickname = "YongbeomCho";
var access_token = "11111111111111111111111111111111111111";
var refresh_token = "22222222222222222222222222222222222222";

describe('API', function() {
    describe ('get api/user/:app_user_id', function() {
        
        it('content', function(done) {
            const options = {
                app_user_id: app_user_id,
                nickname: nickname,
                access_token: access_token,
                refresh_token: refresh_token
            };
            
            request.post('http://localhost:8080/api/user/'+app_user_id , { form : options }, function(error, response, body) {
                expect(body).to.equal("true");
                
                request.get('http://localhost:8080/api/user/'+app_user_id , function(error, response, body) {
                    const json_body = JSON.parse(body);
                    expect(json_body.app_user_id).to.equal(app_user_id);
                    expect(json_body.nickname).to.equal(nickname);
                    expect(json_body.access_token).to.equal(access_token);
                    expect(json_body.refresh_token).to.equal(refresh_token);
                    done();
                });
            });
        });
    });
    
    describe ('put api/user/:app_user_id', function() {
        
        it('content', function(done) {
            const options = {
                nickname: modified_nickname
            };
            request.put('http://localhost:8080/api/user/'+app_user_id, { form : options }, async function(error, response, body) {
                expect(body).to.equal("true");
                
                request.get('http://localhost:8080/api/user/'+app_user_id , function(error, response, body) {
                    const json_body = JSON.parse(body);
                    expect(json_body.app_user_id).to.equal(app_user_id);
                    expect(json_body.nickname).to.equal(modified_nickname);
                    expect(json_body.access_token).to.equal(access_token);
                    expect(json_body.refresh_token).to.equal(refresh_token);
                    done();
                });
            });
        });
        
    });
    
    describe ('get api/users from nickname', function() {
        
        it('content', function(done) {
            const options = {
                nickname: modified_nickname
            };
            request.get('http://localhost:8080/api/users', { form : options }, function(error, response, body) {
                const json_body = JSON.parse(body);
                const body_length = json_body.length;
                expect(json_body[body_length-1].app_user_id).to.equal(app_user_id);
                expect(json_body[body_length-1].nickname).to.equal(modified_nickname);
                expect(json_body[body_length-1].access_token).to.equal(access_token);
                expect(json_body[body_length-1].refresh_token).to.equal(refresh_token);
                done();
            });
        });
    });
    
    describe ('get all api/users ', function() {
        
        it('content', function(done) {
            request.get('http://localhost:8080/api/users', function(error, response, body) {
                const json_body = JSON.parse(body);
                const body_length = json_body.length
                console.log(body_length);
                expect(json_body[body_length-1].app_user_id).to.equal(app_user_id);
                expect(json_body[body_length-1].nickname).to.equal(modified_nickname);
                expect(json_body[body_length-1].access_token).to.equal(access_token);
                expect(json_body[body_length-1].refresh_token).to.equal(refresh_token);
                done();
            });
        });
    });
    
    describe ('delete api/user/:app_user_id', function() {
        
        it('content', function(done) {
            request.delete('http://localhost:8080/api/user/'+app_user_id, function(error, response, body) {
                expect(body).to.equal("true");
                request.get('http://localhost:8080/api/user/'+app_user_id , function(error, response, body) {
                    expect(body).to.equal("null");
                    done();
                });
            });
        });
    });
    
});
