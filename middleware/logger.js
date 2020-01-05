
function logginReq = (req, res, next) => {
	sql.createLog("Request", req.headers, req.body);
}
