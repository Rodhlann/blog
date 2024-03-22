const calculateRelativePathString = (path) => {
 const subdirCount = path.split('/').length - 1
 const subdirString = subdirCount === 0 ? '.' : [...Array(subdirCount)].reduce((acc, _) => acc += '../', '')
 return subdirString
}

module.exports = {
 calculateRelativePathString
}