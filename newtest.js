const diff = require('deep-diff');
const { exec } = require('child_process');
const fs = require('fs');

const obj1 = {
	"color": {
		"background": {
			"fg": {
				"type": "color",
				"value": "#FACADE",
				"rawValue": "#FACADE"
			},
			"bg": {
				"type": "color",
				"value": "#FA3AD1",
				"rawValue": "#FA3AD1"
			}
		}
	}

}

const obj2 = {
	"color": {
		"background": {
			"fg": {
				"type": "color",
				"value": "#FACADE",
				"rawValue": "#FACADE"
			},
			"bg": {
				"type": "color",
				"value": "#FA3AD1",
				"rawValue": "#FA3AD1"
			},
			"test": {
				"type": "color",
				"value": "#e3e3e3",
				"rawValue": "#e3e3e3"
			}

		}
	}

}

async function readTokensBasicJson() {
	const filePath = 'tokens/basic.json';
  
	return new Promise((resolve, reject) => {
	  fs.readFile(filePath, 'utf8', (error, data) => {
		if (error) {
		  console.error(`Error reading file: ${error.message}`);
		  return reject(error);
		}
  
		try {
		  // Parse the JSON data and store it in a new object
		  const jsonObject = JSON.parse(data);
		  resolve(jsonObject);
		} catch (parseError) {
		  console.error('Error parsing JSON data:', parseError.message);
		  reject(parseError);
		}
	  });
	});
  }


async function getGitShowOutput(branchName) {
	const command = `git show ${branchName}:tokens/basic.json`;
  
	return new Promise((resolve, reject) => {
	  exec(command, (error, stdout, stderr) => {
		if (error) {
		  console.error(`Error executing the command: ${error.message}`);
		  return reject(error);
		}
  
		if (stderr) {
		  console.error(`Command stderr: ${stderr}`);
		  return reject(new Error(stderr));
		}
  
		try {
		  // Parse the stdout (output) as a JSON object
		  const jsonObject = JSON.parse(stdout);
		  // If everything is successful, resolve the parsed JSON object
		  resolve(jsonObject);
		} catch (parseError) {
		  console.error('Error parsing the output as JSON:', parseError.message);
		  reject(parseError);
		}
	  });
	});
  }

  
  async function compare() {
	const mainTokens = await getGitShowOutput('main')
	const branchTokens = await readTokensBasicJson()

	const result = diff(mainTokens, branchTokens)
	console.log(result)



  }
  // Usage example:
  getGitShowOutput('main')
  .then(jsonObject => {

	console.log(jsonObject);
    // You can use the 'jsonObject' as needed
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

  compare()