const spawner = require('child_process').spawn;

function send_data(prompt) {
    return new Promise((resolve, reject) => {
        const python_process = spawner('python', ['./python.py', prompt]);

        let result = '';
        python_process.stdout.on('data', (data) => {
            result += data.toString();
        });

        python_process.on('close', (code) => {
            if (code === 0) {
                resolve(result);
            } else {
                reject(new Error(`Child process exited with code ${code}`));
            }
        });

        python_process.stderr.on('data', (data) => {
            reject(new Error(data.toString()));
        });
    });
}

send_data('your prompt here')
    .then(result => console.log(result))
    .catch(error => console.error('Error:', error));
