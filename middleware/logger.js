const sql = require('../sql');

const log = (req, res, next) => {
	let req_body = [];
	const res_body = [];
	/* req body setting */
	req.on("data", chunk => {
		req_body.push(chunk);
	});
	
	const defaultWrite = res.write;
	const defaultEnd = res.end;
	
	/* res body setting */
	res.write = (...restArgs) => {
		res_body.push(Buffer.from(restArgs[0]));
		defaultWrite.apply(res, restArgs);
	};
	
	res.end = async (...restArgs) => {
		/* response header setting */
		const { statusCode, statusMessage } = res;
		const headers = res.getHeaders();
		
		/* res body setting */
		if (restArgs[0]) {
			res_body.push(Buffer.from(restArgs[0]));
		}
		const res_body_str = Buffer.concat(res_body).toString('utf8');
		
		/* request header setting */
		const { rawHeaders, httpVersion, method, socket, url } = req;
		const { remoteAddress, remoteFamily } = socket;
		let str = `${method.toUpperCase()} ${url} HTTP/${httpVersion}\n`;
		for (let i = 0; i < rawHeaders.length; i = i + 2) {
			str += `${rawHeaders[i]}: ${rawHeaders[i + 1]}\n`
		}
		
		try {
			await sql.createLog("Request", JSON.stringify(str), req_body.toString());
			await sql.createLog("Response", JSON.stringify(headers), res_body_str);   
		} catch (error) {
			console.log("createLog error");
			console.log(error);
		}
		
		defaultEnd.apply(res, restArgs);
	};
	
	next();
};

exports.log = log;