self.addEventListener('message', function(msg) {
	var data = msg.data;	
	var lines = data.split('\n');
	var tasks = [];
	for (var indx = 0; indx < lines.length; indx++) {
		var val = lines[indx];
		if (indx >= 1 && val) {
			var task = loadTask(val);
			if (task) {
				tasks.push(task);
			}
		}
	};
	self.postMessage(tasks);
}, false);

function loadTask(csvTask) {
	var tokens = csvTask.split(',');
	if (tokens.length == 3) {
		var task = {};
		task.task = tokens[0];
		task.requiredBy = tokens[1];
		task.category = tokens[2];
		return task;
	}
	return null;
}
