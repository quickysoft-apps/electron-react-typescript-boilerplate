var chokidar = require('chokidar');

// https://github.com/paulmillr/chokidar

var watcher = chokidar.watch('file or dir', {ignored: /[\/\\]\./, persistent: true});

// One-liner for current directory, ignores .dotfiles
chokidar.watch('.', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
  console.log(event, path);
});

watcher
  .on('add', function(path) {console.log('File', path, 'has been added');})
  .on('addDir', function(path) {console.log('Directory', path, 'has been added');})
  .on('change', function(path) {console.log('File', path, 'has been changed');})
  .on('unlink', function(path) {console.log('File', path, 'has been removed');})
  .on('unlinkDir', function(path) {console.log('Directory', path, 'has been removed');})
  .on('error', function(error) {console.error('Error happened', error);})
  .on('ready', () => log('Initial scan complete. Ready for changes'))
  .on('raw', (event, path, details) => {log('Raw event info:', event, path, details);})
   
// 'add', 'addDir' and 'change' events also receive stat() results as second argument. 
// http://nodejs.org/api/fs.html#fs_class_fs_stats 
watcher.on('change', function(path, stats) {
  console.log('File', path, 'changed size to', stats.size);
});
 
// Watch new files.
watcher.add('new-file');
watcher.add(['new-file-2', 'new-file-3']);
 
 // Get list of actual paths being watched on the filesystem
var watchedPaths = watcher.getWatched();

// Un-watch some files.
watcher.unwatch('new-file*');

// Only needed if watching is persistent. 
watcher.close();
 
 // Full list of options. See below for descriptions. (do not use this example)
chokidar.watch('file', {
  persistent: true, // (default: true).  Indicates whether the process should continue to run as long as files are being watched. If set to false when using fsevents to watch, no more events will be emitted after ready, even if the process continues to run.
  ignored: '*.txt',
  ignoreInitial: false,
  followSymlinks: true,
  cwd: '.',
  disableGlobbing: false,

  usePolling: true,
  interval: 100,
  binaryInterval: 300,
  alwaysStat: false,
  depth: 99,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  },

  ignorePermissionErrors: false,
  atomic: true // or a custom 'atomicity delay', in milliseconds (default 100)
});
