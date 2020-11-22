/**
 * 
 */
function Utils() {
};

Utils.formatBytes = function(bytes, decimals) {
	if (0 == bytes)
		return '0 Bytes';
	var k = 1024, dm = decimals || 2, sizes = [ 'Bytes', 'KB', 'MB', 'GB',
			'TB', 'PB', 'EB', 'ZB', 'YB' ], i = Math.floor(Math.log(bytes)
			/ Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}