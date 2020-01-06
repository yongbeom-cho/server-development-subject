
function logginReq = (req, res, next) => {
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
				timestamp: Date.now(),
				/*processingTime: Date.now() - requestStart,*/
				rawHeaders,
				body,
				errorMessage,
				httpVersion,
				method,
				remoteAddress,
				remoteFamily,
				url,
				response: {
					statusCode,
					statusMessage,
					headers
				}
			})
		);
	});
	sql.createLog("Request", req.headers, req.body);
}

/*
const endMiddleware = (req, res, next) => {
  const defaultWrite = res.write;
  const defaultEnd = res.end;
  const chunks = [];

  res.write = (...restArgs) => {
    chunks.push(new Buffer(restArgs[0]));
    defaultWrite.apply(res, restArgs);
  };

  res.end = (...restArgs) => {
    if (restArgs[0]) {
      chunks.push(new Buffer(restArgs[0]));
    }
    const body = Buffer.concat(chunks).toString('utf8');

    console.log(body);

    defaultEnd.apply(res, restArgs);
  };

  next();
};
*/
