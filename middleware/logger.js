
function log(req, res, next) {
	let errorMessage = null;
  let body = [];
	req.on("data", chunk => {
		body.push(chunk);
	});
	req.on("end", () => {
		body = Buffer.concat(body);
		body = body.toString();
	});
	req.on("error", error => {
		errorMessage = error.message;
	});
	
	res.on("finish", () => {
		const { rawHeaders, httpVersion, method, socket, url } = req;
		const { remoteAddress, remoteFamily } = socket;
		
		const { statusCode, statusMessage } = res;
		const headers = res.getHeaders();
		
	   	console.log(
			JSON.stringify({
				/*timestamp: Date.now(),
				processingTime: Date.now() - requestStart,
				rawHeaders,*/
				body,
				/*errorMessage,
				httpVersion,
				method,
				remoteAddress,
				remoteFamily,
				url,
				response: {
					statusCode,
					statusMessage,
					headers
				}*/
			})
		);
		
		console.log("********************************************");
		console.log(res);
	});
	next();
};



const endMiddleware = (req, res, next) => {
  const defaultWrite = res.write;
  const defaultEnd = res.end;
  const chunks = [];

  res.write = (...restArgs) => {
    chunks.push(new Buffer(restArgs[0]));
    defaultWrite.apply(res, restArgs);
  };
	
	res.render = 

  res.end = (...restArgs) => {
    if (restArgs[0]) {
      chunks.push(new Buffer(restArgs[0]));
    }
    const body = Buffer.concat(chunks).toString('utf8');
		console.log("##############################################");
    console.log(body);
		console.log("##############################################");

    defaultEnd.apply(res, restArgs);
  };

  next();
};
exports.log = log;
exports.endMiddleware = endMiddleware;

/*
RequestHeaders

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*\/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate, br
Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7
Cache-Control: max-age=0
Connection: keep-alive
Host: localhost:8080
If-None-Match: W/"276-ZGU16sXY/ZvappwYLCBfXEf1ks4"
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: cross-site
Sec-Fetch-User: ?1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36
*/

/*Request Body 
{}
*/

/* Response Headers
Content-Length: 630
Content-Type: text/html; charset=utf-8
Date: Mon, 06 Jan 2020 15:24:20 GMT
ETag: W/"276-ZGU16sXY/ZvappwYLCBfXEf1ks4"
X-Powered-By: Express
*/

/* response body
<!DOCTYPE html>
<html>
  <head>
    <title>카카오 엔터프라이즈 과제</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
    <meta charset="utf-8" />
  </head>
  <body>
 		<h1>카카오 엔터프라이즈 과제</h1>
 		<br>
 		<br>
 		<a href="https://kauth.kakao.com/oauth/authorize?client_id=6b859aebf0d0964a0f9248653dffbd29&amp;redirect_uri=http://localhost:8080/callback&amp;response_type=code"><button>로그인</button></a>
 		<br>
    <!-- 로그인폼 
    <form action="/login" method="post">
      <input value="로그인" type="submit" />
    </form>-->
 
  </body>
</html>
*/