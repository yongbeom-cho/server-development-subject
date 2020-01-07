const sql = require('../sql');

const log = (req, res, next) => {
    
    let req_body = [];
    const res_body = [];
    
    req.on("data", chunk => {
        req_body.push(chunk);
    });
    
    
  const defaultWrite = res.write;
  const defaultEnd = res.end;
  

  res.write = (...restArgs) => {
    res_body.push(Buffer.from(restArgs[0]));
    defaultWrite.apply(res, restArgs);
  };

  res.end = async (...restArgs) => {
      /* response body setting */
    if (restArgs[0]) {
      res_body.push(Buffer.from(restArgs[0]));
    }
    const res_body_str = Buffer.concat(res_body).toString('utf8');
      
      /* response header setting */
    const { statusCode, statusMessage } = res;
    const headers = res.getHeaders();

      /*request header, body setting */
    const { rawHeaders, httpVersion, method, socket, url } = req;
    const { remoteAddress, remoteFamily } = socket;
    
    try {
        await sql.createLog("Request", JSON.stringify(rawHeaders), req_body.toString());
        await sql.createLog("Response", JSON.stringify(headers), res_body_str);
      /*
    console.log(
        JSON.stringify({
            header : {
            rawHeaders,
            httpVersion,
            method,
            remoteAddress,
            remoteFamily,
            url
            }, 
            body : {
                req_body
            }
        })
    );
    */

       
    } catch (error) {
        console.log("createLog error");
        console.log(error);
    }
    /*
    console.log(
        JSON.stringify({
            response: {
                statusCode,
                statusMessage,
                headers,
                res_body_str
            }
        })
    );
    */

    defaultEnd.apply(res, restArgs);
  };

  next();
};
exports.log = log;

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